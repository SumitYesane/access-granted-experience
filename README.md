# Access Granted Experience

A cinematic portfolio-style web app built with TanStack Start, React, Vite, Tailwind CSS, and Framer Motion.

The app presents a single immersive landing experience with:
- a boot/login-style intro
- animated glitch transition
- hero/system core section
- skill tree visualization
- project showcase
- mission log timeline
- contact hub
- hidden terminal interaction

## Tech Stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS v4
- Framer Motion
- Radix UI / shadcn-style UI components
- Cloudflare-compatible SSR entry

## Getting Started

### 1. Install dependencies

Using npm:

```bash
npm install
```

Using Bun:

```bash
bun install
```

### 2. Start the dev server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run build:dev` - create a development-mode build
- `npm run preview` - preview the built app
- `npm run lint` - run ESLint
- `npm run format` - run Prettier

## Project Structure

```text
src/
  components/
    experience/   custom portfolio experience sections
    ui/           reusable UI primitives
  hooks/          shared hooks
  lib/            utility and error-handling helpers
  routes/         TanStack file-based routes
  router.tsx      router creation
  server.ts       SSR/error wrapper entry
  start.ts        TanStack Start instance
  styles.css      global styles and design tokens
```

## Main App Flow

The main experience is defined in `src/routes/index.tsx`.

It moves through three phases:

1. `boot`
2. `glitch`
3. `main`

Once the main experience loads, it renders:

- `Header`
- `SystemCore`
- `SkillTree`
- `ProjectUniverse`
- `MissionLogs`
- `CommHub`
- `Terminal`

## Notes on SSR and Deployment

- `src/server.ts` wraps the TanStack Start server entry.
- It adds custom SSR error handling and a branded fallback error page.
- `vite.config.ts` points TanStack Start to that custom server entry.
- `wrangler.jsonc` indicates Cloudflare-compatible deployment setup.

## Troubleshooting

### `npm install` is taking a long time

This project has a fairly large frontend dependency tree, so the first install can take a while.

If it seems stuck for too long:

```bash
npm install --verbose
```

You can also try:

```bash
npm cache verify
```

If you prefer Bun and already have it installed:

```bash
bun install
```

### `vite` is not recognized

That usually means dependencies were not installed successfully yet. Re-run `npm install` and then try `npm run dev` or `npm run build` again.

## Current State

- This repo currently looks like a single-page portfolio experience.
- Most content is hardcoded in the experience components.
- Several text strings in the source appear to have encoding issues and may need cleanup later.
