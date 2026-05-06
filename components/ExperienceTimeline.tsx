"use client";

import { motion } from "framer-motion";

type TimelineEntry = {
  date: string;
  logo: string;
  logoAlt: string;
  title: string;
  org: string;
  meta?: string;
  bullets: string[];
};

const ENTRIES: TimelineEntry[] = [
  {
    date: "Oct 2023 – Aug 2024",
    logo: "/logos/nasa.png",
    logoAlt: "NASA logo",
    title: "Simulation Developer",
    org: "NASA · App Development Challenge Winner",
    meta: "Houston, TX · Seasonal",
    bullets: [
      "Built an application simulating a lunar south pole mission using real NASA data",
      "Won the NASA App Development Challenge and presented at Johnson Space Center",
    ],
  },
  {
    date: "Jul 2024 – Aug 2024",
    logo: "/logos/principal.png",
    logoAlt: "Principal Financial Group logo",
    title: "Contracted AI Software Engineer",
    org: "Principal Financial Group · Contract",
    meta: "Des Moines, IA · Hybrid",
    bullets: [
      "Selected as the first high school engineer to join Principal's software teams",
      "Built a full-stack AI PDF processing platform using AWS Bedrock (Titan Text v2)",
      "Implemented RAG with transparent chunk highlighting for traceability",
      "Demoed to senior engineers, executives, and CEO Dan Houston",
    ],
  },
  {
    date: "Apr 2026 – Present",
    logo: "/logos/iowa-state.png",
    logoAlt: "Iowa State University logo",
    title: "Software Engineering LC Peer Mentor",
    org: "Iowa State University · College of Engineering · Part-time",
    meta: "Ames, IA",
    bullets: [
      "Mentor first-year software engineering students through their Learning Community",
      "Lead sessions on engineering fundamentals, study habits, and college life",
    ],
  },
  {
    date: "May 2026 – Present",
    logo: "/logos/john-deere.png",
    logoAlt: "John Deere logo",
    title: "Software Engineer (Intern)",
    org: "John Deere · Internship",
    meta: "Moline, IL · On-site",
    bullets: [
      "Building production-grade AI pipelines for large-scale industrial systems",
      "Migrating LangGraph workflows onto Google's A2A framework",
      "Designing high-speed retrieval paths with Postgres and vector search",
    ],
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="timeline">
      <motion.div
        className="timeline-line"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden
      />

      {ENTRIES.map((entry, i) => (
        <motion.div
          key={entry.title}
          className="timeline-entry"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.5,
            delay: 0.25 + i * 0.15,
            ease: "easeOut",
          }}
        >
          <motion.span
            className="timeline-dot"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.4,
              delay: 0.4 + i * 0.15,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            aria-hidden
          />

          <p className="timeline-date">{entry.date}</p>

          <div className="timeline-card-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.logo}
              alt={entry.logoAlt}
              className="timeline-logo"
            />
            <div className="timeline-card-heading">
              <h3>{entry.title}</h3>
              <p className="card-subtitle">{entry.org}</p>
              {entry.meta && <p className="timeline-meta">{entry.meta}</p>}
            </div>
          </div>

          <ul className="card-list">
            {entry.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
