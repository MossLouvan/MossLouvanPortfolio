"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type DocWithVT = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
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
      ref={buttonRef}
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileTap={{ scale: 0.92 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="theme-toggle-icon"
          initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.4, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isDark ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function SunIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
