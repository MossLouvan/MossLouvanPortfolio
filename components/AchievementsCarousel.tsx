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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  // The focused card is whichever card center is nearest the track's centre.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const recompute = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((c, i) => {
          if (!c) return;
          const cardCenter = c.offsetLeft + c.clientWidth / 2;
          const dist = Math.abs(cardCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", recompute, { passive: true });
    recompute();
    return () => {
      track.removeEventListener("scroll", recompute);
      cancelAnimationFrame(raf);
    };
  }, [images.length]);

  const scrollToIdx = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(i, images.length - 1));
      const track = trackRef.current;
      const card = cardRefs.current[idx];
      if (!track || !card) return;
      const target = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
      track.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
      setActive(idx);
    },
    [images.length, reduce]
  );

  // Center the first card once images are present (instant, no smooth scroll).
  useEffect(() => {
    const track = trackRef.current;
    const card = cardRefs.current[0];
    if (images.length > 0 && track && card) {
      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
        behavior: "auto",
      });
      setActive(0);
    }
  }, [images.length]);

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

  const safeLightboxIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);
  const lightboxCaption = captionFor(images[safeLightboxIndex] ?? images[0]);

  return (
    <>
      <div
        className="ach-carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label="Achievements"
      >
        <div
          className="ach-track"
          ref={trackRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollToIdx(active + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollToIdx(active - 1);
            }
          }}
        >
          {images.map((src, i) => {
            const caption = captionFor(src);
            const isActive = i === active;
            return (
              <figure
                key={src}
                data-idx={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`ach-card ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="ach-card-img"
                  onClick={() => (isActive ? onOpen(i) : scrollToIdx(i))}
                  aria-label={isActive ? `Open: ${caption}` : `Focus image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={caption} draggable={false} />
                </button>
                <figcaption className="ach-caption">{caption}</figcaption>
              </figure>
            );
          })}
        </div>

        <div className="ach-controls">
          <button
            className="ach-nav"
            onClick={() => scrollToIdx(active - 1)}
            disabled={active === 0}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="ach-dots" role="tablist">
            {images.map((_, i) => (
              <button
                key={i}
                className={`ach-dot ${i === active ? "active" : ""}`}
                onClick={() => scrollToIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-selected={i === active}
                role="tab"
              />
            ))}
          </div>
          <button
            className="ach-nav"
            onClick={() => scrollToIdx(active + 1)}
            disabled={active === images.length - 1}
            aria-label="Next"
          >
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
