# cursor-aura

Themed cursor shadows for the web. Replaces your default cursor with macOS-style SVG cursors that have a colored drop shadow matching your theme.

Still in beta. Works best in Chrome and Chromium-based browsers. Safari support is improving.

## Installation

```bash
npm install cursor-aura
```

## Usage

### React

```tsx
import { Aura } from 'cursor-aura'

export default function App() {
  return (
    <>
      <Aura color="#0C3EFF" />
      {/* rest of your app */}
    </>
  )
}
```

### With CSS Variables

The color prop accepts CSS variables, so your cursor shadow automatically updates with your theme:

```tsx
<Aura color="var(--theme-color)" />
```

### Vanilla JS

For non-React sites:

```html
<script type="module">
  import { AuraVanilla as Aura } from 'https://esm.sh/cursor-aura/vanilla'

  Aura.init({ color: '#0C3EFF' })

  // Update color later
  Aura.setColor('#FF6183')

  // Clean up
  Aura.destroy()
</script>
```

## Props

| Prop  | Type   | Default | Description                              |
|-------|--------|---------|------------------------------------------|
| color | string | #000    | Shadow color (hex, rgb, or CSS variable) |

## Accessibility

Aura automatically respects user preferences:

- **Reduced motion:** Disabled when `prefers-reduced-motion: reduce` is set
- **Touch devices:** Gracefully skipped (no cursor to shadow)

## How It Works

Aura generates custom cursor SVGs with baked-in shadows and applies them via CSS custom properties. No runtime overhead — just static CSS after the initial render. It uses `!important` to ensure themed cursors override any existing inline cursor styles, so it works without requiring you to modify your existing code.

The cursors are based on macOS cursor designs, inspired by [Marcin Wichary](https://aresluna.org/)'s work. They include:

- Default (arrow)
- Pointer (hand)
- Text (I-beam)
- Grab (open hand)
- Grabbing (closed hand)

## License

MIT
