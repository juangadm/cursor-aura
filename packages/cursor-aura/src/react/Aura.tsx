'use client'

import { useEffect, useRef } from 'react'
import { generateThemedCursors, getCursorCSS, clearCursorCache } from '../core/cursors'

export interface AuraProps {
  /**
   * The shadow color for the cursor
   * Accepts any valid CSS color: hex, rgb, hsl, or CSS variable
   * @default '#000'
   */
  color?: string
  /**
   * Shadow offset in pixels (not yet implemented - reserved for future use)
   * @default 2
   */
  offset?: number
}

/**
 * Aura - Themed cursor shadows for the web
 *
 * Renders nothing visible - applies custom cursors via CSS custom properties
 * on the document root. The shadow color updates automatically when the
 * color prop changes.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <Aura color="#0C3EFF" />
 *
 * // With CSS variable (updates with theme)
 * <Aura color="var(--theme-color)" />
 * ```
 */
export function Aura({ color = '#000' }: AuraProps) {
  const lastColorRef = useRef<string | null>(null)

  useEffect(() => {
    // Skip on touch devices - no cursor to shadow
    if (typeof window === 'undefined') return

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const applyThemedCursors = () => {
      // Resolve CSS variable if needed
      let resolvedColor = color
      if (color.startsWith('var(')) {
        const root = document.documentElement
        const computedStyle = getComputedStyle(root)
        const varName = color.slice(4, -1).trim()
        resolvedColor = computedStyle.getPropertyValue(varName).trim() || '#000'
      }

      // Skip if color hasn't changed
      if (resolvedColor === lastColorRef.current) return
      lastColorRef.current = resolvedColor

      // Generate cursor data URIs with shadow
      const cursors = generateThemedCursors(resolvedColor)
      const root = document.documentElement

      // Apply to CSS custom properties on :root
      root.style.setProperty(
        '--cursor-default',
        getCursorCSS(cursors.default, 'default', 'auto')
      )
      root.style.setProperty(
        '--cursor-pointer',
        getCursorCSS(cursors.pointer, 'pointer', 'pointer')
      )
      root.style.setProperty(
        '--cursor-grab',
        getCursorCSS(cursors.grab, 'grab', 'grab')
      )
      root.style.setProperty(
        '--cursor-grabbing',
        getCursorCSS(cursors.grabbing, 'grabbing', 'grabbing')
      )
      root.style.setProperty(
        '--cursor-text',
        getCursorCSS(cursors.text, 'text', 'text')
      )

      // Apply base cursor styles to common elements
      const styleId = 'aura-cursor-styles'
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null

      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
      }

      styleEl.textContent = `
        html, body { cursor: var(--cursor-default) !important; }
        a, button, [role="button"], input[type="submit"], input[type="button"],
        input[type="reset"], input[type="checkbox"], input[type="radio"],
        select, summary, [onclick], [tabindex]:not([tabindex="-1"]) {
          cursor: var(--cursor-pointer) !important;
        }
        input[type="text"], input[type="email"], input[type="password"],
        input[type="search"], input[type="tel"], input[type="url"],
        input[type="number"], textarea, [contenteditable="true"], [data-cursor="text"] {
          cursor: var(--cursor-text) !important;
        }
        [draggable="true"], .draggable { cursor: var(--cursor-grab) !important; }
        [draggable="true"]:active, .draggable:active, .dragging {
          cursor: var(--cursor-grabbing) !important;
        }
      `
    }

    // Apply immediately
    applyThemedCursors()

    // Re-apply when color changes (for CSS variables that might update)
    const observer = new MutationObserver(() => {
      if (color.startsWith('var(')) {
        lastColorRef.current = null // Force re-resolve
        applyThemedCursors()
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme']
    })

    // Listen for custom theme change events
    const handleThemeChange = () => {
      lastColorRef.current = null
      applyThemedCursors()
    }
    window.addEventListener('themechange', handleThemeChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('themechange', handleThemeChange)
    }
  }, [color])

  // Re-apply when color prop changes
  useEffect(() => {
    lastColorRef.current = null // Force update on next render
  }, [color])

  return null
}

export default Aura
