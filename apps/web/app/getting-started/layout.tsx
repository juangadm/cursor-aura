import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Learn how to install and configure Aura, a themed cursor shadow library for React and vanilla JavaScript.',
  openGraph: {
    title: 'Getting Started with Aura',
    description: 'Install and configure Aura for React or vanilla JavaScript.',
    url: '/getting-started',
  },
  alternates: {
    canonical: '/getting-started',
  },
}

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
