"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SKILL_CATEGORIES, type Skill } from "@/data/skills";

function monogramText(name: string): string {
  if (name.length <= 4) return name.toUpperCase();
  const caps = name.replace(/[^A-Za-z0-9]/g, "").match(/[A-Z0-9]/g);
  if (caps && caps.length >= 2) return caps.slice(0, 2).join("");
  return name.slice(0, 2).toUpperCase();
}

function SkillTile({ skill, index, inView }: { skill: Skill; index: number; inView: boolean }) {
  return (
    <motion.div
      className="skill-tile"
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
    >
      <div className="skill-logo">
        {skill.monogram ? (
          <span className="skill-monogram">{skill.mono ?? monogramText(skill.name)}</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/logos/skills/${skill.slug}.svg`} alt={`${skill.name} logo`} loading="lazy" />
        )}
      </div>
      <span className="skill-name">{skill.name}</span>
      {skill.usedAt && (
        <span className="skill-used" role="tooltip">
          {skill.usedAt}
        </span>
      )}
    </motion.div>
  );
}

export default function SkillsGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div ref={ref} className="skills-grid">
      {SKILL_CATEGORIES.map((cat) => (
        <div
          key={cat.title}
          className={`skills-category${cat.featured ? " skills-category--core" : ""}`}
        >
          <h3 className="skills-title">{cat.title}</h3>
          <div className="skill-tiles">
            {cat.skills.map((skill, i) => (
              <SkillTile key={skill.slug} skill={skill} index={i} inView={inView} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
