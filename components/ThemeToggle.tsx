"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);
  const [wipe, setWipe] = useState<{ key: number; toLight: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  if (!mounted || !theme) return <div style={{ width: 56, height: 28 }} />;

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setWipe({ key: Date.now(), toLight: next === "light" });

    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  };

  const isDark = theme === "dark";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, marginTop: 8 }}>
    {/* Slide wipe overlay */}
    <AnimatePresence>
      {wipe && (
        <motion.div
          key={wipe.key}
          initial={{ x: wipe.toLight ? "-100%" : "100%" }}
          animate={{ x: "0%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => setWipe(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: wipe.toLight
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.12)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </AnimatePresence>

    <motion.button
      ref={btnRef}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileTap={{ scale: 0.94, rotate: isDark ? 15 : -15 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 52,
        height: 28,
        borderRadius: 999,
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
        background: isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.06)",
        cursor: "pointer",
        padding: 3,
        outline: "none",
        transition: "border-color 0.3s ease, background 0.3s ease",
        flexShrink: 0,
      }}
    >
      {/* Track icons */}
      <span
        style={{
          position: "absolute",
          left: 6,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: isDark ? 0.3 : 0,
          transition: "opacity 0.25s ease",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        <SunIcon size={13} color="#f59e0b" />
      </span>
      <span
        style={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: isDark ? 0 : 0.3,
          transition: "opacity 0.25s ease",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        <MoonIcon size={13} color="#6366f1" />
      </span>

      {/* Sliding knob */}
      <motion.span
        layout
        animate={{ x: isDark ? 0 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: isDark ? "#1e1e2e" : "#ffffff",
          boxShadow: isDark
            ? "0 1px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 1px 4px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ display: "flex", lineHeight: 1 }}
          >
            {isDark ? (
              <MoonIcon size={12} color="#a5b4fc" />
            ) : (
              <SunIcon size={12} color="#f59e0b" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.button>

    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {theme}
      </motion.span>
    </AnimatePresence>
    </div>
  );
}

function SunIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
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

function MoonIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke="none"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
