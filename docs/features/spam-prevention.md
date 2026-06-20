# Spam prevention

Contact forms use a lightweight honeypot + timing guard.

## Honeypot

`features/spam-prevention/form-honeypot.tsx` renders a hidden `_honeypot` field. Bots fill it; humans never see it. If present on submit, the server silently accepts (no error message to avoid tipping off bots).

## Timing guard

`useSpamPrevention()` records when the form mounted. Submissions faster than **2 seconds** are rejected. The submit button stays disabled until the timer elapses.

## Server validation

`submitContactForm` re-validates both checks with Zod — never trust the client alone.
