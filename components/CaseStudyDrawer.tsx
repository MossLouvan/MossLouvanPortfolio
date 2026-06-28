"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy } from "@/data/caseStudies";
import SystemDiagram from "@/components/SystemDiagram";
import LinkIcon from "@/components/LinkIcon";

type Tab = "architecture" | "overview" | "impact";

export default function CaseStudyDrawer({
  open,
  onClose,
  study,
}: {
  open: boolean;
  onClose: () => void;
  study: CaseStudy | null;
}) {
  // Architecture is shown first by default.
  const [tab, setTab] = useState<Tab>("architecture");

  useEffect(() => {
    if (open) setTab("architecture");
  }, [open, study?.slug]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && study && (
        <motion.div
          className="csd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Case study drawer"
        >
          <motion.aside
            className="csd-panel"
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="csd-header">
              <div>
                <div className="csd-title">{study.title}</div>
                <div className="csd-subtitle">
                  {study.subtitle}
                  {study.timeframe ? ` · ${study.timeframe}` : ""}
                </div>
              </div>
              <button className="csd-close" onClick={onClose} aria-label="Close drawer">
                ✕
              </button>
            </div>

            <div className="csd-tabs">
              <button
                className={`csd-tab ${tab === "architecture" ? "active" : ""}`}
                onClick={() => setTab("architecture")}
              >
                Architecture
              </button>
              <button
                className={`csd-tab ${tab === "overview" ? "active" : ""}`}
                onClick={() => setTab("overview")}
              >
                Overview
              </button>
              <button
                className={`csd-tab ${tab === "impact" ? "active" : ""}`}
                onClick={() => setTab("impact")}
              >
                Impact
              </button>
            </div>

            <div className="csd-body">
              {tab === "architecture" && (
                <div className="csd-section">
                  <h3>How it works</h3>
                  {study.flow && (
                    <ol className="project-flow csd-flow">
                      {study.flow.map((step, i) => (
                        <li key={i} className="project-flow-step">
                          <span className="project-flow-num">{i + 1}</span>
                          <span className="project-flow-text">{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  <h3>System diagram</h3>
                  <SystemDiagram
                    nodes={study.architecture.nodes}
                    edges={study.architecture.edges}
                    imageSrc={study.diagramImage}
                    imageAlt={`${study.title} architecture`}
                  />

                  <h3>Components</h3>
                  <ul>
                    {study.architecture.nodes.map((n) => (
                      <li key={n.id}>
                        <strong>{n.label}:</strong> {n.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "overview" && (
                <div className="csd-section">
                  <h3>Problem</h3>
                  <p>{study.overview.problem}</p>

                  <h3>Role</h3>
                  <p>{study.overview.role}</p>

                  <h3>Solution</h3>
                  <p>{study.overview.solution}</p>

                  <h3>Highlights</h3>
                  <ul>
                    {study.overview.highlights.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  {study.links?.length ? (
                    <>
                      <h3>Links</h3>
                      <div className="csd-links">
                        {study.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                            rel="noreferrer"
                            className="csd-link"
                          >
                            <LinkIcon href={l.href} />
                            <span>{l.label}</span>
                          </a>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {tab === "impact" && (
                <div className="csd-section">
                  <h3>Impact</h3>
                  <ul>
                    {study.impact.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
