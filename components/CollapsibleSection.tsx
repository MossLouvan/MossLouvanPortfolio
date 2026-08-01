"use client";

import { useState } from "react";
import { m } from "framer-motion";

/**
 * Section wrapper with a collapsible body.
 *
 * The open/close transition is pure CSS (`grid-template-rows: 0fr → 1fr`)
 * rather than an animated `height`. The browser interpolates it natively, so
 * there is no per-frame JavaScript and no React re-render while it plays —
 * which matters because these sections wrap image grids and a 3D carousel.
 *
 * The body also stays mounted when collapsed, so in-page search and anchor
 * links still reach it. `inert` keeps it out of the tab order while hidden.
 */
export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  id,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <m.section
      id={id}
      className="collapsible-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <button
        type="button"
        className="section-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h2 className="section-title">{title}</h2>
        <m.span
          className="section-toggle"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          aria-hidden
        >
          ▼
        </m.span>
      </button>

      <div className="section-collapse" data-open={open ? "true" : "false"}>
        <div className="section-content" inert={!open}>
          {children}
        </div>
      </div>
    </m.section>
  );
}
