"use client";

import { motion } from "framer-motion";
import { CASE_STUDIES } from "@/data/caseStudies";
import type { Project } from "@/data/projects";
import LinkIcon from "@/components/LinkIcon";

export default function ProjectCard({
  project,
  delay = 0,
  onViewCaseStudy,
}: {
  project: Project;
  delay?: number;
  onViewCaseStudy: (slug: string) => void;
}) {
  const caseStudy = CASE_STUDIES.find((s) => s.slug === project.slug);

  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {caseStudy?.flow && (
        // Architecture-first: a plain-language "how it works" flow is the card's
        // cover. Clicking opens the drawer (full diagram + components).
        <button
          type="button"
          className="project-arch"
          onClick={() => onViewCaseStudy(project.slug)}
          aria-label={`View ${project.title} case study`}
        >
          <span className="project-arch-label">How it works</span>
          <ol className="project-flow">
            {caseStudy.flow.map((step, i) => (
              <li key={i} className="project-flow-step">
                <span className="project-flow-num">{i + 1}</span>
                <span className="project-flow-text">{step}</span>
              </li>
            ))}
          </ol>
        </button>
      )}

      <div className="project-tags">
        {project.tags.map((t) => (
          <span key={t} className="project-tag">
            {t}
          </span>
        ))}
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-meta">
        {project.role} · {project.timeframe}
      </p>
      <p className="project-blurb">{project.blurb}</p>

      <ul className="project-bullets">
        {project.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="project-actions">
        {caseStudy && (
          <button type="button" className="project-cta" onClick={() => onViewCaseStudy(project.slug)}>
            Case study
          </button>
        )}
        {project.links.map((l) => (
          <a
            key={l.href}
            className="project-link"
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
          >
            <LinkIcon href={l.href} />
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </motion.article>
  );
}
