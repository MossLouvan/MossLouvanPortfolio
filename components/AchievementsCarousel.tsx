"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ACHIEVEMENT_CAPTIONS } from "@/data/achievementCaptions";

type Props = {
  images: string[];
  lightboxOpen: boolean;
  activeIndex: number;
  onOpen: (index: number) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

function captionFor(src: string): string {
  const filename = decodeURIComponent(src.split("/").pop() || "");
  return ACHIEVEMENT_CAPTIONS[filename] ?? "Achievement photo.";
}

export default function AchievementsCarousel({
  images,
  lightboxOpen,
  activeIndex,
  onOpen,
  onClose,
  onNext,
  onPrev,
}: Props) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [cardW, setCardW] = useState(300);

  // Measure the actual rendered card width so the 3D offsets stay proportional.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const card = stage.querySelector(".ach-card-3d") as HTMLElement | null;
      if (card && card.offsetWidth) setCardW(card.offsetWidth);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    measure();
    return () => ro.disconnect();
  }, [images.length]);

  // wraps around so the deck loops infinitely in both directions
  const go = useCallback(
    (i: number) => setActive(((i % images.length) + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback(() => go(active - 1), [active, go]);

  // Lightbox keyboard nav
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, onClose, onNext, onPrev]);

  if (images.length === 0) {
    return (
      <p className="card-body">No images found. Add picture files to /public/achievements folder.</p>
    );
  }

  const step = cardW * 0.6;
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  const safeLightboxIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);
  const lightboxCaption = captionFor(images[safeLightboxIndex] ?? images[0]);
  const activeCaption = captionFor(images[active]);

  return (
    <>
      <div
        className="ach-coverflow"
        role="group"
        aria-roledescription="carousel"
        aria-label="Achievements"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          }
        }}
      >
        <div className="ach-stage" ref={stageRef}>
          {images.map((src, i) => {
            // circular offset → shortest path around the ring (enables looping)
            const n = images.length;
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const abs = Math.abs(offset);
            const hidden = abs > 2;
            const caption = captionFor(src);
            const isActive = offset === 0;
            return (
              <motion.div
                key={src}
                className="ach-card-3d"
                data-hidden={hidden ? "true" : "false"}
                initial={false}
                animate={{
                  x: offset * step,
                  rotateY: isActive ? 0 : -offset * 38,
                  z: -abs * 130,
                  scale: Math.max(0.6, 1 - abs * 0.14),
                  opacity: hidden ? 0 : 1 - abs * 0.22,
                  zIndex: 100 - abs,
                }}
                transition={transition}
              >
                <button
                  type="button"
                  className="ach-card-img"
                  onClick={() => (isActive ? onOpen(i) : go(i))}
                  aria-label={isActive ? `Open: ${caption}` : `Focus image ${i + 1}`}
                  tabIndex={hidden ? -1 : 0}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={caption} draggable={false} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* fixed-height wrapper so the controls below never shift between captions */}
        <div className="ach-coverflow-caption">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="ach-coverflow-caption-text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
            >
              {activeCaption}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="ach-controls">
          <button className="ach-nav" onClick={prev} aria-label="Previous">
            ‹
          </button>
          <div className="ach-dots" role="tablist">
            {images.map((_, i) => (
              <button
                key={i}
                className={`ach-dot ${i === active ? "active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-selected={i === active}
                role="tab"
              />
            ))}
          </div>
          <button className="ach-nav" onClick={next} aria-label="Next">
            ›
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && images[safeLightboxIndex] && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <motion.div
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
              <button className="lightbox-nav left" onClick={onPrev} aria-label="Previous image">
                ‹
              </button>
              <button className="lightbox-nav right" onClick={onNext} aria-label="Next image">
                ›
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lightbox-img" src={images[safeLightboxIndex]} alt={lightboxCaption} />
              <div className="lightbox-caption">
                <div className="lightbox-text">{lightboxCaption}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
