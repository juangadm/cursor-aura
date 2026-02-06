'use client'

import { useState, useEffect, useRef, startTransition } from 'react'
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
  const [theme, setTheme] = useState<Theme>('black')
  const [hoveredTheme, setHoveredTheme] = useState<Theme | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Custom drag state (mouse-based, not HTML5)
  const [itemPosition, setItemPosition] = useState(0) // 0-3 grid position
  const [isDragging, setIsDragging] = useState(false)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 }) // cursor position
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }) // click offset from center
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Hydration-Proof: sync React state from the inline script's DOM value.
  // The layout's <script> already set data-theme before paint, so
  // var(--theme-color) is correct from first frame. This just aligns state.
  useEffect(() => {
    const saved = document.documentElement.getAttribute('data-theme') as Theme | null
    if (saved && THEMES.some(t => t.name === saved)) {
      setTheme(saved)
    }
  }, [])

  // Custom drag handlers (mouse-based to maintain cursor control)
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    })
    setDragPos({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }

  const handleDrop = (slotIndex: number) => {
    if (isDragging && slotIndex !== itemPosition) {
      setItemPosition(slotIndex)
    }
    setIsDragging(false)
  }

  // Portal-Proof: use ownerDocument.defaultView for correct window context
  useEffect(() => {
    if (!isDragging) return

    const node = gridRef.current
    const doc = node?.ownerDocument ?? document
    const win = doc.defaultView || window

    // Apply grabbing cursor globally during drag
    doc.body.classList.add('dragging')

    const handleMouseMove = (e: MouseEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => setIsDragging(false)

    win.addEventListener('mousemove', handleMouseMove)
    win.addEventListener('mouseup', handleMouseUp)

    return () => {
      doc.body.classList.remove('dragging')
      win.removeEventListener('mousemove', handleMouseMove)
      win.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const themeColor = THEMES.find(t => t.name === theme)?.color || '#0C3EFF'

  return (
    <>
      {/* Hydration-Proof: use CSS variable so the cursor resolves its
          color from the inline script's data-theme, not React state.
          No flash of wrong cursor shadow on load. */}
      <Aura color="var(--theme-color)" />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
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
              AURA <span style={{ fontSize: '16px', fontWeight: '400', color: 'var(--muted)' }}>(Beta)</span>
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'var(--muted)',
              marginBottom: '12px',
            }}>
              Themed cursor shadows for the web.
            </p>
            <p style={{
              fontSize: '13px',
              color: 'var(--muted)',
              marginBottom: '24px',
              lineHeight: '1.5',
            }}>
              Still in beta. Works best in Chrome and Chromium-based browsers. Safari support is improving.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link
                href="/getting-started"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: themeColor,
                  border: `1px solid ${themeColor}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  color: '#fff',
                }}
              >
                Get Started
              </Link>
              <a
                href="https://github.com/juangadm/cursor-aura"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredButton('github')}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  border: hoveredButton === 'github' ? `1px solid ${themeColor}` : '1px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  color: hoveredButton === 'github' ? themeColor : 'var(--foreground)',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
              >
                GitHub
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          </div>

          {/* Demo Sections - Sonner style */}
          <div style={{ width: '100%', maxWidth: '500px' }}>

            {/* Colors Section */}
            <section style={{ marginBottom: '64px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--foreground)',
                marginBottom: '8px',
              }}>
                Colors
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: '1.5',
              }}>
                Customize the shadow color of the cursor.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {THEMES.map(({ name, color }) => {
                  const isActive = theme === name
                  const isHovered = hoveredTheme === name
                  const showColor = isActive || isHovered

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
                        backgroundColor: 'rgb(253, 253, 253)',
                        boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                        border: showColor ? `1px solid ${color}` : '1px solid #d4d4d4',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: showColor ? color : '#1a1a1a',
                      }}
                      aria-label={`Switch to ${name} theme`}
                    >
                      <span style={{ color }}>■</span>
                      <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Hover Section */}
            <section style={{ marginBottom: '64px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--foreground)',
                marginBottom: '8px',
              }}>
                Hover
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: '1.5',
              }}>
                Hover over buttons to see the pointer cursor with shadow.
              </p>
              <div style={{ marginTop: '16px' }}>
                <button
                  onMouseEnter={() => setHoveredButton('hover')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    backgroundColor: 'rgb(253, 253, 253)',
                    boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                    border: hoveredButton === 'hover' ? `1px solid ${themeColor}` : '1px solid #d4d4d4',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    color: hoveredButton === 'hover' ? themeColor : '#1a1a1a',
                  }}
                >
                  Hover
                </button>
              </div>
            </section>

            {/* Drag Section */}
            <section style={{ marginBottom: '64px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--foreground)',
                marginBottom: '8px',
              }}>
                Drag
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: '1.5',
              }}>
                Drag the item to an empty slot to see grab and grabbing cursors.
              </p>
              <div
                ref={gridRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, auto)',
                  gap: '12px',
                  marginTop: '16px',
                  justifyContent: 'start',
                }}
              >
                {[0, 1, 2, 3].map((slotIndex) => {
                  const hasItem = itemPosition === slotIndex && !isDragging
                  const isGhostSlot = itemPosition === slotIndex && isDragging
                  const isSlotHovered = hoveredSlot === slotIndex && isDragging && itemPosition !== slotIndex

                  return (
                    <div
                      key={slotIndex}
                      onMouseEnter={() => setHoveredSlot(slotIndex)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onMouseUp={() => handleDrop(slotIndex)}
                      style={{
                        minWidth: '107px',
                        minHeight: '37px',
                        border: hasItem
                          ? 'none'
                          : isSlotHovered
                            ? `1px dashed ${themeColor}`
                            : '1px dashed #d4d4d4',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.15s ease',
                      }}
                    >
                      {hasItem && (
                        <button
                          ref={buttonRef}
                          className="draggable"
                          onMouseDown={handleDragStart}
                          onMouseEnter={() => setHoveredButton('drag-item')}
                          onMouseLeave={() => setHoveredButton(null)}
                          style={{
                            backgroundColor: 'rgb(253, 253, 253)',
                            boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                            border: hoveredButton === 'drag-item'
                              ? `1px solid ${themeColor}`
                              : '1px solid #d4d4d4',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono)',
                            color: hoveredButton === 'drag-item' ? themeColor : '#1a1a1a',
                            userSelect: 'none',
                          }}
                        >
                          ★ Drag me
                        </button>
                      )}
                      {isGhostSlot && (
                        <div
                          style={{
                            backgroundColor: 'rgb(253, 253, 253)',
                            boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset',
                            border: '1px solid #d4d4d4',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono)',
                            color: '#1a1a1a',
                            opacity: 0.3,
                            userSelect: 'none',
                          }}
                        >
                          ★ Drag me
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* Floating drag element */}
              {isDragging && (
                <div
                  className="dragging"
                  style={{
                    position: 'fixed',
                    left: dragPos.x - dragOffset.x,
                    top: dragPos.y - dragOffset.y,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    backgroundColor: 'rgb(253, 253, 253)',
                    boxShadow: 'rgb(227, 227, 227) -2px -2px 0px 0px inset, 0 4px 12px rgba(0,0,0,0.15)',
                    border: `1px solid ${themeColor}`,
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    color: themeColor,
                    userSelect: 'none',
                  }}
                >
                  ★ Drag me
                </div>
              )}
            </section>

            {/* Highlight Section */}
            <section style={{ marginBottom: '64px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--foreground)',
                marginBottom: '8px',
              }}>
                Highlight
              </h3>
              <p
                data-cursor="text"
                style={{
                  fontSize: '14px',
                  color: 'var(--muted)',
                  lineHeight: '1.5',
                  userSelect: 'text',
                }}
              >
                Select this text to see the I-beam cursor with shadow. The effect is subtle but intentional, adding a layer of polish to your interface.
              </p>
            </section>

          </div>

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
              Aura generates custom SVG cursors based on macOS designs with baked-in colored shadows, then applies them via CSS custom properties. No runtime overhead &mdash; just static CSS after the initial render.
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
              Or paste this into Claude Code, Cursor, or any AI coding tool:
            </p>
            <CodeBlock>{`Install the cursor-aura npm package and add it to my app.
It replaces the default cursor with a themed SVG cursor that has a colored drop shadow.

npm install cursor-aura

For React: import { Aura } from 'cursor-aura' and render <Aura color="${themeColor}" /> at the root.
For vanilla JS: import { AuraVanilla as Aura } from 'cursor-aura/vanilla' and call Aura.init({ color: '${themeColor}' }).

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
