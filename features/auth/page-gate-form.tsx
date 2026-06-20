'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PageGateForm({ docId }: { docId: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/gate/page', {
      method: 'POST',
      body: JSON.stringify({ docId, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-balance">Protected content</h2>
        <p className="mb-6 text-sm text-(--color-muted-foreground)">
          Enter the password to view this content.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full rounded-lg border border-(--color-border) bg-(--color-background) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--color-primary)/20"
          />
          {error && <p className="text-sm text-red-500">Incorrect password. Try again.</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
