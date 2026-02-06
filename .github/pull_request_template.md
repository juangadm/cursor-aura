## What

Brief description of the change.

## Why

Why is this change needed?

## How to test

Steps to verify this works:

1. ...

## Checklist

- [ ] `npx tsc --noEmit` passes in `packages/cursor-aura`
- [ ] `npx tsup` builds successfully in `packages/cursor-aura`
- [ ] `npx next build` succeeds in `apps/web`
- [ ] No inline `cursor:` styles added (conflicts with Aura)
