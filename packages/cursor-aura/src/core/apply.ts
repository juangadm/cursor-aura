import { generateThemedCursors, getCursorCSS, type CursorType } from './cursors'

const STYLE_ID = 'aura-cursor-styles'

const CSS_VARS: ReadonlyArray<{
  prop: string
  type: CursorType
  fallback: string
}> = [
  { prop: '--cursor-default', type: 'default', fallback: 'auto' },
  { prop: '--cursor-pointer', type: 'pointer', fallback: 'pointer' },
  { prop: '--cursor-grab', type: 'grab', fallback: 'grab' },
  { prop: '--cursor-grabbing', type: 'grabbing', fallback: 'grabbing' },
  { prop: '--cursor-text', type: 'text', fallback: 'text' },
]

// Static CSS rules referencing custom properties. No !important —
// prepended to <head> so consumer stylesheets win at equal specificity.
const CURSOR_RULES = `
html, body { cursor: var(--cursor-default); }
a, button, [role="button"], input[type="submit"], input[type="button"],
input[type="reset"], input[type="checkbox"], input[type="radio"],
select, summary, [onclick], [tabindex]:not([tabindex="-1"]) {
  cursor: var(--cursor-pointer);
}
input[type="text"], input[type="email"], input[type="password"],
input[type="search"], input[type="tel"], input[type="url"],
input[type="number"], textarea, [contenteditable="true"], [data-cursor="text"] {
  cursor: var(--cursor-text);
}
[draggable="true"], .draggable { cursor: var(--cursor-grab); }
[draggable="true"]:active, .draggable:active, .dragging {
  cursor: var(--cursor-grabbing);
}
`

/**
 * Injects the static cursor CSS rules into <head>.
 * Idempotent: reuses existing element if present.
 * Prepends to <head> so consumer stylesheets win at equal specificity.
 */
export function injectCursorStyles(): void {
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = CURSOR_RULES
  document.head.prepend(el)
}

/**
 * Sets the 5 --cursor-* CSS custom properties on :root.
 * `color` must be a resolved value (not a var() reference).
 */
export function setCursorVariables(color: string): void {
  const cursors = generateThemedCursors(color)
  const root = document.documentElement
  for (const { prop, type, fallback } of CSS_VARS) {
    root.style.setProperty(prop, getCursorCSS(cursors[type], type, fallback))
  }
}

/**
 * If `color` starts with "var(", reads the computed value from
 * document.documentElement. Otherwise returns `color` unchanged.
 */
export function resolveColor(color: string): string {
  if (!color.startsWith('var(')) return color
  const varName = color.slice(4, -1).trim()
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000'
}

/**
 * Removes the <style> element and all 5 CSS custom properties from :root.
 */
export function removeCursorStyles(): void {
  document.getElementById(STYLE_ID)?.remove()
  const root = document.documentElement
  for (const { prop } of CSS_VARS) {
    root.style.removeProperty(prop)
  }
}

/**
 * Returns true when the primary pointing device is a mouse or trackpad.
 * Hybrid devices (laptop + touchscreen) return true.
 * Touch-only devices return false.
 */
export function hasPointerDevice(): boolean {
  return window.matchMedia('(pointer: fine)').matches
}
