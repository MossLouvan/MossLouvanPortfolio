"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TypewriterProps {
  text: string;
  highlights?: string[];
  speed?: number;
  initialDelay?: number;
  punctuationDelay?: number;
  onComplete?: () => void;
  className?: string;
}

const PUNCTUATION = new Set([".", ",", "!", "?", ";"]);
const BREATH_WORDS = new Set(["and", "I've"]);

export default function Typewriter({
  text,
  highlights = [],
  speed = 30,
  initialDelay = 800,
  punctuationDelay = 120,
  onComplete,
  className,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const skip = useCallback(() => {
    if (isComplete) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStarted(true);
    setCount(text.length);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [isComplete, text.length]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setStarted(true);
      setCount(text.length);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    let i = 0;

    function typeNext() {
      if (i >= text.length) {
        setIsComplete(true);
        onCompleteRef.current?.();
        return;
      }

      i++;
      setCount(i);

      let delay = speed;
      const ch = text[i - 1];

      if (PUNCTUATION.has(ch)) {
        delay += punctuationDelay;
      }

      if (ch === " " && i > 1) {
        for (const word of BREATH_WORDS) {
          if (text.slice(Math.max(0, i - word.length - 1), i - 1) === word) {
            delay += 60;
            break;
          }
        }
      }

      timerRef.current = setTimeout(typeNext, delay);
    }

    // Show loading dots during initial delay, then start typing
    timerRef.current = setTimeout(() => {
      setStarted(true);
      typeNext();
    }, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, initialDelay, punctuationDelay]);

  // Hide cursor 1.5s after completion
  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => setCursorVisible(false), 1500);
    return () => clearTimeout(t);
  }, [isComplete]);

  // Only render visible text, with highlights applied
  const visibleText = text.slice(0, count);
  const rendered = started ? buildHighlightedSpans(text, visibleText, highlights) : null;

  return (
    <h1 className={className} onClick={skip} style={{ cursor: isComplete ? "default" : "pointer" }}>
      {!started && (
        <span className="typewriter-dots" aria-hidden="true">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </span>
      )}
      {rendered}
      {started && cursorVisible && (
        <span className="typewriter-cursor" aria-hidden="true">|</span>
      )}
      <span className="sr-only">{text}</span>
    </h1>
  );
}

function buildHighlightedSpans(
  fullText: string,
  visibleText: string,
  highlights: string[]
): React.ReactNode[] {
  const visibleLen = visibleText.length;

  // Find highlight ranges within the visible portion
  const ranges: { start: number; end: number }[] = [];
  for (const phrase of highlights) {
    let searchFrom = 0;
    while (true) {
      const idx = fullText.indexOf(phrase, searchFrom);
      if (idx === -1) break;
      // Only include if the highlight is fully typed
      if (idx + phrase.length <= visibleLen) {
        ranges.push({ start: idx, end: idx + phrase.length });
      }
      searchFrom = idx + phrase.length;
    }
  }
  ranges.sort((a, b) => a.start - b.start);

  if (ranges.length === 0) {
    return [<span key="t">{visibleText}</span>];
  }

  const nodes: React.ReactNode[] = [];
  let pos = 0;
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    if (r.start > pos) {
      nodes.push(<span key={`p${i}`}>{visibleText.slice(pos, r.start)}</span>);
    }
    nodes.push(
      <span key={`h${i}`} className="typewriter-highlight">
        {visibleText.slice(r.start, r.end)}
      </span>
    );
    pos = r.end;
  }
  if (pos < visibleLen) {
    nodes.push(<span key="rest">{visibleText.slice(pos)}</span>);
  }

  return nodes;
}
