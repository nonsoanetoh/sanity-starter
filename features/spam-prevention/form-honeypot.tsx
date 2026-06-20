'use client'

/** Hidden honeypot field — bots fill this, humans never see it. */
export function FormHoneypot() {
  return (
    <input
      type="text"
      name="_honeypot"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  )
}
