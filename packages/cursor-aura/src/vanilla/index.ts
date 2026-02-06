import { clearCursorCache } from '../core/cursors'
import {
  injectCursorStyles,
  setCursorVariables,
  removeCursorStyles,
  hasPointerDevice,
} from '../core/apply'

export interface AuraOptions {
  /**
   * The shadow color for the cursor
   * @default '#000'
   */
  color?: string
}

let currentColor: string | null = null
let observer: MutationObserver | null = null
let themeChangeHandler: (() => void) | null = null

/**
 * Initialize Aura cursor shadows
 *
 * @example
 * ```js
 * Aura.init({ color: '#0C3EFF' })
 * Aura.setColor('#FF6183')
 * Aura.destroy()
 * ```
 */
function init(options: AuraOptions = {}): void {
  if (typeof window === 'undefined') return
  if (!hasPointerDevice()) return

  const color = options.color || '#000'

  injectCursorStyles()
  applyColor(color)

  observer = new MutationObserver(() => {
    if (currentColor) applyColor(currentColor)
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme'],
  })

  themeChangeHandler = () => {
    if (currentColor) applyColor(currentColor)
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
 * Clean up Aura - removes styles, event listeners, and cache
 */
function destroy(): void {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (themeChangeHandler) {
    window.removeEventListener('themechange', themeChangeHandler)
    themeChangeHandler = null
  }
  removeCursorStyles()
  clearCursorCache()
  currentColor = null
}

function applyColor(color: string): void {
  currentColor = color
  setCursorVariables(color)
}

export const Aura = { init, setColor, destroy }
export default Aura
