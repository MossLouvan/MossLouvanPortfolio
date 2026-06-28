"use client";

import { useEffect, useState } from "react";

type NavigatorUAData = Navigator & {
  userAgentData?: { platform?: string };
};

/**
 * Detects whether the visitor is on an Apple platform (macOS/iOS) so UI can show
 * the correct keyboard shortcut glyph (⌘ on Apple, Ctrl elsewhere).
 *
 * Returns `isApple: null` until mounted to avoid SSR/hydration mismatches —
 * callers should render a neutral state (or hide the hint) while it is null.
 */
export function usePlatform(): { isApple: boolean | null } {
  const [isApple, setIsApple] = useState<boolean | null>(null);

  useEffect(() => {
    const nav = navigator as NavigatorUAData;
    const platform = nav.userAgentData?.platform || navigator.platform || "";
    const ua = navigator.userAgent || "";
    const apple = /mac|iphone|ipad|ipod/i.test(platform) || /mac|iphone|ipad|ipod/i.test(ua);
    setIsApple(apple);
  }, []);

  return { isApple };
}

/** Convenience: the modifier glyph for the current platform. */
export function modKeyLabel(isApple: boolean | null): string {
  // Default to "Ctrl" until known so Windows/Linux (the majority) never see a wrong ⌘.
  return isApple ? "⌘" : "Ctrl";
}
