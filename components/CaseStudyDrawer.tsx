"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy } from "@/data/caseStudies";
import PanZoomCanvas from "@/components/PanZoomCanvas";

type Tab = "overview" | "architecture" | "impact";

const NODE_W = 220;
const NODE_H = 44;
const NODE_RX = 12;

export default function CaseStudyDrawer({
  open,
  onClose,
  study,
}: {
  open: boolean;
  onClose: () => void;
  study: CaseStudy | null;
}) {
  const [tab, setTab] = useState<Tab>("overview");

  // current panzoom scale (needed for correct drag deltas when zoomed)
  const [pzScale, setPzScale] = useState(1);

  // draggable node positions in SVG space
  const [nodePos, setNodePos] = useState<Record<string, { x: number; y: number }>>({});

  // dragging state
  const draggingIdRef = useRef<string | null>(null);
  const lastClientRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) setTab("overview");
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

  const diagram = useMemo(() => {
    if (!study) return null;

    const nodes = study.architecture.nodes;
    const edges = study.architecture.edges;

    // Basic left/right layout you already had
    const leftX = 70;
    const rightX = 360;
    const startY = 40;
    const colH = 280;

    const mid = Math.ceil(nodes.length / 2);
    const left = nodes.slice(0, mid);
    const right = nodes.slice(mid);

    const pos: Record<string, { x: number; y: number }> = {};

    left.forEach((n, i) => {
      pos[n.id] = { x: leftX, y: startY + i * (colH / Math.max(left.length, 1)) };
    });
    right.forEach((n, i) => {
      pos[n.id] = { x: rightX, y: startY + i * (colH / Math.max(right.length, 1)) };
    });

    // ✅ Compute real bounds so W/H actually contain the boxes
    const margin = 80;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const n of nodes) {
      const p = pos[n.id] ?? { x: leftX, y: startY };
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + NODE_W);
      maxY = Math.max(maxY, p.y + NODE_H);
    }

    // give extra room for curves
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;

    const W = Math.max(520, maxX - minX);
    const H = Math.max(280, maxY - minY);

    // Shift everything into positive space for viewBox (so minX/minY don’t clip)
    const shifted: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) {
      const p = pos[n.id];
      shifted[n.id] = { x: p.x - minX, y: p.y - minY };
    }

    return { W, H, nodes, edges, initialPos: shifted };
  }, [study]);

  // when study changes, reset draggable positions
  useEffect(() => {
    if (!diagram) return;
    setNodePos(diagram.initialPos);
  }, [diagram?.W, diagram?.H, study?.slug]); // intentional reset per case study

  const startNodeDrag = (e: React.PointerEvent, id: string) => {
    e.stopPropagation(); // prevent PanZoom panning
    draggingIdRef.current = id;
    pointerIdRef.current = e.pointerId;
    lastClientRef.current = { x: e.clientX, y: e.clientY };

    // capture pointer on the element you clicked
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const moveNodeDrag = (e: React.PointerEvent) => {
    const id = draggingIdRef.current;
    if (!id) return;

    e.stopPropagation();

    const dx = e.clientX - lastClientRef.current.x;
    const dy = e.clientY - lastClientRef.current.y;
    lastClientRef.current = { x: e.clientX, y: e.clientY };

    // Convert screen pixels to SVG space by dividing by current panzoom scale
    const s = pzScale || 1;

    setNodePos((prev) => {
      const cur = prev[id] ?? { x: 0, y: 0 };
      return {
        ...prev,
        [id]: { x: cur.x + dx / s, y: cur.y + dy / s },
      };
    });
  };

  const endNodeDrag = (e: React.PointerEvent) => {
    const id = draggingIdRef.current;
    if (!id) return;

    e.stopPropagation();
    draggingIdRef.current = null;

    const pid = pointerIdRef.current;
    pointerIdRef.current = null;

    try {
      if (pid != null) (e.currentTarget as HTMLElement).releasePointerCapture(pid);
    } catch {
      // ignore
    }
  };

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
              <button className={`csd-tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
                Overview
              </button>
              <button
                className={`csd-tab ${tab === "architecture" ? "active" : ""}`}
                onClick={() => setTab("architecture")}
              >
                Architecture
              </button>
              <button className={`csd-tab ${tab === "impact" ? "active" : ""}`} onClick={() => setTab("impact")}>
                Impact
              </button>
            </div>

            <div className="csd-body">
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
                          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn ghost">
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {tab === "architecture" && diagram && (
                <div className="csd-section">
                  <h3>System diagram</h3>

                  <PanZoomCanvas
                    height={440}
                    showGrid
                    contentWidth={diagram.W}
                    contentHeight={diagram.H}
                    
                    minScale={0.5}
                    maxScale={2.8}
                    onTransformChange={(t) => setPzScale(t.scale)}
                  >
                    <svg
                      width={diagram.W}
                      height={diagram.H}
                      viewBox={`0 0 ${diagram.W} ${diagram.H}`}
                      style={{ display: "block" }}
                    >
                      {/* edges */}
                      {diagram.edges.map((e, idx) => {
                        const a = nodePos[e.from] ?? diagram.initialPos[e.from];
                        const b = nodePos[e.to] ?? diagram.initialPos[e.to];
                        if (!a || !b) return null;

                        const ax = a.x + NODE_W;
                        const ay = a.y + NODE_H / 2;
                        const bx = b.x;
                        const by = b.y + NODE_H / 2;

                        const c1x = ax + 90;
                        const c1y = ay;
                        const c2x = bx - 90;
                        const c2y = by;

                        return (
                          <path
                            key={idx}
                            d={`M ${ax} ${ay} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${bx} ${by}`}
                            fill="none"
                            stroke="rgba(255,255,255,0.22)"
                            strokeWidth="2.25"
                          />
                        );
                      })}

                      {/* nodes */}
                      {diagram.nodes.map((n) => {
                        const p = nodePos[n.id] ?? diagram.initialPos[n.id];
                        if (!p) return null;

                        return (
                          <g
                            key={n.id}
                            data-pan-ignore="true"
                            onPointerDown={(e) => startNodeDrag(e, n.id)}
                            onPointerMove={moveNodeDrag}
                            onPointerUp={endNodeDrag}
                            onPointerCancel={endNodeDrag}
                            style={{ cursor: "grab" }}
                          >
                            <rect
                              x={p.x}
                              y={p.y}
                              rx={NODE_RX}
                              ry={NODE_RX}
                              width={NODE_W}
                              height={NODE_H}
                              fill="rgba(255,255,255,0.06)"
                              stroke="rgba(255,255,255,0.16)"
                            />
                            <text
                              x={p.x + 12}
                              y={p.y + 28}
                              fill="rgba(255,255,255,0.92)"
                              fontSize="14"
                              fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
                              style={{ userSelect: "none" }}
                            >
                              {n.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </PanZoomCanvas>

                  <h3>Component notes</h3>
                  <ul>
                    {study.architecture.nodes.map((n) => (
                      <li key={n.id}>
                        <strong>{n.label}:</strong> {n.desc}
                      </li>
                    ))}
                  </ul>
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