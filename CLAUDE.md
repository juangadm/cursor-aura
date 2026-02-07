# cursor-aura

Themed cursor shadows for the web. Replaces default browser cursors with macOS-style SVG cursors that have colored drop shadows.

## Project Structure

```
packages/cursor-aura/   # npm package (React component + vanilla JS API)
  src/
    react/Aura.tsx       # React component
    vanilla/index.ts     # Vanilla JS singleton API
    core/apply.ts        # DOM utilities (style injection, CSS vars)
    core/cursors.ts      # SVG cursor generation + caching
    index.ts             # Public exports
apps/web/               # Next.js 15 demo site
  app/
    layout.tsx           # Root layout with hydration-proof inline script
    page.tsx             # Interactive demo (home page)
    getting-started/     # Documentation page
    components/          # CodeBlock, etc.
    globals.css          # CSS variables, theme selectors
```

## Build & Dev

```bash
npm install                                    # install all deps (run first)
cd packages/cursor-aura && npx tsup            # build library
cd apps/web && npx next build                  # build demo site
cd apps/web && npx next dev                    # dev server
```

`turbo` is not globally installed. Use `npx turbo build` for full monorepo build.

When package changes aren't reflected in the web app, clear caches:
```bash
rm -rf apps/web/.next .turbo node_modules/.cache
```

## Architecture Decisions

- **Hidden `<span>` for ownerDocument**: The Aura component renders `<span ref={ref} style={{ display: 'none' }} />` to detect which document it lives in. This makes it portal-proof (works in iframes, portals, pop-out windows).
- **Style injection via DOM in `@layer cursor-aura`**: Cursor CSS rules are injected into `<head>` inside `@layer cursor-aura` so consumer styles (layered or unlayered) can override naturally. `injectCursorStyles()` returns the style element for media toggling.
- **CSS variables on `:root`**: Five `--cursor-*` custom properties drive all cursor styles. This lets the static CSS rules reference variables that update without re-injecting styles.
- **SVG cursor generation with caching**: `generateThemedCursors()` is memoized by color. Cursors are SVG data URIs with baked-in shadows.
- **MutationObserver for dynamic themes**: When `color` is a CSS variable like `var(--theme-color)`, the component watches for `class`, `style`, and `data-theme` attribute changes on `<html>` to re-resolve the variable.
- **React 19 peer dep (optional)**: The vanilla JS API works without React.

## Bulletproof React Checklist

Applied [Shu Ding's 9-point checklist](https://shud.in/thoughts/build-bulletproof-react-components):

| # | Principle | Status | Implementation |
|---|-----------|--------|----------------|
| 1 | Server-Proof | Pass | All browser APIs in `useEffect`; vanilla API guards `typeof window` |
| 2 | Hydration-Proof | Pass | Inline `<script>` in layout sets `data-theme` before paint; Aura uses `var(--theme-color)` |
| 3 | Instance-Proof | N/A | Cursor styles are global by design (one cursor per document) |
| 4 | Concurrent-Proof | N/A | No Server Component data fetching |
| 5 | Composition-Proof | Pass | No `cloneElement`; communicates via CSS custom properties |
| 6 | Portal-Proof | Pass | `ownerDocument.defaultView` instead of global `window`/`document` |
| 7 | Transition-Proof | Pass | Theme `setState` wrapped in `startTransition()` |
| 8 | Activity-Proof | Pass | `useLayoutEffect` toggles `media="not all"` on injected style element |
| 9 | Future-Proof | Pass | No `useMemo` for correctness-critical values |

## Issues Encountered & Lessons

### 1. SVG `scaleX()`/`scaleY()` don't exist
**Problem**: Used CSS transform syntax `scaleX(0.6)` in SVG `transform` attribute — silently ignored.
**Fix**: SVG uses `scale(x, y)`. Multiply factors manually: `scale(0.84, 1.4)`.
**Prevention**: Always test SVG transforms in isolation. CSS and SVG transform syntax differ.

### 2. HTML5 drag overrides cursor styles
**Problem**: `draggable` attribute causes the browser to take over cursor rendering during drag. CSS `cursor` properties are ignored.
**Fix**: Use mouse events (`mousedown`/`mousemove`/`mouseup`) instead of HTML5 drag API. Track drag state manually.
**Prevention**: If custom cursor styling matters, avoid the HTML5 drag API entirely.

### 3. Inline `cursor:` styles override Aura
**Problem**: Inline `style={{ cursor: 'grab' }}` has higher specificity than Aura's CSS rules.
**Fix**: Remove inline cursor styles. Use Aura's CSS selectors: `.draggable` for grab, `[data-cursor="text"]` for text.
**Prevention**: Never set `cursor` via inline styles when Aura is active.

### 4. Global `document`/`window` breaks in portals
**Problem**: `apply.ts` used `document.getElementById()` and `window.addEventListener()` directly. Fails when component is rendered inside an iframe or portal to a different document.
**Fix**: All `apply.ts` functions accept an optional `doc`/`win` parameter. Aura renders a hidden `<span>` and uses `ref.current.ownerDocument` to discover the correct document.
**Prevention**: Library components should never assume global `document`/`window`. Always derive from a DOM ref.

### 5. Cursor shadow flashes wrong color on hydration
**Problem**: Theme state defaults to `'black'` in `useState`, but the user may have saved `'blue'` in localStorage. Between server render and `useEffect` sync, `var(--theme-color)` resolves to the wrong value because `data-theme` isn't set yet.
**Fix**: Three-part hydration-proof pattern: (1) inline `<script>` in layout reads localStorage and sets `data-theme` before paint, (2) Aura uses `var(--theme-color)` instead of resolved hex, (3) React state syncs FROM the DOM on mount.
**Prevention**: When color depends on persisted preferences, use CSS variables resolved from DOM state set by an inline script — not from React state that lags behind.

### 6. `useEffect` data-theme write overwrites inline script
**Problem**: Initial implementation had `useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])` which immediately overwrote the inline script's correct value with the useState default.
**Fix**: Remove the useEffect that writes data-theme. Instead, write to DOM + localStorage directly in the click handler. The initial value is set by the inline script, and React state syncs from it.
**Prevention**: When an inline script sets DOM state before hydration, don't have a useEffect that overwrites it on mount. Read FROM the DOM to sync state, don't write TO it.

### 7. Style tags leak through `<Activity>` boundaries
**Problem**: DOM-manipulated `<style>` elements persist when `<Activity>` hides a component because they're outside React's tree.
**Fix**: `useLayoutEffect` toggles `media="not all"` on the style element during cleanup (synchronous, before paint). The `useEffect` cleanup still removes the element entirely on unmount.
**Prevention**: Any component that injects DOM side effects (style tags, global event listeners) needs `useLayoutEffect` cleanup for Activity compatibility.
