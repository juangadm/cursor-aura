# Aura

Themed cursor shadows for the web. Replaces your default cursor with macOS-style SVG cursors that have a colored drop shadow matching your theme.

Still in beta. Works best in Chrome and Chromium-based browsers. Safari support is improving.

**Demo:** [aura.juangabriel.xyz](https://aura.juangabriel.xyz)

## Packages

| Package | Description |
|---------|-------------|
| [cursor-aura](./packages/cursor-aura) | The npm package |
| [aura-web](./apps/web) | Demo website |

## Quick Start

```bash
npm install cursor-aura
```

```tsx
import { Aura } from 'cursor-aura'

<Aura color="#0C3EFF" />
```

## Development

```bash
# Install dependencies
npm install

# Run development servers
npm run dev

# Build all packages
npm run build
```

## License

MIT
