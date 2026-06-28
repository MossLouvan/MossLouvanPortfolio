# Spec: Portfolio Redesign — Friend Feedback Pass

**Status:** Draft for approval (no code written yet)
**Date:** 2026-06-27
**Author:** Moss + Claude
**Goal:** Implement every item of friend feedback in a way that makes the portfolio
**beautiful, unique, and exceptional** — not a clone of any reference, but its own thing.

---

## 1. Design Vision

Keep what already works: the restrained, editorial feel — generous whitespace, light-weight
headings, a quiet monochrome base, tasteful Framer Motion. The redesign **doesn't** add noise;
it (a) makes everything theme-aware so dark/light both feel intentional, (b) fixes the rough
edges (search, drawer), and (c) introduces **one signature moment** — a unique Achievements
card display — so the site has a memorable "wow" without looking like a template.

**Principles**
- **Converge, don't paste.** Every overlay (search, drawer, lightbox, diagrams) inherits the
  theme via CSS variables. No hardcoded dark panels on a light page.
- **Instant feedback.** Interactions respond on the same frame; flourishes play *after*.
- **One hero interaction.** The Achievements deck is the signature; everything else stays clean.
- **Cross-platform & accessible.** Correct shortcut per OS; `prefers-reduced-motion` honored everywhere.
- **Inspired, not copied.** Jack's deck is a reference for *quality bar*, not layout.

---

## 2. Locked Decisions (from Q&A)

| # | Decision | Detail |
|---|----------|--------|
| 1 | **Unique card display = Achievements ONLY** | Achievements become an original swipe/focus card deck with visible captions. **Projects stay a grid** (polished, not a deck). |
| 2 | **Project links = Hybrid per project** | GitHub-style header (real repo link/stats) where a public repo exists; self-contained card (Email/LinkedIn/Case study) where the work is proprietary. |
| 3 | **Architecture diagrams = SVG now, images later** | Rebuild diagrams as polished, theme-aware SVG (smaller, no pan/zoom), wired so real exported images can be dropped in later with no code change. |
| 4 | **Skills = colorful brand logos** | Logo + name tiles replacing pills. Brand logos bundled locally; monogram fallback for techs without an official logo (e.g., A2A, LangGraph). |

---

## 3. Inputs Needed From Moss

These don't block starting (Phase 0–4), but are needed before Projects (Phase 5) finalize:

1. ✅ **Converge** — RESOLVED. Role = **Full-Stack Developer**; links = GitHub + Devpost
   (`https://devpost.com/software/converge-4ek5ho`). Full details in §6.E.4.
2. **NASA app** — is there a public repo / demo / video to link? (Else it stays self-contained.)
3. **AI PDF Processing Platform (Principal)** — treated as **proprietary / self-contained**
   (Email + LinkedIn + Case study). Confirm.
4. **(Optional, later)** Real architecture diagram image exports (PNG/SVG) for case studies.
5. **Skill logos** — friend wants real transparent logos per tool (§6.C). I'll source official
   brand SVGs (simple-icons CC0 + official press kits) into `/public/logos/skills/`; techs without
   an official mark (A2A, LangGraph) get a clean monogram tile. Confirm that's fine.

---

## 4. Feedback → Work Item Map

| Friend's words | Work item |
|----------------|-----------|
| "make search a suggestion feed" | B3 |
| "gaps in search" (overlap + missing content) | B1, B2 |
| "fix the search bar, thinner gray background" | B4 |
| "modify the mac thing for windows people" | B5 |
| "dark mode light mode" | A1, A2 |
| "responsive: click switch color, then slide after" | A3 |
| "cards for pictures w/ captions like Jack's" + "photos swipe like cards" | F (Achievements deck) |
| "make smaller + add images to case study diagrams" | D2 |
| "add converge to projects with links" | E1, E2 |
| "architecture is the first thing the person sees" | D1, E3 |
| "fix the NASA case study to converge into the UI" | D1 |
| "get rid of pill shape; logos + names like my GitHub" | C (Skills) |
| *(found) hero typewriter very slow* | G3 (optional) |

---

## 5. Shared Building Blocks (built first, reused everywhere)

- **`app/layout.tsx` — pre-paint theme script.** Inline `<script>` in `<head>` sets `html.dark`
  from `localStorage` → else system `prefers-color-scheme`, before first paint. Kills the
  dark-flash and enables a real system-preference default.
- **`lib/usePlatform.ts`** — returns `{ isApple }` (from `navigator.platform`/UA) for shortcut labels.
- **CSS surface tokens** in `globals.css` for both themes:
  `--surface`, `--surface-2`, `--surface-border`, `--overlay`, `--shadow`,
  `--accent`, `--diagram-stroke`, `--diagram-node`. Every overlay switches to these.
- **`data/skills.ts`** — `{ name, slug, logo?, brandColor? }[]` grouped by category.
- **`data/projects.ts`** — projects unified with case-study data: adds
  `visibility: 'public' | 'private'`, `repo?: { url, owner, name }`, `links[]`, `cover`.

---

## 6. Detailed Work Items

### A. Theme System & Toggle

**A1 — Theme-aware surfaces (the "converge" fix).**
Replace hardcoded `rgba(18,18,18,…)` / `rgba(255,255,255,…)` in `.cp-panel`, `.csd-*`,
`.lightbox-*`, `PanZoomCanvas` inline styles, and the diagram SVG with the new surface tokens.
*Acceptance:* every overlay looks native in **both** themes; no white-on-cream or dark-on-light.

**A2 — System-preference default + no flash.** Pre-paint script (Section 5).
*Acceptance:* first load matches OS theme (unless a saved choice exists); no dark flash on a light OS.

**A3 — Instant switch + a cleaner animation.** Two parts per friend's note ("change color *then*
animate; the current animation isn't clean"):
1. **Color flips on the same click frame** — set `html.dark` + persist immediately; never gate the
   theme change on the animation midpoint (kills the current ~350ms lag).
2. **Replace the horizontal wipe bar** (which looks unclean) with a **circular reveal** that grows
   from the toggle button using the **View Transitions API** (`document.startViewTransition` + a
   `clip-path` circle keyed to the button's coordinates). Crisp, modern, originates from the control
   the user clicked. Fallback for unsupported browsers = a fast, clean cross-fade (no bar).
   Skip entirely under `prefers-reduced-motion`.
*Acceptance:* colors change instantly on click; the transition is a smooth circular reveal from the
toggle (or clean crossfade fallback); the old wipe bar is gone.

### B. Command Palette / Search

**B1 — Plain-text results + light group labels (the look fix).** Delete the duplicate/conflicting
CSS (`.cp-list` vs `.cp-results`, the two `.cp-trigger`/`.cp-panel` defs). One opaque, theme-aware
panel (`--surface` + `--surface-border` + `--shadow`). Per friend's screenshots:
- **Results are plain clickable text rows** — *no* boxed/bordered buttons, no pill chrome, no big
  vertical gaps. Hover = a subtle full-width row highlight; active = slightly stronger. Reads like a
  normal search bar's autocomplete list (think Raycast/Spotlight), not a stack of buttons.
- **Each group gets a light, muted text label** ("Navigation", "Links", "Case Studies", "Skills"…)
  sitting above its rows, replacing the awkward empty-space separation between categories.
*Acceptance:* no boxes around items; tight consistent rhythm; every group has a readable light
label; nothing overlaps or bleeds page content behind it.

**B2 — Index everything (close the gaps).** Build the command list from **all** content:
sections, every skill, each experience entry, education, each achievement (opens its deck card),
leadership items, projects, and case studies. Searching "python", "John Deere", "valedictorian",
"RAG" all return real hits.
*Acceptance:* `python` → skill result; `nasa` → case study + experience + achievement; no dead queries for visible content.

**B3 — Suggestion feed (empty state).** With no query, show a curated feed instead of a raw nav
dump: **Suggested** (top case studies / "View NASA case study"), **Jump to** (key sections),
**Connect** (Email, LinkedIn). Optional: recent selections via `localStorage`.
*Acceptance:* opening search with empty input shows a clean, grouped, helpful feed.

**B4 — Input restyle.** Trigger + input get a **thinner, subtle gray** fill
(`--surface-2`), refined height/border, clear focus ring. Fix the first-open focus bug so typing
registers immediately.
*Acceptance:* matches "thinner gray background"; typing works on first open.

**B5 — Cross-platform shortcut.** `usePlatform` → show `⌘ K` on Apple, `Ctrl K` elsewhere
(trigger, hints, and PanZoom's reset hint). Both shortcuts actually work.
*Acceptance:* Windows/Linux users see and can use `Ctrl K`.

### C. Skills — Logo + Name Tiles (kill the pills)

Replace `ChipGroup` pills with a responsive **logo-over-name tile grid** (colorful brand logos,
bundled SVGs, monogram fallback). Subtle theme-aware tile; gentle hover lift; staggered reveal
preserved. Keep the three categories.
*Acceptance:* no pill shapes remain; each tech shows a recognizable logo with its name beneath,
crisp in both themes; A2A/LangGraph fall back gracefully.

### D. Case Study Drawer

**D1 — Converge + architecture-first + fix the Links buttons.** Drawer/tabs/links use surface
tokens (light-mode dark-panel bug gone). **Default tab = Architecture** (friend: "architecture
should be what's shown first, not overview"). Rebuild the Overview **Links** buttons: right now the
"LinkedIn"/"Email me about it" ghost buttons are a thin outline with near-invisible text
(white-on-dark / dark-on-dark). Replace with solid, theme-aware buttons that read clearly in both
modes, with a small leading icon (GitHub / LinkedIn / mail).
*Acceptance:* drawer is native in light mode; opens on Architecture; every Links button is clearly
visible and legible in both themes.

**D2 — Diagrams that actually make sense (+ smaller, fit-to-view, image-ready).** The current
diagram is the #1 confusion ("I don't know what I'm even looking at") — it loads **over-zoomed/cut
off**, and the edges are a crossing tangle. Rebuild as a **deterministic, readable static SVG**:
- **Clear directional flow** — left→right (or top→down) layered layout; **arrowheads** on every
  edge so data direction is obvious; **no crossing spaghetti** (order nodes to minimize crossings).
- **Legible & grouped** — readable labels, optional stage grouping/legend, short captions per node.
- **Fits perfectly on load** — sized to its container, no pan/zoom needed, never cut off or
  over-zoomed (the "loads too zoomed in" bug). Pan/zoom becomes optional, not the default view.
- **Smaller** footprint than the current 440px canvas; tokenized strokes/nodes (theme-aware).
- **Image-ready** — optional `diagramImage` per case study; if present, render it instead of the SVG
  (and reuse as the card cover), so real exports drop in later with no code change.
*Acceptance:* a first-time viewer can read the flow at a glance; diagram fits on load (not zoomed);
it's smaller and theme-aware; adding an image swaps it with no code change.

### E. Projects (stay a grid — polish only)

**E1 — Converge into the UI.** Card surfaces/buttons theme-aware; remove dark-only assumptions.

**E2 — Hybrid links + restyle the case-study button.** Per `data/projects.ts`: public → GitHub
button (+ optional live stars/forks via GitHub REST, cached) and any demo link; private → Email /
LinkedIn / Case study. Replace the lone pill button with a small, tidy link row + the case-study
action. **Fix the "View case study" button** (friend: "looks very ugly, get rid of that arrow"):
remove the `→` arrow, drop the heavy pill, make it a clean themed button/text-link consistent with
the new search-result and link styling.
*Acceptance:* correct links per visibility; no fake stats on private work; the case-study control is
clean and arrow-free.

**E3 — Architecture-first.** Each project card surfaces a **compact architecture SVG preview**
(the same tokenized D2 diagram) as its visual, so architecture is seen before opening the drawer;
clicking opens the drawer on the Architecture tab (D1).
*Acceptance:* architecture is visible at the card level, not hidden two clicks deep.

**E4 — Add the Converge project.** Add Converge as a third project card. Facts below are from the
official **Devpost** submission (authoritative) + the repo.

> **Converge** — "An AI-powered lecture capture & study platform — learning with no friction."
> **Moss's role: Full-Stack Developer.** **SwanHacks Spring 2026** (Hackathon Club @ Iowa State,
> Ames IA · May 3 2026 · themes: Social Good / Web). Team of 4: Moss Louvan, Jack Lau, Jefrey Allen,
> "BuildingForFun". Represent honestly as a team hackathon project.
>
> - **What it does:** capture live lecture audio (browser) or upload a recording → **real-time
>   transcription** → auto-generates **structured notes, flashcards, and quizzes** from the
>   transcript. **SM-2 spaced repetition** + **Pomodoro** study sessions. **Canvas** integration maps
>   materials to courses. Deep **accessibility**: text-to-speech, dyslexia-friendly fonts, reading
>   ruler, focus mode, and **ASL fingerspelling-to-text** via client-side hand-landmark detection.
> - **How (for the architecture diagram):** React 19 + Vite 6 + TanStack Router, Tailwind v4, Framer
>   Motion. **PocketBase** backend/db. Real-time STT = **Deepgram (Nova-2) over WebSocket**; batch STT
>   = **OpenAI Whisper**. AI generation = **GPT-4o-mini** through a **5-stage pipeline**
>   (STT → cleanup → notes → flashcards → quiz) with retry logic + partial-result persistence. ASL =
>   **MediaPipe Hands**, fully client-side (21 landmarks/hand @ 15fps → 69-feature vector → classify).
> - **Tags:** React 19 · TanStack Router · Tailwind · PocketBase · Deepgram · Whisper · GPT-4o-mini ·
>   MediaPipe.
> - **Brand:** soft green `#7bd88f` (harmonizes with the cream theme).
> - **Architecture (clear, D2-style flow):** `Mic / Upload → Capture →` (`Deepgram (live)` ‖
>   `Whisper (batch)`) `→ Transcript → AI pipeline (GPT-4o-mini: cleanup → notes → flashcards →
>   quiz) → {Notes, Flashcards (SM-2), Quizzes}`. Side paths: `Webcam → MediaPipe Hands (ASL) → text`;
>   `Canvas ⇄ Courses`; everything persisted in **PocketBase**; **Accessibility layer** (TTS,
>   dyslexia font, reading ruler, focus mode) wraps the UI.
> - **Links:** GitHub `https://github.com/jackulau/SwanHacksSpring2026` (public) ·
>   Devpost `https://devpost.com/software/converge-4ek5ho`.

*Acceptance:* Converge appears under Projects with accurate copy/tags, a clear architecture diagram,
and working GitHub + Devpost links; Moss is shown as Full-Stack Developer on a 4-person team.

### F. Achievements — The Signature Card Display (unique; Achievements only)

An **original** focus carousel (inspired by Jack's *quality*, not his layout):

- Horizontal **scroll-snap** deck; the centered card is in focus (full opacity, soft lift/shadow),
  neighbors scale to ~0.92 and dim to ~0.5 — **flat & editorial, no 3D skew** (the differentiator).
- **Captions always visible** beneath each photo (data already in `data/achievementCaptions.ts`).
- Controls: drag/swipe, prev/next arrows, **progress dots**, arrow-key nav; click a card → existing
  lightbox (kept, now theme-aware via A1).
- Fully responsive (1 card mobile → peek neighbors on desktop); `prefers-reduced-motion` →
  static, scrollable row.
*Acceptance:* achievements present as a swipeable focus deck with captions; feels custom; smooth
on mobile + desktop; lightbox still works.

### G. Cross-Cutting Polish

- **G1 Responsive sweep** — verify all new components at 375 / 768 / 1440.
- **G2 Reduced-motion** — wipe, deck, typewriter, staggers all degrade gracefully.
- **G3 (optional) Hero typewriter** — add **skip-on-scroll/click/keypress** to reveal instantly,
  keep tunable speed. (Your existing `SPEC-hero-typewriter.md` already lists "too long" as a risk.)

---

## 7. Build Sequence (low-risk → high-impact)

| Phase | Items | Why first |
|-------|-------|-----------|
| 0 | Shared blocks + A1 + A2 | Unlocks convergence everywhere |
| 1 | A3 toggle behavior | Quick, visible win |
| 2 | B1–B5 search | Highest "rough edge" payoff |
| 3 | C skills tiles | Self-contained, big visual upgrade |
| 4 | D drawer | Converge + architecture-first |
| 5 | E projects | Needs repo inputs (Section 3) |
| 6 | F achievements deck | The signature; build on stable base |
| 7 | G polish | Final pass |

---

## 8. File Change Summary

| File | Change |
|------|--------|
| `app/layout.tsx` | Pre-paint theme script |
| `app/globals.css` | Surface tokens; rewrite `.cp-*`; tokenize `.csd-*`, `.lightbox-*`; skills-grid; achievements-deck; remove duplicate CSS |
| `lib/usePlatform.ts` | **New** — OS detection |
| `data/skills.ts` | **New** — structured skills + logos |
| `data/projects.ts` | **New** — projects + visibility + links + repo |
| `public/logos/skills/*.svg` | **New** — bundled brand logos |
| `components/CommandPalette.tsx` | Index-all, suggestion feed, restyle, shortcut, focus fix |
| `components/ThemeToggle.tsx` | Instant switch + slide-after + reduced-motion |
| `components/SkillsGrid.tsx` | **New** — replaces `ChipGroup` usage |
| `components/CaseStudyDrawer.tsx` | Tokenized, Architecture-default, compact diagram, image-ready, visible links |
| `components/SystemDiagram.tsx` | **New** — compact tokenized SVG (extracted), image-swappable |
| `components/AchievementsCarousel.tsx` | **New** — signature deck (replaces gallery grid) |
| `components/ProjectCard.tsx` | **New** — grid card w/ hybrid links + arch preview |
| `app/page.tsx` | Wire new components; optional typewriter skip |

---

## 9. Testing

- **Unit:** search-index builder (every content type indexed), `usePlatform`, theme resolution.
- **Component:** SkillsGrid logo/fallback; AchievementsCarousel nav + reduced-motion.
- **E2E (Playwright):** open search → suggestion feed → query returns hits; toggle theme →
  overlays converge; open case study → Architecture default → light-mode native; achievements swipe.
- **Manual:** responsive at 375/768/1440 in both themes.

---

## 10. Risks

| Risk | Mitigation |
|------|------------|
| GitHub live stats = rate limits / private repos | Cache + graceful fallback; only for public repos |
| Brand logos missing/licensing | simple-icons (CC0), bundled; monogram fallback |
| Scope creep from "exceptional" | One signature interaction (Achievements); rest stays clean |
| Carousel a11y/mobile feel | scroll-snap native + keyboard + reduced-motion from the start |
