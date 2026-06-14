import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import { SanityLive } from '@/sanity/live'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Sanity Starter',
    template: '%s | Sanity Starter',
  },
  description: 'A Sanity + Next.js + Cloudflare starter',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
