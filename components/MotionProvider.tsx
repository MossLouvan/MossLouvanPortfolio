"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads Framer Motion's feature set once, at the root.
 *
 * Components import `m` instead of `motion`, which keeps the ~30 kb animation
 * runtime out of every component bundle. `strict` makes `motion.*` throw so a
 * stray full import can't silently undo the saving.
 *
 * `domAnimation` covers animate/exit/gestures/whileInView. Nothing here uses
 * Framer layout animations or drag, so the heavier `domMax` bundle would only
 * add projection code we never run.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
