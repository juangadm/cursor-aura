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

// Active/pressed variants — smaller shadow for "pressed closer to surface" feel
const CSS_VARS_ACTIVE: ReadonlyArray<{
  prop: string
  type: CursorType
  fallback: string
}> = [
  { prop: '--cursor-default-active', type: 'default', fallback: 'auto' },
  { prop: '--cursor-pointer-active', type: 'pointer', fallback: 'pointer' },
  { prop: '--cursor-text-active', type: 'text', fallback: 'text' },
]

// Static CSS rules referencing custom properties. No !important.
// Wrapped in @layer so consumer styles (layered or unlayered) can override.
const CURSOR_RULES = `
@layer cursor-aura {
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
  html:active, body:active { cursor: var(--cursor-default-active); }
  a:active, button:active, [role="button"]:active, input[type="submit"]:active,
  input[type="button"]:active, input[type="reset"]:active,
  input[type="checkbox"]:active, input[type="radio"]:active,
  select:active, summary:active, [onclick]:active,
  [tabindex]:not([tabindex="-1"]):active {
    cursor: var(--cursor-pointer-active);
  }
  input[type="text"]:active, input[type="email"]:active, input[type="password"]:active,
  input[type="search"]:active, input[type="tel"]:active, input[type="url"]:active,
  input[type="number"]:active, textarea:active, [contenteditable="true"]:active,
  [data-cursor="text"]:active {
    cursor: var(--cursor-text-active);
  }
  [draggable="true"], .draggable { cursor: var(--cursor-grab); }
  [draggable="true"]:active, .draggable:active, body.dragging {
    cursor: var(--cursor-grabbing);
  }
}
`

/**
 * Injects the static cursor CSS rules into <head>.
 * Idempotent: reuses existing element if present.
 * Rules are wrapped in @layer cursor-aura so consumer styles can override.
 * Portal-proof: accepts an optional document for correct context in
 * iframes, portals, or pop-out windows.
 */
export function injectCursorStyles(doc: Document = document): HTMLStyleElement {
  let el = doc.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = doc.createElement('style')
    el.id = STYLE_ID
    el.textContent = CURSOR_RULES
    doc.head.prepend(el)
  }
  return el
}

/**
 * Sets the 8 --cursor-* CSS custom properties on :root.
 * 5 normal + 3 active/pressed variants with smaller shadow offset.
 * `color` must be a resolved value (not a var() reference).
 */
export function setCursorVariables(color: string, doc: Document = document): void {
  const cursors = generateThemedCursors(color)
  const pressedCursors = generateThemedCursors(color, true)
  const root = doc.documentElement
  for (const { prop, type, fallback } of CSS_VARS) {
    root.style.setProperty(prop, getCursorCSS(cursors[type], type, fallback))
  }
  for (const { prop, type, fallback } of CSS_VARS_ACTIVE) {
    root.style.setProperty(prop, getCursorCSS(pressedCursors[type], type, fallback))
  }
}

/**
 * If `color` starts with "var(", reads the computed value from
 * document.documentElement. Otherwise returns `color` unchanged.
 */
export function resolveColor(color: string, doc: Document = document): string {
  if (!color.startsWith('var(')) return color
  const varName = color.slice(4, -1).trim()
  return getComputedStyle(doc.documentElement).getPropertyValue(varName).trim() || '#000'
}

/**
 * Removes the <style> element and all 8 CSS custom properties from :root.
 */
export function removeCursorStyles(doc: Document = document): void {
  doc.getElementById(STYLE_ID)?.remove()
  const root = doc.documentElement
  for (const { prop } of CSS_VARS) {
    root.style.removeProperty(prop)
  }
  for (const { prop } of CSS_VARS_ACTIVE) {
    root.style.removeProperty(prop)
  }
}

/**
 * Removes the 8 CSS custom properties from :root without removing the
 * <style> element. Used for Activity-proof cleanup where the style tag
 * is disabled via media attribute rather than removed.
 */
export function removeCursorVariables(doc: Document = document): void {
  const root = doc.documentElement
  for (const { prop } of CSS_VARS) {
    root.style.removeProperty(prop)
  }
  for (const { prop } of CSS_VARS_ACTIVE) {
    root.style.removeProperty(prop)
  }
}

/**
 * Returns true when the primary pointing device is a mouse or trackpad.
 * Hybrid devices (laptop + touchscreen) return true.
 * Touch-only devices return false.
 * Portal-proof: accepts an optional window for correct context.
 */
export function hasPointerDevice(win: Window = window): boolean {
  return win.matchMedia('(pointer: fine)').matches
}
