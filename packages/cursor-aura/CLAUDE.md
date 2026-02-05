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

## Build & Test Commands

```bash
# Build package
cd packages/cursor-aura && npm run build

# Test cursor generation
node -e "const { generateCursorSVG } = require('./dist/index.cjs'); console.log(generateCursorSVG('text', '#0C3EFF'));"

# Deploy
npx vercel --prod
```
