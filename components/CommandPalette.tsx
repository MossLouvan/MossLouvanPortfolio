"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlatform } from "@/lib/usePlatform";

export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
  /** small right-aligned hint, e.g. "Case study" */
  meta?: string;
  /** shown in the empty-state suggestion feed */
  suggested?: boolean;
  // either href OR action
  href?: string;
  action?: () => void;
};

export default function CommandPalette({ commands }: { commands: CommandItem[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isApple } = usePlatform();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => c.suggested);

    return commands.filter((c) => {
      const hay = [c.label, c.group ?? "", c.meta ?? "", ...(c.keywords ?? []), c.href ?? ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [commands, query]);

  const run = (item: CommandItem) => {
    if (item.action) item.action();
    if (item.href) window.open(item.href, item.href.startsWith("#") ? "_self" : "_blank");
    setOpen(false);
  };

  // ⌘K / Ctrl+K + in-palette navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const meta = e.metaKey || e.ctrlKey;

      if (meta && isK) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      }
      if (e.key === "Enter") {
        const item = filtered[Math.min(active, filtered.length - 1)];
        if (item) run(item);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, active, filtered]);

  // click outside closes (scroll does not)
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // reset + focus the input once it has mounted (fixes "typing didn't register")
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 140);
    return () => window.clearTimeout(t);
  }, [open]);

  // keep active index in range
  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(a, Math.max(0, filtered.length - 1))));
  }, [filtered.length]);

  const grouped = useMemo(() => {
    const out = new Map<string, CommandItem[]>();
    for (const c of filtered) {
      const g = c.group ?? "Other";
      if (!out.has(g)) out.set(g, []);
      out.get(g)!.push(c);
    }
    return Array.from(out.entries());
  }, [filtered]);

  return (
    <div ref={rootRef} className="cp-root" data-open={open ? "true" : "false"}>
      <motion.button
        type="button"
        className="cp-trigger"
        onClick={() => setOpen((v) => !v)}
        animate={{ width: open ? 340 : 184 }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        aria-label="Open search"
      >
        <SearchIcon className="cp-icon" />
        <AnimatePresence initial={false}>
          {!open ? (
            <motion.div
              key="closed"
              className="cp-trigger-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <span className="cp-placeholder">Search</span>
              <span className="cp-kbd">{isApple ? "⌘K" : "Ctrl K"}</span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              className="cp-input-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                className="cp-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, skills, experience…"
                aria-label="Search"
                autoFocus
              />
              <span className="cp-kbd">esc</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cp-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {filtered.length === 0 ? (
              <div className="cp-empty">No results for “{query.trim()}”.</div>
            ) : (
              <div className="cp-list" role="listbox" aria-label="Search results">
                {grouped.map(([group, items]) => (
                  <div key={group} className="cp-group">
                    <div className="cp-group-title">{group}</div>
                    {items.map((item) => {
                      const idx = filtered.findIndex((x) => x.id === item.id);
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`cp-item ${isActive ? "active" : ""}`}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => run(item)}
                          role="option"
                          aria-selected={isActive}
                        >
                          <span>{item.label}</span>
                          {item.meta ? <span className="cp-item-meta">{item.meta}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
