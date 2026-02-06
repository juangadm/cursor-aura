# Contributing to cursor-aura

Thanks for your interest in contributing! This document explains the process for contributing to this project.

## How contributions work

1. **Fork** this repository to your own GitHub account
2. **Clone** your fork locally
3. **Create a branch** for your change (`git checkout -b my-change`)
4. **Make your changes** and test them
5. **Push** to your fork and open a **pull request** against `main`

All PRs require review and approval from a maintainer before merging. Direct pushes to `main` are not allowed.

## Development setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/cursor-aura.git
cd cursor-aura

# Install dependencies
npm install

# Build the library
cd packages/cursor-aura && npx tsup

# Run the demo site
cd apps/web && npx next dev
```

## Before submitting a PR

Make sure your changes pass all checks that CI will run:

```bash
# Type-check the library
cd packages/cursor-aura && npx tsc --noEmit

# Build the library
cd packages/cursor-aura && npx tsup

# Build the demo site
cd apps/web && npx next build
```

If package changes aren't reflected in the web app, clear caches:

```bash
rm -rf apps/web/.next .turbo node_modules/.cache
```

## What makes a good PR

- **Small and focused** — one concern per PR
- **Descriptive title** — summarize the change in a few words
- **Context in the description** — explain *why*, not just *what*
- **Passes CI** — all checks must be green before review

## Reporting bugs

Open an [issue](https://github.com/juangadm/cursor-aura/issues/new?template=bug_report.md) with:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS

## Requesting features

Open an [issue](https://github.com/juangadm/cursor-aura/issues/new?template=feature_request.md) describing:

- The use case
- Your proposed solution (if any)

## Code style

- TypeScript throughout
- No inline `cursor:` styles when Aura is active (see CLAUDE.md for details)
- SVG transforms use SVG syntax, not CSS syntax

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
