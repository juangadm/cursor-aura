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
  /**
   * The document to inject styles into. Defaults to the global document.
   * Portal-proof: pass a different document for iframes or pop-out windows.
   */
  document?: Document
}

let currentColor: string | null = null
let currentDoc: Document | null = null
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

  const doc = options.document || document
  const win = doc.defaultView || window
  if (!hasPointerDevice(win)) return

  currentDoc = doc
  const color = options.color || '#000'

  injectCursorStyles(doc)
  applyColor(color)

  observer = new MutationObserver(() => {
    if (currentColor) applyColor(currentColor)
  })
  observer.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme'],
  })

  themeChangeHandler = () => {
    if (currentColor) applyColor(currentColor)
  }
  win.addEventListener('themechange', themeChangeHandler)
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
  const doc = currentDoc || document
  const win = doc.defaultView || window

  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (themeChangeHandler) {
    win.removeEventListener('themechange', themeChangeHandler)
    themeChangeHandler = null
  }
  removeCursorStyles(doc)
  clearCursorCache()
  currentColor = null
  currentDoc = null
}

function applyColor(color: string): void {
  currentColor = color
  setCursorVariables(color, currentDoc || document)
}

export const Aura = { init, setColor, destroy }
export default Aura
