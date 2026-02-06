'use client'

import { useEffect } from 'react'
import {
  injectCursorStyles,
  setCursorVariables,
  resolveColor,
  removeCursorStyles,
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
 * Renders nothing visible - applies custom cursors via CSS custom properties
 * on the document root. The shadow color updates automatically when the
 * color prop changes.
 *
 * @example
 * ```tsx
 * <Aura color="#0C3EFF" />
 * <Aura color="var(--theme-color)" />
 * ```
 */
export function Aura({ color = '#000' }: AuraProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hasPointerDevice()) return

    injectCursorStyles()

    const apply = () => {
      setCursorVariables(resolveColor(color))
    }
    apply()

    // Watch for theme attribute changes (CSS variable resolution)
    const observer = new MutationObserver(() => {
      if (color.startsWith('var(')) apply()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    })

    window.addEventListener('themechange', apply)

    return () => {
      observer.disconnect()
      window.removeEventListener('themechange', apply)
      removeCursorStyles()
    }
  }, [color])

  return null
}

export default Aura
