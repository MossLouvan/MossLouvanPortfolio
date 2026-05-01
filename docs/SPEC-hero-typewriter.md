# Spec: Animated Hero Typewriter Effect

## Goal

Transform the hero title text from a static block into a cinematic, sequentially-typed animation that gives a "wow factor" first impression. The text types out character-by-character with a blinking cursor, with key phrases highlighted as they complete.

## Current State

- `app/page.tsx` lines 187-196: `<motion.h1>` with a simple fade+slide-up via Framer Motion
- Text: "I'm Moss, a full-ride Software Engineering student at Iowa State University and winner of NASA's 2024 App Development Challenge. I've shipped AI applications for fortune 500 companies and led a national winning lunar exploration project."
- Styling: `hero-title` class, 3.5rem, font-weight 300

## Design

### Typewriter Behavior

1. **Initial delay** (0.8s) — wait for the avatar/photo to animate in first
2. **Type out** the full text character-by-character at ~40ms per character
3. **Blinking cursor** — a `|` character at the end of the typed text, blinking at 530ms intervals via CSS animation. Cursor disappears 1.5s after typing completes.
4. **Phrase highlights** — as each key phrase finishes typing, it gets a subtle glow/color accent:
   - "full-ride Software Engineering student" — slight brightness boost
   - "NASA's 2024 App Development Challenge" — slight brightness boost
   - "AI applications" — slight brightness boost
   - "fortune 500" → "Fortune 500" (fix capitalization)
5. **Speed variation** — brief pauses at punctuation:
   - Period/comma: +120ms pause
   - "and"/"I've": +60ms pause (natural breath)

### Visual Polish

- Each character fades in with a tiny opacity transition (0 → 1 over 50ms) rather than just appearing, giving a smoother feel than a raw typewriter
- The CTA buttons ("Get in Touch", "LinkedIn") fade in only after typing completes (currently they fade in at 0.55s delay — change to dynamic delay based on typing duration)
- The subtitle text below the avatar also waits for typing to finish before appearing

### Component Structure

```
components/
  Typewriter.tsx    # New component
```

**`Typewriter.tsx` props:**
```typescript
interface TypewriterProps {
  text: string;
  highlights?: string[];       // phrases to accent after they type
  speed?: number;              // ms per character (default: 40)
  initialDelay?: number;       // ms before typing starts (default: 800)
  punctuationDelay?: number;   // extra ms at punctuation (default: 120)
  onComplete?: () => void;     // callback when typing finishes
  className?: string;
}
```

**Internal state:**
- `displayedCount: number` — how many characters are visible (0 → text.length)
- `isComplete: boolean` — typing finished
- `showCursor: boolean` — controls cursor visibility after completion

**Rendering approach:**
- Render the FULL text in the DOM at all times (for layout stability / no CLS)
- Characters beyond `displayedCount` get `visibility: hidden` (preserves layout)
- Characters within `displayedCount` get `opacity: 1` with a CSS transition
- This avoids layout shifts as text types out

### Integration into page.tsx

**Current:**
```tsx
<motion.h1 className="hero-title" initial={{...}} animate={{...}} transition={{...}}>
  I'm Moss, a full-ride Software Engineering student...
</motion.h1>
```

**New:**
```tsx
<Typewriter
  text="I'm Moss, a full-ride Software Engineering student at Iowa State University and winner of NASA's 2024 App Development Challenge. I've shipped AI applications for Fortune 500 companies and led a national winning lunar exploration project."
  highlights={[
    "full-ride Software Engineering student",
    "NASA's 2024 App Development Challenge",
    "AI applications",
    "Fortune 500",
  ]}
  speed={40}
  initialDelay={800}
  onComplete={() => setHeroTypingDone(true)}
  className="hero-title"
/>
```

- Add `const [heroTypingDone, setHeroTypingDone] = useState(false);` to HomePage
- The CTA buttons and subtitle use `heroTypingDone` to trigger their fade-in (instead of hardcoded delays)
- Remove the `<motion.h1>` wrapper — the Typewriter handles its own animation

### Styling

**New CSS additions:**

```css
/* Blinking cursor */
.typewriter-cursor {
  display: inline;
  animation: blink 1.06s step-end infinite;
  font-weight: 100;
  color: var(--fg);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Highlight glow on key phrases */
.typewriter-highlight {
  color: var(--fg);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
  transition: text-shadow 0.5s ease;
}

html:not(.dark) .typewriter-highlight {
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
}
```

No changes to existing `.hero-title` styles.

## Accessibility

- Full text is always in the DOM (just visually hidden during typing) — screen readers see everything immediately
- `prefers-reduced-motion: reduce` — skip animation entirely, show all text immediately, call `onComplete` on mount
- No `aria-live` needed since the text is already in the DOM

## Performance

- Single `setTimeout` chain (not `setInterval`) — self-cleaning on unmount
- No DOM mutations beyond updating a counter and toggling visibility classes
- No external dependencies — pure React + CSS

## File Changes Summary

| File | Change |
|------|--------|
| `components/Typewriter.tsx` | **New** — typewriter animation component |
| `app/page.tsx` | Replace `<motion.h1>` with `<Typewriter>`, add `heroTypingDone` state, wire CTA/subtitle delays |
| `app/globals.css` | Add `.typewriter-cursor`, `@keyframes blink`, `.typewriter-highlight` |

## Timing Budget

- Text length: ~230 characters
- At 40ms/char + punctuation pauses (~6 periods/commas × 120ms): ~10s total
- That's a bit long. **Recommend 30ms/char** → ~7.6s total, which feels snappy but readable
- Can be tuned via the `speed` prop

## Risks

- **Typing duration too long** — users may scroll before it finishes. Mitigation: `speed` prop is tunable; could also add a "skip" click handler that instantly reveals all text.
- **Layout shift** — Mitigated by rendering full text with `visibility: hidden` so the layout is stable from frame 1.
