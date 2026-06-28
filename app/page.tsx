"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import ThemeToggle from "@/components/ThemeToggle";
import CollapsibleSection from "@/components/CollapsibleSection";
import SkillsGrid from "@/components/SkillsGrid";
import AnimatedCard from "@/components/AnimatedCard";
import AchievementsCarousel from "@/components/AchievementsCarousel";
import Typewriter from "@/components/Typewriter";
import ExperienceTimeline from "@/components/ExperienceTimeline";

import CommandPalette, { CommandItem } from "@/components/CommandPalette";
import CaseStudyDrawer from "@/components/CaseStudyDrawer";
import { CASE_STUDIES } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";
import { ALL_SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);
  const [heroTypingDone, setHeroTypingDone] = useState(false);

  // Achievements lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Case study drawer state
  const [csOpen, setCsOpen] = useState(false);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goNext = useCallback(
    () => setActiveIndex((i) => (images.length ? (i + 1) % images.length : 0)),
    [images.length]
  );

  const goPrev = useCallback(
    () => setActiveIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0)),
    [images.length]
  );

  const openCaseStudy = useCallback((slug: string) => {
    const found = CASE_STUDIES.find((s) => s.slug === slug) ?? null;
    setActiveStudy(found);
    setCsOpen(true);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setCsOpen(false);
  }, []);

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) return;
        const data = await res.json();
        setImages(data.images || []);
      } catch (e) {
        console.error("Failed to load achievement images:", e);
      }
    }
    loadImages();
  }, []);

  const COMMANDS: CommandItem[] = useMemo(() => {
    // Curated suggestions shown when the search box is empty
    const nav: CommandItem[] = [
      { id: "nav-about", group: "Navigation", label: "About", href: "#about", meta: "Section", suggested: true },
      { id: "nav-exp", group: "Navigation", label: "Experience", href: "#experience", meta: "Section", suggested: true },
      { id: "nav-edu", group: "Navigation", label: "Education", href: "#education", meta: "Section", suggested: true },
      { id: "nav-proj", group: "Navigation", label: "Projects", href: "#projects", meta: "Section", suggested: true },
      { id: "nav-ach", group: "Navigation", label: "Achievements", href: "#achievements", meta: "Section", suggested: true },
      { id: "nav-lead", group: "Navigation", label: "Leadership", href: "#leadership", meta: "Section", suggested: true },
      { id: "nav-skill", group: "Navigation", label: "Skills", href: "#skills", meta: "Section", suggested: true },
    ];

    const caseStudies: CommandItem[] = CASE_STUDIES.map((s) => ({
      id: `cs-${s.slug}`,
      group: "Case Studies",
      label: s.title,
      meta: "Case study",
      keywords: [s.subtitle ?? "", s.timeframe ?? "", s.slug],
      suggested: true,
      action: () => openCaseStudy(s.slug),
    }));

    const experience: CommandItem[] = [
      {
        id: "exp-nasa",
        group: "Experience",
        label: "Simulation Developer · NASA",
        href: "#experience",
        keywords: ["nasa", "app development challenge", "houston", "johnson space center", "lunar", "simulation"],
      },
      {
        id: "exp-principal",
        group: "Experience",
        label: "Contracted AI Software Engineer · Principal Financial Group",
        href: "#experience",
        keywords: ["principal", "rag", "aws bedrock", "titan", "dan houston", "pdf", "ai"],
      },
      {
        id: "exp-isu",
        group: "Experience",
        label: "Software Engineering LC Peer Mentor · Iowa State",
        href: "#experience",
        keywords: ["iowa state", "mentor", "learning community", "peer", "engineering"],
      },
      {
        id: "exp-deere",
        group: "Experience",
        label: "Software Engineer Intern · John Deere",
        href: "#experience",
        keywords: ["john deere", "langgraph", "a2a", "postgres", "vector", "pipelines", "moline"],
      },
    ];

    const education: CommandItem[] = [
      {
        id: "edu-isu",
        group: "Education",
        label: "B.S. Software Engineering · Iowa State University",
        href: "#education",
        keywords: ["full-ride", "scholar", "ai systems", "iowa state"],
      },
      {
        id: "edu-hs",
        group: "Education",
        label: "Valedictorian · Virtual Campus High School",
        href: "#education",
        keywords: ["valedictorian", "rank 1", "high school"],
      },
    ];

    const leadership: CommandItem[] = [
      {
        id: "lead-nasa",
        group: "Leadership",
        label: "Team Lead · NASA ADC Winners",
        href: "#leadership",
        keywords: ["team lead", "nasa", "national", "competition"],
      },
      {
        id: "lead-speaker",
        group: "Leadership",
        label: "Speaker & Presenter",
        href: "#leadership",
        keywords: ["technology association of iowa", "talks", "presenter", "speaking"],
      },
      {
        id: "lead-mentor",
        group: "Leadership",
        label: "Mentor & STEM Advocate",
        href: "#leadership",
        keywords: ["python", "stem", "washington dc", "panelist", "teaching", "mentor"],
      },
    ];

    const skills: CommandItem[] = ALL_SKILLS.map((s) => ({
      id: `skill-${s.slug}`,
      group: "Skills",
      label: s.name,
      href: "#skills",
      meta: "Skill",
      keywords: [s.slug],
    }));

    const links: CommandItem[] = [
      {
        id: "link-email",
        group: "Links",
        label: "Email Moss",
        href: "mailto:mosslouvan67@gmail.com",
        meta: "Contact",
        suggested: true,
        keywords: ["contact", "email"],
      },
      {
        id: "link-li",
        group: "Links",
        label: "Open LinkedIn",
        href: "https://www.linkedin.com/in/moss-louvan-4614682a4/",
        meta: "Profile",
        suggested: true,
        keywords: ["social", "linkedin"],
      },
      {
        id: "link-gh",
        group: "Links",
        label: "Open GitHub",
        href: "https://github.com/MossLouvan",
        meta: "Profile",
        suggested: true,
        keywords: ["github", "code", "repos"],
      },
    ];

    return [...nav, ...caseStudies, ...experience, ...education, ...skills, ...leadership, ...links];
  }, [openCaseStudy]);

  return (
    <>
      <div className="page-root">
        <aside className="sidebar">
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="profile-name">Moss Louvan</h1>
            <p className="profile-title">Software Engineer · Iowa State University</p>
          </motion.div>

          <motion.nav
            className="sidebar-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {["About", "Experience", "Projects", "Achievements", "Leadership", "Skills"].map((label, i) => (
              <motion.a
                key={label}
                href={`#${label.toLowerCase()}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                whileHover={{ opacity: 0.55 }}
              >
                {label}
              </motion.a>
            ))}
          </motion.nav>

          {/* RIGHT SIDE controls: search + theme toggle */}
          <div className="header-right">
            <CommandPalette commands={COMMANDS} />
            <ThemeToggle />
          </div>
        </aside>

        <main className="main">
          {/* Hero */}
          <motion.section
            id="about"
            className="hero-banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="hero-inner">
              <div className="hero-left">
                <motion.div
                  className="hero-avatar"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                  <img src="/profile/avatar.png" alt="Moss Louvan" />
                </motion.div>

                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0, y: 12 }}
                  animate={heroTypingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.5 }}
                >
                  Full-stack engineer specializing in AI systems, infrastructure, and developer tools. Based in Des
                  Moines, IA.
                </motion.p>
              </div>

              <div className="hero-copy">
                <Typewriter
                  text="Hey, I'm Moss! I'm a full-ride Software Engineering student at Iowa State University and a national winner of NASA's 2024 App Development Challenge. I've built AI systems for Fortune 500 companies and led a winning lunar exploration project."
                  highlights={[
                    "full-ride Software Engineering student",
                    "NASA's 2024 App Development Challenge",
                    "AI systems",
                    "Fortune 500"
                    
                  ]}
                  speed={30}
                  initialDelay={800}
                  onComplete={() => setHeroTypingDone(true)}
                  className="hero-title"
                />

                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, y: 16 }}
                  animate={heroTypingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.a
                    href="mailto:mosslouvan67@gmail.com"
                    className="btn primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Get in Touch
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/moss-louvan-4614682a4/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn ghost"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    LinkedIn
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Experience */}
          <CollapsibleSection title="Experience" defaultOpen id="experience">
            <ExperienceTimeline />
          </CollapsibleSection>

          {/* Education */}
          <CollapsibleSection title="Education" defaultOpen={false} id="education">
            <div className="cards-grid">
              <AnimatedCard>
                <h3>Iowa State University</h3>
                <p className="card-subtitle">B.S. Software Engineering · Full-Ride Scholar</p>
                <p className="card-body">
                  Pursuing Software Engineering with a focus on AI systems, large-scale tooling, and developer
                  productivity.
                </p>
              </AnimatedCard>

              <AnimatedCard delay={0.1}>
                <h3>Virtual Campus High School</h3>
                <p className="card-subtitle">Valedictorian · Rank 1/143</p>
                <p className="card-body">
                  Graduated as valedictorian while working as a contracted AI engineer and leading a national NASA
                  project.
                </p>
              </AnimatedCard>
            </div>
          </CollapsibleSection>

          {/* Projects */}
          <CollapsibleSection title="Projects" defaultOpen id="projects">
            <div className="cards-grid">
              {PROJECTS.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  delay={i * 0.08}
                  onViewCaseStudy={openCaseStudy}
                />
              ))}
            </div>
          </CollapsibleSection>

          {/* Achievements */}
          <CollapsibleSection title="Achievements & Awards" defaultOpen id="achievements">
            <AchievementsCarousel
              images={images}
              lightboxOpen={lightboxOpen}
              activeIndex={activeIndex}
              onOpen={openLightbox}
              onClose={closeLightbox}
              onNext={goNext}
              onPrev={goPrev}
            />
          </CollapsibleSection>

          {/* Leadership */}
          <CollapsibleSection title="Leadership & Outreach" defaultOpen={false} id="leadership">
            <div className="cards-grid">
              <AnimatedCard>
                <h3>Team Lead · NASA ADC Winners</h3>
                <p className="card-body">
                  Led a small, focused team to a national win in a NASA competition with over a hundred participating
                  teams.
                </p>
              </AnimatedCard>

              <AnimatedCard delay={0.08}>
                <h3>Speaker & Presenter</h3>
                <p className="card-body">
                  Delivered talks for the Technology Association of Iowa and other organizations, translating complex
                  systems into clear language.
                </p>
              </AnimatedCard>

              <AnimatedCard delay={0.16}>
                <h3>Mentor & STEM Advocate</h3>
                <p className="card-body">
                  Taught Python and problem-solving to elementary students and served as a panelist at a national STEM
                  conference in Washington, D.C.
                </p>
              </AnimatedCard>
            </div>
          </CollapsibleSection>

          {/* Skills */}
          <CollapsibleSection title="Technical Stack" defaultOpen={false} id="skills">
            <SkillsGrid />
          </CollapsibleSection>

          <footer className="footer">
            <p>© {new Date().getFullYear()} Moss Louvan. All rights reserved.</p>
            <p>
              Contact: <a href="mailto:mosslouvan67@gmail.com">mosslouvan67@gmail.com</a>
            </p>
          </footer>
        </main>
      </div>

      {/* Case Study Drawer */}
      <CaseStudyDrawer open={csOpen} onClose={closeCaseStudy} study={activeStudy} />
    </>
  );
}