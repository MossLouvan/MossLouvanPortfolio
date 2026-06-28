"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  if (!mounted || !theme) return <div style={{ width: 54, height: 28 }} />;

  const isDark = theme === "dark";

  const applyTheme = (next: "light" | "dark") => {
    // Color flips immediately — this is what makes the toggle feel responsive.
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore (private mode etc.)
    }
  };

  const toggleTheme = () => {
    const next: "light" | "dark" = isDark ? "light" : "dark";

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const doc = document as DocWithVT;

    // No View Transitions support (or reduced motion) → flip instantly, no flourish.
    if (prefersReduced || !doc.startViewTransition) {
      applyTheme(next);
      return;
    }

    // Circular reveal that grows from the toggle button.
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
        /* transition skipped — theme already applied */
      });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileTap={{ scale: 0.94 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 54,
        height: 28,
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "transparent",
        cursor: "pointer",
        padding: 3,
        outline: "none",
        flexShrink: 0,
      }}
    >
      {/* Sliding knob */}
      <motion.span
        animate={{ x: isDark ? 0 : 26 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "var(--fg)",
          color: "var(--bg)",
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ display: "flex", lineHeight: 1 }}
          >
            {isDark ? <MoonIcon size={11} /> : <SunIcon size={11} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
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
      strokeWidth={2.5}
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
