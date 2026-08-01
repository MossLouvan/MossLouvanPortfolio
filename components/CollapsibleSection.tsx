"use client";

import { useId, useState } from "react";
import { m } from "framer-motion";

/**
 * Section wrapper with a collapsible body.
 *
 * The open/close transition is pure CSS (`grid-template-rows: 0fr → 1fr`)
 * rather than an animated `height`. The browser interpolates it natively, so
 * there is no per-frame JavaScript and no React re-render while it plays —
 * which matters because these sections wrap image grids and a 3D carousel.
 *
 * The body stays mounted when collapsed so crawlers still index it, and
 * `inert` keeps it out of the tab order and the accessibility tree while it is
 * clipped to zero height. Note that `inert` also excludes it from find-in-page
 * — collapsed copy is not reachable by Ctrl+F, same as when it was unmounted.
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
  const contentId = useId();

  return (
    <m.section
      id={id}
      className="collapsible-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* The button sits *inside* the heading, not the other way round: <h2> is
          flow content and isn't valid inside <button>, and ARIA treats button
          children as presentational — which would drop every section heading
          out of screen-reader heading navigation. */}
      <h2 className="section-title">
        <button
          type="button"
          className="section-header"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
        >
          <span>{title}</span>
          <m.span
            className="section-toggle"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            aria-hidden
          >
            ▼
          </m.span>
        </button>
      </h2>

      <div className="section-collapse" data-open={open ? "true" : "false"}>
        <div id={contentId} className="section-content" inert={!open}>
          {children}
        </div>
      </div>
    </m.section>
  );
}
