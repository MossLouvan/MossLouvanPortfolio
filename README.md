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
- **audit** — `npm audit` over production dependencies, informational only

CI pins its own Node version in the workflow; there is deliberately no
`.nvmrc`, because Cloudflare Pages reads that file to choose its build image.

`npm ci` is deliberate: it treats the lockfile as authoritative and fails on
peer-dependency conflicts, which is how a build-time dependency pinning Next to
a version with a critical RCE was caught.

## Deployment

Pushes to `main` deploy automatically via Cloudflare Pages. The build command is
set in the Cloudflare dashboard, not in this repo:

```
npx @cloudflare/next-on-pages@1
```

Two consequences worth knowing before changing dependencies:

1. **`@cloudflare/next-on-pages` must stay in `devDependencies`.** The build
   command runs it via `npx`, which uses the locally installed copy. Remove it
   and `npx` resolves it fresh, which fails: it needs
   `@cloudflare/workers-types@^4` while current `wrangler` requires `^5`.
   That is why `wrangler` is pinned to `4.67.0` in `overrides` — it keeps the
   tree resolvable from scratch rather than only surviving as a frozen lockfile.

2. **Next is capped at 15.5.2**, because `next-on-pages` declares
   `peer next ">=14.3.0 && <=15.5.2"`. That version carries a critical advisory
   (CVE-2025-55182, RCE) which therefore **cannot be fixed from this repo**.

`next-on-pages` is deprecated in favour of
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Migrating to it
is what unblocks Next upgrades, and it requires changing the build command in
the Cloudflare dashboard.
