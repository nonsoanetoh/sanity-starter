# Contact forms

Contact form submissions are saved to Sanity and optionally emailed via Resend.

## How it works

1. Add a **Contact Form Section** to any page in the page builder
2. Visitor submits the form on the frontend
3. Server action `submitContactForm` validates input and spam checks
4. A `contactFormSubmission` document is created in Sanity
5. If Resend is configured, notification emails are sent to addresses in **Site → Forms**

Implementation: `features/page-builder/actions/submit-contact-form.ts`

## Required setup

### Editor token

Create an **Editor** API token at [sanity.io/manage](https://sanity.io/manage) → **API → Tokens**.

```env
SANITY_API_EDIT_TOKEN=your-editor-token
```

Without this token, submissions fail silently from the visitor's perspective (generic error message).

### View submissions in Studio

Open **Form Submissions** in the Studio sidebar. Documents are read-only — editors cannot create or edit them manually.

Each submission stores:

- Name, email, message
- `submittedAt` timestamp

## Email notifications (optional)

### Resend setup

1. Create an account at [resend.com](https://resend.com)
2. Verify a sending domain (or use Resend's sandbox for testing)
3. Create an API key

```env
RESEND_API_KEY=re_xxxxxxxx
RESEND_EMAIL_FROM=notifications@yourdomain.com
```

### Studio recipients

In Studio → **Site → Forms**, add one or more **Form notification emails**.

Email is sent only when:

- Both `RESEND_API_KEY` and `RESEND_EMAIL_FROM` are set
- At least one notification email is configured on the Site document
- The submission passes spam checks

Submissions still save to Sanity if email is not configured.

## Spam prevention

Contact forms use honeypot + timing guards — see [spam-prevention.md](spam-prevention.md). Full setup: [contact-forms.md](contact-forms.md).

## Section fields

| Field | Purpose |
|-------|---------|
| Headline | Section title |
| Subheadline | Supporting copy |
| Submit label | Button text (default: "Send message") |
| Success message | Shown after successful submit |

## Custom events

Successful submissions automatically fire `trackEvent('contact-form-submit')` when Umami is configured.

## Production checklist

- [ ] `SANITY_API_EDIT_TOKEN` set on Vercel
- [ ] Contact Form Section added to a page
- [ ] Test submission appears in Studio → Form Submissions
- [ ] (Optional) Resend env vars + notification emails configured
- [ ] (Optional) Umami configured — submissions tracked automatically
