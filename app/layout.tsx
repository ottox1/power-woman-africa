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
  title: 'Power Woman Africa | The Leadership Mastermind Experience — Johannesburg',
  description: 'A private, in-person mastermind for women operating at or preparing for scale. Saturday 21 March 2026 · Saxon Hotel · Sandhurst · Johannesburg. 15 spots only.',
  keywords: [
    'Power Woman Africa',
    'African women leadership',
    'leadership mastermind',
    'women leadership Johannesburg',
    'Udo Okonjo',
    'women wealth legacy',
    'African women executives',
    'leadership mastermind South Africa',
    'Saxon Hotel Johannesburg',
  ],
  openGraph: {
    title: 'Power Woman Africa | Leadership Mastermind — Johannesburg 2026',
    description: 'A private, in-person mastermind for women operating at or preparing for scale. Saturday 21 March 2026 · Saxon Hotel · Johannesburg.',
    url: siteUrl,
    siteName: 'Power Woman Africa',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power Woman Africa | Leadership Mastermind — Johannesburg 2026',
    description: 'A private, in-person mastermind for women operating at or preparing for scale. 21 March 2026 · Saxon Hotel · Johannesburg.',
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
