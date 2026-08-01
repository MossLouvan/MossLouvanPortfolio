"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Image from "next/image";

import Typewriter from "@/components/Typewriter";

const INTRO =
  "Hey, I'm Moss! I'm a full-ride Software Engineering student at Iowa State University and a national winner of NASA's 2024 App Development Challenge. I've built AI systems for Fortune 500 companies and led a winning lunar exploration project.";

const HIGHLIGHTS = [
  "full-ride Software Engineering student",
  "NASA's 2024 App Development Challenge",
  "AI systems",
  "Fortune 500",
];

export default function HeroSection() {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <m.section
      id="about"
      className="hero-banner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="hero-inner">
        <div className="hero-left">
          <m.div
            className="hero-avatar"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <Image
              src="/profile/avatar.webp"
              alt="Moss Louvan"
              width={840}
              height={1260}
              // No `sizes`: with images.unoptimized Next emits no srcset, so
              // there are no candidates to choose between. Kept as next/image
              // for the `priority` LCP preload it still emits.
              priority
            />
          </m.div>

          <m.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5 }}
          >
            Full-stack engineer specializing in AI systems, infrastructure, and developer tools. Based in Des
            Moines, IA.
          </m.p>
        </div>

        <div className="hero-copy">
          <Typewriter
            text={INTRO}
            highlights={HIGHLIGHTS}
            speed={30}
            initialDelay={800}
            onComplete={() => setTypingDone(true)}
            className="hero-title"
          />

          <m.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
          >
            <m.a
              href="mailto:mosslouvan67@gmail.com"
              className="btn primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </m.a>
            <m.a
              href="https://www.linkedin.com/in/moss-louvan-4614682a4/"
              target="_blank"
              rel="noreferrer"
              className="btn ghost"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              LinkedIn
            </m.a>
          </m.div>
        </div>
      </div>
    </m.section>
  );
}
