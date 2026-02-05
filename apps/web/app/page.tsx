'use client'

import { useState, useEffect } from 'react'
import { Aura } from 'cursor-aura'
import Link from 'next/link'
import { CodeBlock } from './components/CodeBlock'

type Theme = 'pink' | 'orange' | 'blue' | 'purple' | 'black'

const THEMES: { name: Theme; color: string }[] = [
  { name: 'pink', color: '#FF6183' },
  { name: 'orange', color: '#FF9627' },
  { name: 'blue', color: '#0C3EFF' },
  { name: 'purple', color: '#8868EA' },
  { name: 'black', color: '#000000' },
]

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>('blue')
  const [hoveredTheme, setHoveredTheme] = useState<Theme | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const themeColor = THEMES.find(t => t.name === theme)?.color || '#0C3EFF'

  return (
    <>
      <Aura color={themeColor} />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* GitHub Link */}
          <a
            href="https://github.com/juangadm/cursor-aura"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--muted)',
            }}
          >
            GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px 24px',
          gap: '48px',
        }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{
              fontSize: '64px',
              fontWeight: '400',
              letterSpacing: '-2px',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
            }}>
              AURA
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'var(--muted)',
              marginBottom: '8px',
            }}>
              Themed cursor shadows for the web.
            </p>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted)',
              lineHeight: '1.6',
            }}>
              Your cursor is the most-used element on your site.<br />
              Make it feel intentional.
            </p>
          </div>

          {/* Playground */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
          }}>
            {/* Theme Selectors - inside playground */}
            <div style={{
              display: 'flex',
              gap: '2px',
              marginBottom: '24px',
              justifyContent: 'center',
            }}>
              {THEMES.map(({ name, color }) => {
                const isActive = theme === name
                const isHovered = hoveredTheme === name

                return (
                  <button
                    key={name}
                    onClick={() => setTheme(name)}
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
                      fontFamily: 'var(--font-mono)',
                    }}
                    aria-label={`Switch to ${name} theme`}
                  >
                    <span style={{ color }}>■</span>
                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                  </button>
                )
              })}
            </div>

            {/* Demo Buttons Row */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
            }}>
              {/* Hover Button */}
              <button
                style={{
                  flex: 1,
                  backgroundColor: 'rgb(253, 253, 253)',
                  fontSize: '13px',
                  lineHeight: '16px',
                  letterSpacing: '0.5px',
                  color: themeColor,
                  boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                  border: `1px solid ${themeColor}`,
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Hover
              </button>

              {/* Drag me → Button */}
              <button
                draggable
                style={{
                  flex: 1,
                  backgroundColor: 'rgb(253, 253, 253)',
                  fontSize: '13px',
                  lineHeight: '16px',
                  letterSpacing: '0.5px',
                  color: themeColor,
                  boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                  border: `1px solid ${themeColor}`,
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-mono)',
                  position: 'relative',
                }}
              >
                Drag me →
              </button>

              {/* ← Drag me Button */}
              <button
                draggable
                style={{
                  flex: 1,
                  backgroundColor: 'rgb(253, 253, 253)',
                  fontSize: '13px',
                  lineHeight: '16px',
                  letterSpacing: '0.5px',
                  color: themeColor,
                  boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                  border: `1px solid ${themeColor}`,
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-mono)',
                  position: 'relative',
                }}
              >
                ← Drag me
              </button>
            </div>

            {/* Text Selection Area */}
            <div
              data-cursor="text"
              style={{
                padding: '16px',
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: '1.6',
                userSelect: 'text',
              }}
            >
              Select this text to see the I-beam cursor with a shadow. The effect is subtle but intentional, adding a layer of polish to your interface.
            </div>

            {/* Hint */}
            <p style={{
              marginTop: '24px',
              fontSize: '13px',
              color: 'var(--muted)',
              textAlign: 'center',
            }}>
              Notice your cursor?
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/getting-started"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'var(--foreground)',
              color: 'var(--background)',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* How It Works */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            marginTop: '32px',
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              How It Works
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--muted)',
              lineHeight: '1.7',
              marginBottom: '20px',
            }}>
              Aura generates SVG cursors with baked-in shadows and applies them via CSS custom properties.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: themeColor, fontWeight: '600', fontSize: '14px' }}>SVG-based</span>
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Crisp at any resolution</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: themeColor, fontWeight: '600', fontSize: '14px' }}>Lightweight</span>
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>No runtime, just CSS</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: themeColor, fontWeight: '600', fontSize: '14px' }}>Themeable</span>
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Updates instantly when color changes</span>
              </li>
            </ul>
          </div>

          {/* Installation */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            marginTop: '32px',
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Installation
            </h2>

            <CodeBlock>npm install cursor-aura</CodeBlock>

            <div style={{ marginTop: '16px' }}>
              <CodeBlock>{`import { Aura } from 'cursor-aura'

<Aura color="${themeColor}" />`}</CodeBlock>
            </div>
          </div>

          {/* AI-assisted installation */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            padding: '20px',
            background: '#fafafa',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}>
            <p style={{
              fontSize: '13px',
              color: 'var(--muted)',
              marginBottom: '12px',
            }}>
              Not a developer? Copy this prompt into Claude Code, Cursor, or Codex:
            </p>
            <CodeBlock>{`Add Aura cursor shadows to my website.
Use the color ${themeColor} for the shadow.

Note: Aura automatically overrides existing cursor styles.
No code changes needed besides adding the component.

Install: npm install cursor-aura
Docs: https://aura.juangabriel.xyz/getting-started`}</CodeBlock>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          padding: '24px',
          borderTop: '1px solid var(--border)',
          fontSize: '14px',
          color: 'var(--muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            Made by{' '}
            <a
              href="https://juangabriel.xyz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--foreground)', fontWeight: '500' }}
            >
              Juan Gabriel
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>v0.1.0</span>
            <a
              href="https://www.npmjs.com/package/cursor-aura"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
            >
              npm
            </a>
            <a
              href="https://github.com/juangadm/cursor-aura"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
