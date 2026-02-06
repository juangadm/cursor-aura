import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aura - Themed cursor shadows for the web',
  description: 'Add beautiful themed cursor shadows to your website. Your cursor is the most-used element on your site. Make it feel intentional.',
  openGraph: {
    title: 'Aura - Themed cursor shadows for the web',
    description: 'Add beautiful themed cursor shadows to your website.',
    url: 'https://aura.juangabriel.xyz',
    siteName: 'Aura',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura - Themed cursor shadows for the web',
    description: 'Add beautiful themed cursor shadows to your website.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="black">
      <head>
        {/* Hydration-Proof: set correct theme before React hydrates so
            var(--theme-color) resolves to the saved value on first paint.
            Without this, the cursor shadow flashes the wrong color. */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('aura-theme');
            if (t) document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
