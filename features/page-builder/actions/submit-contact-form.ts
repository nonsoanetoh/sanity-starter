'use server'

import { z } from 'zod'
import { sanityFetch } from '~/features/sanity/fetch'
import { getSanityWriteClient } from '~/features/sanity/write-client'
import { MIN_SUBMIT_MS } from '~/features/spam-prevention/use-spam-prevention'
import { env } from '~/env'

const ContactFormSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  message: z.string().min(1).max(5000),
  _honeypot: z.string().max(0).optional(),
  _startedAt: z.coerce.number(),
})

type ActionResult =
  | { ok: true }
  | { ok: false; error: string }

const SITE_FORM_QUERY = `*[_type == "site"][0]{
  name,
  formNotificationEmails
}`

async function sendResendEmail(input: {
  to: string[]
  from: string
  subject: string
  html: string
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend error: ${response.status} ${body}`)
  }
}

export async function submitContactForm(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    _honeypot: formData.get('_honeypot') ?? '',
    _startedAt: formData.get('_startedAt'),
  })

  if (!parsed.success) {
    return { ok: false, error: 'Please check your entries and try again.' }
  }

  const { name, email, message, _honeypot, _startedAt } = parsed.data

  if (_honeypot) {
    return { ok: true }
  }

  if (Date.now() - _startedAt < MIN_SUBMIT_MS) {
    return { ok: false, error: 'Please wait a moment before submitting.' }
  }

  try {
    const client = getSanityWriteClient()
    await client.create({
      _type: 'contactFormSubmission',
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    })

    if (env.RESEND_API_KEY && env.RESEND_EMAIL_FROM) {
      const site = await sanityFetch<{
        name?: string | null
        formNotificationEmails?: string[] | null
      }>({
        query: SITE_FORM_QUERY,
        options: { next: { tags: ['site'] } },
      })

      const recipients = site?.formNotificationEmails?.filter(Boolean) ?? []
      if (recipients.length > 0) {
        await sendResendEmail({
          from: env.RESEND_EMAIL_FROM,
          to: recipients,
          subject: `New contact form submission — ${site?.name ?? 'Site'}`,
          html: `<p><strong>${name}</strong> (${email})</p><p>${message.replace(/\n/g, '<br>')}</p>`,
        })
      }
    }

    return { ok: true }
  } catch (error) {
    console.error('[submitContactForm]', error)
    return { ok: false, error: 'Something went wrong. Please try again later.' }
  }
}
