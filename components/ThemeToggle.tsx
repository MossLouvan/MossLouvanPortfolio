"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WIPE_DURATION = 0.7; // seconds

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);
  const [wipe, setWipe] = useState<{ key: number; toLight: boolean } | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  if (!mounted || !theme) return <div style={{ width: 56, height: 28 }} />;

  const toggleTheme = () => {
    if (wipe) return; // ignore during in-flight wipe
    const next = theme === "dark" ? "light" : "dark";
    setWipe({ key: Date.now(), toLight: next === "light" });

    // switch the theme when the wipe fully covers the screen (midpoint)
    window.setTimeout(() => {
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      window.localStorage.setItem("theme", next);
    }, (WIPE_DURATION * 1000) / 2);
  };

  const isDark = theme === "dark";

  return (
    <>
      {/* Full-screen opaque wipe */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            key={wipe.key}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: WIPE_DURATION, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={() => setWipe(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: wipe.toLight ? "#fafafa" : "#0a0a0a",
              pointerEvents: "none",
              zIndex: 9999,
              willChange: "transform",
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <motion.button
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
    </>
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
