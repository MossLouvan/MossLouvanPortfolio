"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENT_CAPTIONS } from "@/data/achievementCaptions";

export default function AchievementsGallery({
  images,
  lightboxOpen,
  activeIndex,
  onOpen,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  lightboxOpen: boolean;
  activeIndex: number;
  onOpen: (index: number) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  // keyboard nav (only when open)
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, onClose, onNext, onPrev]);

  if (images.length === 0) {
    return <p className="card-body">No images found. Add picture files to /public/achievements folder.</p>;
  }

  const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);

  return (
    <>
      <div className="gallery-grid">
        {images.map((src, i) => {
          const filename = decodeURIComponent(src.split("/").pop() || "");
          const caption = ACHIEVEMENT_CAPTIONS[filename] ?? "Achievement photo.";

          return (
            <motion.figure
              key={src}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              whileHover={{ scale: 1.05 }}
            >
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="gallery-btn"
                aria-label={`Open image: ${filename}`}
              >
                <img src={src} alt={caption} />
              </button>
              <figcaption>{filename}</figcaption>
            </motion.figure>
          );
        })}
      </div>

      <AnimatePresence>
        {lightboxOpen && images[safeIndex] && (() => {
          const src = images[safeIndex];
          const filename = decodeURIComponent(src.split("/").pop() || "");
          const caption = ACHIEVEMENT_CAPTIONS[filename] ?? "Achievement photo.";

          return (
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

                <img className="lightbox-img" src={src} alt={caption} />

                <div className="lightbox-caption">
                  <div className="lightbox-title">{filename}</div>
                  <div className="lightbox-text">{caption}</div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}