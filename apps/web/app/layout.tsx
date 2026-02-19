import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://aura.juangabriel.xyz'),
  title: {
    default: 'Aura - Themed cursor shadows for the web',
    template: '%s | Aura',
  },
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
  alternates: {
    canonical: '/',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: 'Aura',
              description: 'Themed cursor shadows for the web. Replaces default browser cursors with macOS-style SVG cursors that have colored drop shadows.',
              url: 'https://aura.juangabriel.xyz',
              codeRepository: 'https://github.com/juangadm/cursor-aura',
              programmingLanguage: ['TypeScript', 'React'],
              runtimePlatform: 'Browser',
              author: {
                '@type': 'Person',
                name: 'Juan Gabriel',
                url: 'https://juangabriel.xyz',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
