'use client'

import { useState, useEffect, startTransition } from 'react'
import { Aura } from 'cursor-aura'
import Link from 'next/link'
import { CodeBlock } from '../components/CodeBlock'

type Theme = 'pink' | 'orange' | 'blue' | 'purple' | 'black'

const THEMES: { name: Theme; color: string }[] = [
  { name: 'pink', color: '#FF6183' },
  { name: 'orange', color: '#FF9627' },
  { name: 'blue', color: '#0C3EFF' },
  { name: 'purple', color: '#8868EA' },
  { name: 'black', color: '#000000' },
]

const SECTIONS = [
  { id: 'installation', label: 'Installation' },
  { id: 'react', label: 'React' },
  { id: 'vanilla', label: 'Vanilla JS' },
  { id: 'props', label: 'Props' },
  { id: 'accessibility', label: 'Accessibility' },
]

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function GettingStarted() {
  const [theme, setTheme] = useState<Theme>('black')
  const [hoveredTheme, setHoveredTheme] = useState<Theme | null>(null)
  const [activeSection, setActiveSection] = useState<string>('installation')
  const [isMobile, setIsMobile] = useState(false)

  // Hydration-Proof: sync React state from the inline script's DOM value
  useEffect(() => {
    const saved = document.documentElement.getAttribute('data-theme') as Theme | null
    if (saved && THEMES.some(t => t.name === saved)) {
      setTheme(saved)
    }
  }, [])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll spy for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -60% 0%' }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const themeColor = THEMES.find(t => t.name === theme)?.color || '#0C3EFF'

  return (
    <>
      <Aura color="var(--theme-color)" />

      <div style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '240px 1fr',
        background: '#fafafa',
      }}>
        {/* Left Sidebar */}
        {!isMobile && (
          <aside style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            borderRight: '1px solid var(--border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            background: '#fafafa',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <a href="https://aura.juangabriel.xyz" style={{
                fontSize: '16px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600',
                color: 'var(--foreground)',
                textDecoration: 'none',
              }}>Aura</a>
              <a href="https://juangabriel.xyz" target="_blank" rel="noopener noreferrer" style={{
                fontSize: '12px',
                fontWeight: '400',
                color: 'var(--muted)',
                textDecoration: 'none',
              }}>by Juan Gabriel</a>
            </div>

            <nav>
              <h3 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px',
              }}>
                Basics
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                  <Link href="/getting-started" style={{
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}>
                    Getting Started
                  </Link>
                </li>
              </ul>
            </nav>

            {/* GitHub Link in Sidebar */}
            <div style={{ marginTop: 'auto' }}>
              <a
                href="https://github.com/juangadm/cursor-aura"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </aside>
        )}

        {/* Main + Right TOC */}
        <div style={{
          display: 'flex',
          padding: isMobile ? '32px 24px' : '64px 48px',
          gap: '64px',
          maxWidth: '100%',
          overflow: 'hidden',
        }}>
          {/* Main Content */}
          <main style={{ maxWidth: '672px', flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}>
              Getting Started
            </h1>

            <p style={{
              fontSize: '16px',
              color: 'var(--muted)',
              lineHeight: '1.7',
              marginBottom: '12px',
            }}>
              Aura adds themed drop shadows to your cursor. The shadow color updates automatically when your theme changes.
            </p>
            <p style={{
              fontSize: '13px',
              color: 'var(--muted)',
              marginBottom: '20px',
              lineHeight: '1.5',
            }}>
              Still in beta. Works best in Chrome and Chromium-based browsers. Safari support is improving.
            </p>

            {/* Theme color selector */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '48px', flexWrap: 'wrap' }}>
              {THEMES.map(({ name, color }) => {
                const isActive = theme === name
                const isHovered = hoveredTheme === name

                return (
                  <button
                    key={name}
                    onClick={() => {
                      document.documentElement.setAttribute('data-theme', name)
                      try { localStorage.setItem('aura-theme', name) } catch {}
                      startTransition(() => setTheme(name))
                    }}
                    onMouseEnter={() => setHoveredTheme(name)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    style={{
                      background: isActive
                        ? `rgba(${hexToRgb(color)}, 0.15)`
                        : isHovered
                          ? `rgba(${hexToRgb(color)}, 0.08)`
                          : 'rgba(30, 30, 30, 0.05)',
                      border: isActive ? `1px solid ${color}` : '1px solid rgba(30, 30, 30, 0.08)',
                      borderRadius: '2px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '300',
                      letterSpacing: '-0.3px',
                      lineHeight: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: isHovered ? color : (isActive ? color : 'rgb(30, 30, 30)'),
                      fontFamily: 'monospace',
                    }}
                    aria-label={`Switch to ${name} theme`}
                  >
                    <span style={{ color }}>■</span>
                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                  </button>
                )
              })}
            </div>

            {/* Installation */}
            <section id="installation" style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}>
                Installation
              </h2>
              <CodeBlock>npm install cursor-aura</CodeBlock>
            </section>

            {/* React */}
            <section id="react" style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}>
                React
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: '1.7',
                marginBottom: '16px',
              }}>
                Add the component anywhere in your app:
              </p>
              <CodeBlock>{`import { Aura } from 'cursor-aura'

export default function App() {
  return (
    <>
      <Aura color="var(--your-theme-color)" />
      {/* rest of your app */}
    </>
  )
}`}</CodeBlock>
            </section>

            {/* Vanilla JS */}
            <section id="vanilla" style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}>
                Vanilla JS
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: '1.7',
                marginBottom: '16px',
              }}>
                For non-React sites:
              </p>
              <CodeBlock>{`<script type="module">
  import { AuraVanilla as Aura } from 'https://esm.sh/cursor-aura/vanilla'

  Aura.init({ color: '#0C3EFF' })

  // Update color later
  // Aura.setColor('#FF6183')

  // Clean up
  // Aura.destroy()
</script>`}</CodeBlock>
            </section>

            {/* Props */}
            <section id="props" style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}>
                Props
              </h2>
              <div style={{
                overflowX: 'auto',
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid var(--border)',
                      textAlign: 'left',
                    }}>
                      <th style={{ padding: '12px 16px 12px 0', fontWeight: '600' }}>Prop</th>
                      <th style={{ padding: '12px 16px', fontWeight: '600' }}>Type</th>
                      <th style={{ padding: '12px 16px', fontWeight: '600' }}>Default</th>
                      <th style={{ padding: '12px 0 12px 16px', fontWeight: '600' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px 12px 0' }}>
                        <code>color</code>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>string</td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>#000</td>
                      <td style={{ padding: '12px 0 12px 16px', color: 'var(--muted)' }}>Shadow color (hex, rgb, or CSS variable)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Accessibility */}
            <section id="accessibility" style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}>
                Accessibility
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: '1.7',
              }}>
                Aura automatically respects user preferences:
              </p>
              <ul style={{
                marginTop: '12px',
                paddingLeft: '20px',
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: '1.7',
              }}>
                <li>
                  <strong style={{ color: 'var(--foreground)' }}>Touch-only devices:</strong> Automatically skipped when no mouse or trackpad is detected
                </li>
              </ul>
            </section>
          </main>

          {/* Right TOC */}
          {!isMobile && (
            <aside style={{
              width: '160px',
              flexShrink: 0,
              position: 'sticky',
              top: '64px',
              height: 'fit-content',
            }}>
              <h4 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                On this page
              </h4>
              <nav>
                {SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: activeSection === id ? 'var(--foreground)' : 'var(--muted)',
                      fontWeight: activeSection === id ? '500' : '400',
                      marginBottom: '8px',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        fontSize: '14px',
        color: 'var(--muted)',
        background: '#fafafa',
      }}>
        Made by{' '}
        <a
          href="https://juangabriel.xyz"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--foreground)', fontWeight: '500' }}
        >
          Juan Gabriel
        </a>
        {' · '}
        Cursor inspired by{' '}
        <a
          href="https://aresluna.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--foreground)', fontWeight: '500' }}
        >
          Marcin Wichary
        </a>
      </footer>
    </>
  )
}
