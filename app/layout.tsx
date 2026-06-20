import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { UmamiScript } from '~/components/umami-script'
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
    default: 'The Content Architecture',
    template: '%s | The Content Architecture',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <UmamiScript />
      </body>
    </html>
  )
}
