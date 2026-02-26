"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type PanZoomCanvasProps = {
  children: React.ReactNode;
  className?: string;

  minScale?: number;
  maxScale?: number;
  showGrid?: boolean;
  height?: number | string;

  contentWidth?: number;
  contentHeight?: number;

  /** Padding from viewport edges when centering (px) */
  centerPadding?: number;

  /** When true, re-center when content dims change */
  recenterOnChange?: boolean;

  onTransformChange?: (t: { scale: number; x: number; y: number }) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PanZoomCanvas({
  children,
  className,
  minScale = 0.4,
  maxScale = 2.8,
  showGrid = true,
  height = 420,
  contentWidth,
  contentHeight,
  centerPadding = 24,
  recenterOnChange = true,
  onTransformChange,
}: PanZoomCanvasProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const emit = (nextScale: number, nextPos: { x: number; y: number }) => {
    onTransformChange?.({ scale: nextScale, x: nextPos.x, y: nextPos.y });
  };

  /** Reset to TRUE 100% (scale=1) and center the content */
  const resetTo100Centered = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const vw = rect.width;
    const vh = rect.height;

    const s = 1;

    if (!contentWidth || !contentHeight) {
      const nextPos = { x: centerPadding, y: centerPadding };
      setScale(s);
      setPos(nextPos);
      emit(s, nextPos);
      return;
    }

    const contentPixelW = contentWidth * s;
    const contentPixelH = contentHeight * s;

    // Center it. If content is larger than viewport, x/y will be negative (that's fine — you can pan)
    let x = (vw - contentPixelW) / 2;
    let y = (vh - contentPixelH) / 2;

    // Optional: if it's smaller, don't let it sit too close to edges
    if (contentPixelW <= vw) x = Math.max(centerPadding, x);
    if (contentPixelH <= vh) y = Math.max(centerPadding, y);

    const nextPos = { x, y };

    setScale(s);
    setPos(nextPos);
    emit(s, nextPos);
  };

  useLayoutEffect(() => {
    resetTo100Centered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!recenterOnChange) return;
    resetTo100Centered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentWidth, contentHeight]);

  const onPointerDown = (e: React.PointerEvent) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const target = e.target as HTMLElement;
    if (target.closest("[data-pan-ignore='true']")) return;

    draggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
    viewport.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;

    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };

    setPos((p) => {
      const next = { x: p.x + dx, y: p.y + dy };
      emit(scale, next);
      return next;
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    draggingRef.current = false;
    try {
      viewport.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    e.preventDefault();

    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // world coords before zoom
    const worldX = (mouseX - pos.x) / scale;
    const worldY = (mouseY - pos.y) / scale;

    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? 1.08 : 1 / 1.08;

    const nextScale = clamp(scale * zoomFactor, minScale, maxScale);

    const nextX = mouseX - worldX * nextScale;
    const nextY = mouseY - worldY * nextScale;

    setScale(nextScale);
    setPos({ x: nextX, y: nextY });
    emit(nextScale, { x: nextX, y: nextY });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        resetTo100Centered();
      }
      if (e.key === "Escape") draggingRef.current = false;
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentWidth, contentHeight]);

  const displayPct = Math.round(scale * 100);

  return (
    <div
      ref={viewportRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onDoubleClick={resetTo100Centered}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        touchAction: "none",
        cursor: draggingRef.current ? "grabbing" : "grab",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {showGrid && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.45,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      >
        {children}
      </div>

      {/* HUD */}
      <div
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "6px 8px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.35)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 12,
          backdropFilter: "blur(8px)",
        }}
        data-pan-ignore="true"
      >
        <span>{displayPct}%</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            resetTo100Centered();
          }}
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.9)",
            borderRadius: 10,
            padding: "4px 8px",
            cursor: "pointer",
          }}
          data-pan-ignore="true"
        >
          Reset
        </button>
      </div>
    </div>
  );
}