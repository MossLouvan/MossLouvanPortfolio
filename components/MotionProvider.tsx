"use client";

import { LazyMotion, domMax } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads Framer Motion's feature set once, at the root.
 *
 * Components import `m` instead of `motion`, which keeps the ~30 kb animation
 * runtime out of every component bundle. `strict` makes `motion.*` throw so a
 * stray full import can't silently undo the saving.
 *
 * `domMax` (rather than `domAnimation`) because CollapsibleSection and
 * CommandPalette rely on layout animations.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
