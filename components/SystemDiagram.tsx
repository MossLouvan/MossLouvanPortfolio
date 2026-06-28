"use client";

import React, { useRef, useState } from "react";

/**
 * A clean, deterministic architecture diagram with draggable nodes.
 *
 * - Top→down layered flow (longest-path layering) so data direction is obvious.
 * - Arrowheads on every edge; nodes ordered to minimise crossings.
 * - Pure SVG sized by viewBox → fits its container perfectly on load.
 * - Nodes are draggable (pointer / touch) to rearrange; edges follow.
 * - Theme-aware via CSS variables.
 * - If `imageSrc` is provided, renders that image instead.
 */

export type DiagramNode = { id: string; label: string };
export type DiagramEdge = { from: string; to: string };

const W = 520;
const PAD_X = 18;
const PAD_TOP = 14;
const PAD_BOTTOM = 16;
const NODE_H = 50;
const NODE_GAP = 16;
const ROW_STRIDE = 92;
const MAX_NODE_W = 240;

function computeLayers(nodes: DiagramNode[], edges: DiagramEdge[]): Map<string, number> {
  const incoming = new Map<string, string[]>();
  nodes.forEach((n) => incoming.set(n.id, []));
  edges.forEach((e) => {
    if (incoming.has(e.to)) incoming.get(e.to)!.push(e.from);
  });

  const layer = new Map<string, number>();
  nodes.forEach((n) => layer.set(n.id, 0));

  for (let iter = 0; iter < nodes.length; iter++) {
    let changed = false;
    for (const n of nodes) {
      let mx = 0;
      for (const from of incoming.get(n.id)!) mx = Math.max(mx, (layer.get(from) ?? 0) + 1);
      if (mx !== layer.get(n.id)) {
        layer.set(n.id, mx);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return layer;
}

type Placed = { x: number; y: number; w: number; cx: number };
type Offset = { dx: number; dy: number };

export default function SystemDiagram({
  nodes,
  edges,
  imageSrc,
  imageAlt,
  frame = true,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  imageSrc?: string;
  imageAlt?: string;
  frame?: boolean;
}) {
  const wrapClass = frame ? "sysdiagram" : "sysdiagram sysdiagram-bare";
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseDx: number;
    baseDy: number;
  } | null>(null);

  if (imageSrc) {
    return (
      <div className={wrapClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sysdiagram-img" src={imageSrc} alt={imageAlt ?? "Architecture diagram"} />
      </div>
    );
  }

  const layer = computeLayers(nodes, edges);
  const maxLayer = Math.max(0, ...nodes.map((n) => layer.get(n.id) ?? 0));

  const base = new Map<string, Placed>();
  for (let r = 0; r <= maxLayer; r++) {
    const rowNodes = nodes.filter((n) => (layer.get(n.id) ?? 0) === r);
    const k = rowNodes.length;
    const nodeW = Math.min(MAX_NODE_W, (W - 2 * PAD_X - (k - 1) * NODE_GAP) / k);
    const totalW = k * nodeW + (k - 1) * NODE_GAP;
    const startX = (W - totalW) / 2;
    const y = PAD_TOP + r * ROW_STRIDE;
    rowNodes.forEach((node, i) => {
      const x = startX + i * (nodeW + NODE_GAP);
      base.set(node.id, { x, y, w: nodeW, cx: x + nodeW / 2 });
    });
  }

  const H = PAD_TOP + maxLayer * ROW_STRIDE + NODE_H + PAD_BOTTOM;

  const posOf = (id: string): Placed => {
    const p = base.get(id)!;
    const o = offsets[id] ?? { dx: 0, dy: 0 };
    return { x: p.x + o.dx, y: p.y + o.dy, w: p.w, cx: p.cx + o.dx };
  };

  const scaleNow = () => {
    const svg = svgRef.current;
    return svg && svg.clientWidth ? svg.clientWidth / W : 1;
  };

  const startDrag = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    const o = offsets[id] ?? { dx: 0, dy: 0 };
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, baseDx: o.dx, baseDy: o.dy };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const moveDrag = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const s = scaleNow();
    const dx = d.baseDx + (e.clientX - d.startX) / s;
    const dy = d.baseDy + (e.clientY - d.startY) / s;
    setOffsets((prev) => ({ ...prev, [d.id]: { dx, dy } }));
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className={wrapClass}>
      <svg
        ref={svgRef}
        className="sysdiagram-svg"
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label="System architecture diagram (drag the boxes to rearrange)"
      >
        <defs>
          <marker
            id="sd-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--diagram-stroke)" />
          </marker>
        </defs>

        {/* edges */}
        {edges.map((e, idx) => {
          const a = base.get(e.from) ? posOf(e.from) : null;
          const b = base.get(e.to) ? posOf(e.to) : null;
          if (!a || !b) return null;
          const ax = a.cx;
          const ay = a.y + NODE_H;
          const bx = b.cx;
          const by = b.y - 6;
          const dy = (by - ay) / 2;
          return (
            <path
              key={idx}
              d={`M ${ax} ${ay} C ${ax} ${ay + dy}, ${bx} ${by - dy}, ${bx} ${by}`}
              fill="none"
              stroke="var(--diagram-stroke)"
              strokeWidth={1.75}
              markerEnd="url(#sd-arrow)"
            />
          );
        })}

        {/* nodes (draggable) */}
        {nodes.map((node) => {
          const p = posOf(node.id);
          return (
            <g
              key={node.id}
              className="sysdiagram-node"
              onPointerDown={(e) => startDrag(e, node.id)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <rect
                x={p.x}
                y={p.y}
                rx={12}
                ry={12}
                width={p.w}
                height={NODE_H}
                fill="var(--diagram-node)"
                stroke="var(--diagram-node-border)"
                strokeWidth={1}
              />
              <foreignObject x={p.x} y={p.y} width={p.w} height={NODE_H}>
                <div className="sysdiagram-node-label">{node.label}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
