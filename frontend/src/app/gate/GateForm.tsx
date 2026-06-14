'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  redirect: string
}

export function GateForm({ redirect }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/gate', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      router.push(redirect)
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-balance">
          Password required
        </h1>
        <p className="text-sm text-(--color-muted-foreground) mb-6">
          This site is password protected.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full rounded-lg border border-(--color-border) bg-(--color-background) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--color-primary)/20"
          />
          {error && (
            <p className="text-sm text-red-500">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-lg bg-(--color-primary) text-(--color-primary-foreground) px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
