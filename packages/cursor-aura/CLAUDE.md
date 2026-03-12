# cursor-aura Development Notes

## SVG Transform Syntax (Critical)

**Problem:** `scaleX()` and `scaleY()` are CSS transform functions, NOT valid SVG transform functions.

**Solution:** SVG uses `scale(x, y)` for non-uniform scaling.

```javascript
// WRONG - CSS syntax, won't work in SVG
transform="scale(1.4) scaleX(0.6)"

// CORRECT - SVG syntax
transform="scale(0.84, 1.4)"  // x = 1.4 * 0.6 = 0.84
```

## I-beam Cursor Configuration

Current settings for thin, elegant I-beam:
- **Scale:** `1.4` (overall size)
- **ScaleX:** `0.6` (horizontal squish)
- **Shadow offset:** `1.4`
- **Final transform:** `scale(0.84, 1.4)`

## Dev Server & Caching Issues

When changes to `cursor-aura` package aren't reflected:

1. **Rebuild package first:**
   ```bash
   cd packages/cursor-aura && npm run build
   ```

2. **Clear all caches:**
   ```bash
   rm -rf apps/web/.next .turbo node_modules/.cache
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Browser cache:** Hard refresh may not clear JS bundles. Use:
   - Incognito window, OR
   - DevTools → Application → Storage → Clear site data

## Inline Styles Override Aura

**Problem:** Inline `cursor: grab` style overrides Aura's CSS custom properties.

**Solution:** Remove inline cursor styles. Let Aura's CSS handle via:
- `[draggable="true"]` selector for grab cursor
- `[data-cursor="text"]` for text cursor

## HTML5 Drag Overrides Cursor Styles (Critical)

**Problem:** HTML5 `draggable` attribute causes browser to take control of cursor during drag operations. CSS `cursor` properties and `:active` pseudo-class are ignored once dragging begins.

**Why it happens:** The browser renders a "ghost image" of the dragged element and uses system-level drag cursors that cannot be overridden.

**Solution:** For demos that need to show custom grab/grabbing cursors:
- Use mouse events (`mousedown`/`mousemove`/`mouseup`) instead of HTML5 drag
- Track dragging state manually
- Apply `.dragging` class to trigger `cursor: var(--cursor-grabbing)`

```tsx
// DON'T - HTML5 drag (cursor won't work)
<button draggable onDragStart={...}>

// DO - Mouse events (cursor works)
<button
  onMouseDown={handleDragStart}
  className={isDragging ? 'dragging' : ''}
>
```

## Git Identity

Always configure commits with the repo owner's identity so contributions are attributed correctly on GitHub:

```
git config user.name "juangabriel"
git config user.email "20469198+juangadm@users.noreply.github.com"
```

Set this before the first commit in every session. Never use `noreply@anthropic.com` or other placeholder emails.

## Git Commits

- **Atomic commits**: One logical change per commit. If you can describe it with "and" (e.g., "fix heading hierarchy AND add robots.txt"), split it into two commits.
- **Maximize contribution signal**: Prefer many small, well-scoped commits over few large ones. Each file created or distinct concern changed warrants its own commit.
- **Message format**: Imperative mood, under 72 chars. Start with a verb: Add, Fix, Update, Remove, Refactor. The subject line should be scannable without reading the diff.
- **Never squash during development**: Keep the full commit history on feature branches. Let the merge strategy (squash vs merge commit) be decided at PR time.
## Build & Test Commands

```bash
# Build package
cd packages/cursor-aura && npm run build

# Test cursor generation
node -e "const { generateCursorSVG } = require('./dist/index.cjs'); console.log(generateCursorSVG('text', '#0C3EFF'));"

# Deploy
npx vercel --prod
```
