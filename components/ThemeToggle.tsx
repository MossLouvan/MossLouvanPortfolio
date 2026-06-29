"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";

type DocWithVT = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);
  const maskId = useId();

  // Read whatever the pre-paint script already applied (saved choice or OS preference).
  useEffect(() => {
    setMounted(true);
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  // Reserve the same footprint before mount to avoid layout shift.
  if (!mounted || !theme) return <div className="theme-toggle" aria-hidden />;

  const isDark = theme === "dark";

  const applyTheme = (next: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const next: "light" | "dark" = isDark ? "light" : "dark";
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const doc = document as DocWithVT;

    if (prefersReduced || !doc.startViewTransition) {
      applyTheme(next);
      return;
    }

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        // New theme wipes in behind a 45° edge sweeping from the toggle's
        // corner (top-right) to the bottom-left — cleaner than a circle.
        document.documentElement.animate(
          {
            clipPath: [
              "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
              "polygon(-120% 0%, 100% 0%, 100% 220%, 100% 220%)",
            ],
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        /* transition skipped */
      });
  };

  return (
    <motion.button
      type="button"
      className="theme-toggle"
      data-theme={isDark ? "dark" : "light"}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileTap={{ scale: 0.88 }}
    >
      {/*
        One disc that morphs: a masked "shadow" circle (.tt-cut) slides across to
        carve a crescent for the moon, while the rays (.tt-rays) retract for night.
        The morph itself is driven by CSS keyed on the button's data-theme.
      */}
      <svg
        className="theme-toggle-svg"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle className="tt-cut" cx="16" cy="8" r="6" fill="black" />
        </mask>
        <circle
          className="tt-disc"
          cx="12"
          cy="12"
          r="6"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g
          className="tt-rays"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <line x1="12" y1="1" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="23" />
          <line x1="1" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="23" y2="12" />
          <line x1="4.1" y1="4.1" x2="6.2" y2="6.2" />
          <line x1="17.8" y1="17.8" x2="19.9" y2="19.9" />
          <line x1="4.1" y1="19.9" x2="6.2" y2="17.8" />
          <line x1="17.8" y1="6.2" x2="19.9" y2="4.1" />
        </g>
      </svg>
    </motion.button>
  );
}
