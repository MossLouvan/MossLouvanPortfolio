"use client";

/**
 * A clean, deterministic architecture diagram.
 *
 * - Top→down layered flow (longest-path layering) so data direction is obvious.
 * - Arrowheads on every edge; nodes ordered to minimise crossings.
 * - Pure SVG sized by viewBox → fits its container perfectly on load (no pan/zoom,
 *   never over-zoomed or clipped).
 * - Theme-aware via CSS variables.
 * - If `imageSrc` is provided, renders that image instead (drop-in real diagrams later).
 */

export type DiagramNode = { id: string; label: string };
export type DiagramEdge = { from: string; to: string };

const W = 520;
const PAD_X = 18;
const PAD_TOP = 14;
const PAD_BOTTOM = 16;
const NODE_H = 50;
const NODE_GAP = 16;
const ROW_STRIDE = 92; // top-to-top distance between rows
const MAX_NODE_W = 240;

function computeLayers(nodes: DiagramNode[], edges: DiagramEdge[]): Map<string, number> {
  const incoming = new Map<string, string[]>();
  nodes.forEach((n) => incoming.set(n.id, []));
  edges.forEach((e) => {
    if (incoming.has(e.to)) incoming.get(e.to)!.push(e.from);
  });

  const layer = new Map<string, number>();
  nodes.forEach((n) => layer.set(n.id, 0));

  // Longest-path layering (iterate to stabilise; bounded by node count for safety)
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

type Placed = { node: DiagramNode; x: number; y: number; w: number; cx: number };

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
  /** when false, drops the bordered/padded wrapper (for use inside a card preview) */
  frame?: boolean;
}) {
  const wrapClass = frame ? "sysdiagram" : "sysdiagram sysdiagram-bare";

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

  // group + place
  const placed = new Map<string, Placed>();
  for (let r = 0; r <= maxLayer; r++) {
    const rowNodes = nodes.filter((n) => (layer.get(n.id) ?? 0) === r);
    const k = rowNodes.length;
    const nodeW = Math.min(MAX_NODE_W, (W - 2 * PAD_X - (k - 1) * NODE_GAP) / k);
    const totalW = k * nodeW + (k - 1) * NODE_GAP;
    const startX = (W - totalW) / 2;
    const y = PAD_TOP + r * ROW_STRIDE;
    rowNodes.forEach((node, i) => {
      const x = startX + i * (nodeW + NODE_GAP);
      placed.set(node.id, { node, x, y, w: nodeW, cx: x + nodeW / 2 });
    });
  }

  const H = PAD_TOP + maxLayer * ROW_STRIDE + NODE_H + PAD_BOTTOM;

  return (
    <div className={wrapClass}>
      <svg
        className="sysdiagram-svg"
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label="System architecture diagram"
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
          const a = placed.get(e.from);
          const b = placed.get(e.to);
          if (!a || !b) return null;
          const ax = a.cx;
          const ay = a.y + NODE_H;
          const bx = b.cx;
          const by = b.y - 6; // stop short so the arrowhead sits cleanly at the node edge
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

        {/* nodes */}
        {[...placed.values()].map(({ node, x, y, w }) => (
          <g key={node.id}>
            <rect
              x={x}
              y={y}
              rx={12}
              ry={12}
              width={w}
              height={NODE_H}
              fill="var(--diagram-node)"
              stroke="var(--diagram-node-border)"
              strokeWidth={1}
            />
            <foreignObject x={x} y={y} width={w} height={NODE_H}>
              <div className="sysdiagram-node-label">{node.label}</div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}
