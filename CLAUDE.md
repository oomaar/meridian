# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

- Next.js **16.2.6** (App Router, in `src/app/`)
- React **19.2.4**
- Tailwind CSS **v4** (PostCSS plugin `@tailwindcss/postcss`; no `tailwind.config.*` — theme is declared in CSS via `@theme` in `src/app/globals.css`)
- TypeScript with `strict: true` and the path alias `@/* → ./src/*`

Because these versions are recent, defer to the bundled docs at `node_modules/next/dist/docs/` (App Router lives under `01-app/`) before applying patterns from memory — APIs may have shifted.

## Commands

```bash
npm run dev     # Next.js dev server on http://localhost:3000
npm run build   # production build
npm run start   # serve the production build (requires build first)
npm run lint    # eslint (flat config in eslint.config.mjs, extends eslint-config-next)
```

No test runner is configured.

## Design Tokens & Wireframes (External Source)

- **Design Reference Path**: `/Users/omar/Projects/meridian/Education`
- **Theme & Tokens**: Refer to `/Users/omar/Projects/meridian/Education/css/meridian.css` for colors, border-radius, and font sizes.
- **Component Structures**: Refer to `/Users/omar/Projects/meridian/Education/Meridian.html` for layout schemas and CSS class utilities.

## UI Implementation Guide

- When asked to build a screen, read the relevant HTML structure from the design folder first.
- Maintain button padding, responsive breakpoints, and custom themes exactly as configured in the design wireframes.
