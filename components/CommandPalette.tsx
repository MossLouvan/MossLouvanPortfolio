"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
  // either href OR action
  href?: string;
  action?: () => void;
};

export default function CommandPalette({ commands }: { commands: CommandItem[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const meta = e.metaKey || e.ctrlKey;

      if (meta && isK) {
        e.preventDefault();
        setOpen(true);
      }

      if (open) {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowDown") setActive((a) => a + 1);
        if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
        if (e.key === "Enter") {
          const list = filtered;
          const item = list[Math.min(active, list.length - 1)];
          if (item) run(item);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, query]);

  // click outside closes (but scroll should NOT close)
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // focus input when open
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;

    return commands.filter((c) => {
      const hay = [
        c.label,
        c.group ?? "",
        ...(c.keywords ?? []),
        c.href ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [commands, query]);

  // keep active in range
  useEffect(() => {
    if (!open) return;
    setActive((a) => Math.max(0, Math.min(a, Math.max(0, filtered.length - 1))));
  }, [filtered.length, open]);

  const grouped = useMemo(() => {
    const out = new Map<string, CommandItem[]>();
    for (const c of filtered) {
      const g = c.group ?? "Other";
      if (!out.has(g)) out.set(g, []);
      out.get(g)!.push(c);
    }
    return Array.from(out.entries());
  }, [filtered]);

  const run = (item: CommandItem) => {
    if (item.action) item.action();
    if (item.href) window.open(item.href, item.href.startsWith("#") ? "_self" : "_blank");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="cp-root" data-open={open ? "true" : "false"}>
      {/* This is the header pill that expands horizontally */}
      <motion.button
        type="button"
        className="cp-trigger"
        onClick={() => setOpen((v) => !v)}
        animate={{
          width: open ? 360 : 150,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      >
        {/* When closed: fake placeholder. When open: real input */}
        <AnimatePresence initial={false} mode="wait">
          {!open ? (
            <motion.div
              key="closed"
              className="cp-trigger-inner"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.12 }}
            >
              <span className="cp-placeholder">Search…</span>
              <span className="cp-kbd">⌘K</span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              className="cp-input-wrap"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.12 }}
              // Prevent click from toggling closed when interacting in input
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                className="cp-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search commands"
              />
              <span className="cp-kbd">⌘K</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown anchored to the expanding trigger (moves with it) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cp-panel"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 10, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {filtered.length === 0 ? (
              <div className="cp-empty">No results</div>
            ) : (
              <div className="cp-list" role="listbox" aria-label="Search results">
                {grouped.map(([group, items]) => (
                  <div key={group} className="cp-group">
                    <div className="cp-group-title">{group.toUpperCase()}</div>

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
                          {item.label}
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