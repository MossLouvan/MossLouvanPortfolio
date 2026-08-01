# Moss Louvan — Portfolio

Personal portfolio site. Live at **[mosslouvan.com](https://mosslouvan.com)**.

Next.js App Router, TypeScript, and Framer Motion, deployed on Cloudflare.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Script              | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                         |
| `npm run build`     | Production build                                   |
| `npm start`         | Serve the production build locally                 |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm run lint`      | ESLint (`lint:fix` to autofix)                     |
| `npm run format`    | Prettier write (`format:check` to verify)          |
| `npm run verify`    | Everything CI runs: typecheck, lint, format, build |

Run `npm run verify` before pushing — it is the same gate as CI.

## Layout

```
app/         routes, root layout, global CSS
components/  UI; one component per file
data/        static content (projects, case studies, skills, commands)
lib/         shared hooks
public/      static assets — images are pre-sized WebP, see below
```

Content lives in `data/` rather than inline in components, so copy changes never
require touching JSX.

## Images

`next/image` optimization is **disabled** (`images.unoptimized` in
`next.config.ts`). The Cloudflare deployment has no image optimizer: requesting
`/_next/image?...&w=640` returned the original full-size bytes as a cache miss,
so the proxy hop cost an uncached round trip and delivered nothing.

Assets in `public/` are therefore committed **pre-sized as WebP**, at roughly 2×
their largest CSS display size. When adding an image:

1. Resize it to ~2× its rendered width.
2. Encode to WebP (quality ~82).
3. Reference it with explicit `width`/`height` so it reserves layout space.

Skipping this ships the full-resolution original to every visitor — the problem
that once made the hero a 2 MB PNG.

## CI

`.github/workflows/ci.yml` runs on every push and pull request:

- **verify** — `npm ci`, typecheck, lint, format check, build
- **audit** — `npm audit` over production dependencies, gated at `critical`

`npm ci` is deliberate: it treats the lockfile as authoritative and fails on
peer-dependency conflicts, which is how a build-time dependency pinning Next to
a version with a critical RCE was caught.

## Deployment

Pushes to `main` deploy automatically via Cloudflare. The build command lives in
the Cloudflare dashboard, not in this repo.
