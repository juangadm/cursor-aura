'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  injectCursorStyles,
  setCursorVariables,
  resolveColor,
  removeCursorStyles,
  removeCursorVariables,
  hasPointerDevice,
} from '../core/apply'

export interface AuraProps {
  /**
   * The shadow color for the cursor.
   * Accepts any valid CSS color: hex, rgb, hsl, or CSS variable.
   * @default '#000'
   */
  color?: string
}

/**
 * Aura - Themed cursor shadows for the web
 *
 * Renders a hidden marker element to detect the correct document context
 * (portal-proof). Applies custom cursors via CSS custom properties on the
 * document root. The shadow color updates automatically when the
 * color prop changes.
 *
 * @example
 * ```tsx
 * <Aura color="#0C3EFF" />
 * <Aura color="var(--theme-color)" />
 * ```
 */
export function Aura({ color = '#000' }: AuraProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  // Activity-Proof: toggle media attribute to disable styles synchronously
  // when hidden by <Activity>. On hide, cleanup sets media="not all" before
  // paint so cursor styles don't leak into hidden containers.
  useLayoutEffect(() => {
    if (!styleRef.current) return
    styleRef.current.media = 'all'
    return () => {
      if (styleRef.current) styleRef.current.media = 'not all'
    }
  })

  // Portal-Proof: use ownerDocument to inject styles into the correct
  // document context (works in iframes, portals, and pop-out windows).
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const doc = node.ownerDocument
    const win = doc.defaultView || window

    if (!hasPointerDevice(win)) return

    styleRef.current = injectCursorStyles(doc)

    const apply = () => {
      setCursorVariables(resolveColor(color, doc), doc)
    }
    apply()

    // Watch for theme attribute changes (CSS variable resolution)
    const observer = new MutationObserver(() => {
      if (color.startsWith('var(')) apply()
    })
    observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    })

    win.addEventListener('themechange', apply)

    return () => {
      observer.disconnect()
      win.removeEventListener('themechange', apply)
      removeCursorStyles(doc)
      styleRef.current = null
    }
  }, [color])

  return <span ref={ref} style={{ display: 'none' }} />
}

export default Aura
