import { generateThemedCursors, getCursorCSS, clearCursorCache } from '../core/cursors'

export interface AuraOptions {
  /**
   * The shadow color for the cursor
   * @default '#000'
   */
  color?: string
}

let styleElement: HTMLStyleElement | null = null
let currentColor: string | null = null
let observer: MutationObserver | null = null
let themeChangeHandler: (() => void) | null = null

/**
 * Initialize Aura cursor shadows
 *
 * @example
 * ```js
 * // Initialize with a color
 * Aura.init({ color: '#0C3EFF' })
 *
 * // Update the color later
 * Aura.setColor('#FF6183')
 *
 * // Clean up when done
 * Aura.destroy()
 * ```
 */
function init(options: AuraOptions = {}): void {
  // Skip on touch devices
  if (typeof window === 'undefined') return

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouchDevice) return

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const color = options.color || '#000'
  applyColor(color)

  // Watch for theme changes on document element
  observer = new MutationObserver(() => {
    if (currentColor) {
      applyColor(currentColor)
    }
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme']
  })

  // Listen for custom theme change events
  themeChangeHandler = () => {
    if (currentColor) {
      applyColor(currentColor)
    }
  }
  window.addEventListener('themechange', themeChangeHandler)
}

/**
 * Update the cursor shadow color
 */
function setColor(color: string): void {
  applyColor(color)
}

/**
 * Clean up Aura - removes styles and event listeners
 */
function destroy(): void {
  if (styleElement) {
    styleElement.remove()
    styleElement = null
  }

  if (observer) {
    observer.disconnect()
    observer = null
  }

  if (themeChangeHandler) {
    window.removeEventListener('themechange', themeChangeHandler)
    themeChangeHandler = null
  }

  // Remove CSS custom properties
  const root = document.documentElement
  root.style.removeProperty('--cursor-default')
  root.style.removeProperty('--cursor-pointer')
  root.style.removeProperty('--cursor-grab')
  root.style.removeProperty('--cursor-grabbing')
  root.style.removeProperty('--cursor-text')

  currentColor = null
  clearCursorCache()
}

function applyColor(color: string): void {
  currentColor = color

  // Generate cursor data URIs with shadow
  const cursors = generateThemedCursors(color)
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
  styleElement = document.getElementById(styleId) as HTMLStyleElement | null

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = styleId
    document.head.appendChild(styleElement)
  }

  styleElement.textContent = `
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

export const Aura = {
  init,
  setColor,
  destroy
}

export default Aura
