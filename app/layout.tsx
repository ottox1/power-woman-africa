import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const siteUrl = 'https://powerwomanafrica.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Power Woman Africa | The Leadership Mastermind Experience',
  description: 'An invitation-led leadership mastermind for African women operating at scale or preparing for it. March 12–13, 2026 · Ikoyi, Lagos, Nigeria.',
  keywords: [
    'Power Woman Africa',
    'African women leadership',
    'leadership masterclass',
    'women leadership Lagos',
    'Udo Okonjo',
    'women wealth legacy',
    'African women executives',
    'leadership conference Nigeria',
  ],
  openGraph: {
    title: 'Power Woman Africa | Leadership Mastermind 2026',
    description: 'An invitation-led leadership mastermind for African women operating at scale. March 12–13, Lagos.',
    url: siteUrl,
    siteName: 'Power Woman Africa',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power Woman Africa | Leadership Mastermind 2026',
    description: 'An invitation-led leadership mastermind for African women operating at scale.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <meta name="theme-color" content="#1B3B2D" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
