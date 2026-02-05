// React component
export { Aura, type AuraProps } from './react/Aura'
export { Aura as default } from './react/Aura'

// Core utilities (for advanced usage)
export {
  generateCursorSVG,
  generateThemedCursors,
  getCursorCSS,
  toDataURI,
  clearCursorCache,
  type CursorType
} from './core/cursors'

// Vanilla JS (for non-React usage)
export { Aura as AuraVanilla } from './vanilla'
