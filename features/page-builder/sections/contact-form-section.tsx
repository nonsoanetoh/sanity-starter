"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "~/features/page-builder/actions/submit-contact-form";
import { FormHoneypot } from "~/features/spam-prevention/form-honeypot";
import { useCanSubmit, useSpamPrevention } from "~/features/spam-prevention/use-spam-prevention";
import { trackEvent } from "~/features/umami/tracking";

type ContactFormSectionProps = {
  headline?: string | null;
  subheadline?: string | null;
  submitLabel?: string | null;
  successMessage?: string | null;
};

export function ContactFormSection({
  headline,
  subheadline,
  submitLabel = "Send message",
  successMessage = "Thanks — we received your message.",
}: ContactFormSectionProps) {
  const { startedAt } = useSpamPrevention();
  const canSubmit = useCanSubmit(startedAt);
  const [state, formAction, pending] = useActionState(submitContactForm, null);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (state?.ok && !trackedRef.current) {
      trackedRef.current = true;
      trackEvent("contact-form-submit", { section: "contact-form" });
    }
  }, [state?.ok]);

  if (state?.ok) {
    return (
      <section className="py-24 px-4 border-t border-(--color-border)">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-lg font-medium">{successMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 border-t border-(--color-border)">
      <div className="max-w-xl mx-auto">
        {headline && (
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
            {headline}
          </h2>
        )}
        {subheadline && (
          <p className="text-(--color-muted-foreground) text-center mb-8">{subheadline}</p>
        )}

        <form action={formAction} className="relative space-y-4">
          <FormHoneypot />
          <input type="hidden" name="_startedAt" value={startedAt} />

          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-(--color-border) bg-(--color-background) px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-(--color-border) bg-(--color-background) px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-background) px-3 py-2.5 text-sm resize-y"
            />
          </div>

          {state?.ok === false && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !canSubmit}
            className="w-full rounded-lg bg-(--color-primary) text-(--color-primary-foreground) px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Sending…" : submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
