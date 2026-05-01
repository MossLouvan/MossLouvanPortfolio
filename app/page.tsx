"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import ThemeToggle from "@/components/ThemeToggle";
import CollapsibleSection from "@/components/CollapsibleSection";
import ChipGroup from "@/components/ChipGroup";
import AnimatedCard from "@/components/AnimatedCard";
import AchievementsGallery from "@/components/AchievementsGallery";
import Typewriter from "@/components/Typewriter";

import CommandPalette, { CommandItem } from "@/components/CommandPalette";
import CaseStudyDrawer from "@/components/CaseStudyDrawer";
import { CASE_STUDIES } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";

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

  // helper for buttons
  const viewCaseStudy = useCallback(
    (slug: string) => () => openCaseStudy(slug),
    [openCaseStudy]
  );

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
    const nav: CommandItem[] = [
      { id: "nav-about", group: "Navigation", label: "Go to About", href: "#about" },
      { id: "nav-exp", group: "Navigation", label: "Go to Experience", href: "#experience" },
      { id: "nav-edu", group: "Navigation", label: "Go to Education", href: "#education" },
      { id: "nav-proj", group: "Navigation", label: "Go to Projects", href: "#projects" },
      { id: "nav-ach", group: "Navigation", label: "Go to Achievements", href: "#achievements" },
      { id: "nav-lead", group: "Navigation", label: "Go to Leadership", href: "#leadership" },
      { id: "nav-skill", group: "Navigation", label: "Go to Skills", href: "#skills" },
    ];

    const links: CommandItem[] = [
      {
        id: "link-email",
        group: "Links",
        label: "Email Moss",
        href: "mailto:mosslouvan67@gmail.com",
        keywords: ["contact"],
      },
      {
        id: "link-li",
        group: "Links",
        label: "Open LinkedIn",
        href: "https://www.linkedin.com/in/moss-louvan-4614682a4/",
        keywords: ["social", "linkedin"],
      },
    ];

    const caseStudies: CommandItem[] = CASE_STUDIES.map((s) => ({
      id: `cs-${s.slug}`,
      group: "Case Studies",
      label: `Open: ${s.title}`,
      keywords: [s.subtitle ?? "", s.timeframe ?? "", s.slug],
      action: () => openCaseStudy(s.slug),
    }));

    return [...nav, ...links, ...caseStudies];
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
          <div className="header-right" style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
            <div className="cards-grid">
              <AnimatedCard>
                <h3>Contracted AI Software Engineer</h3>
                <p className="card-subtitle">Principal Financial Group · Jun 2024 – Aug 2024</p>
                <ul className="card-list">
                  <li>Selected as the first high school engineer to join Principal&apos;s software teams</li>
                  <li>Built a full-stack AI PDF processing platform using AWS Bedrock (Titan Text v2)</li>
                  <li>Implemented RAG with transparent chunk highlighting for traceability</li>
                  <li>Demoed to senior engineers, executives, and CEO Dan Houston</li>
                </ul>
              </AnimatedCard>

              <AnimatedCard delay={0.1}>
                <h3>Software Engineering Intern (Incoming 2026)</h3>
                <p className="card-subtitle">John Deere Headquarters · May 2026 – Jul 2026</p>
                <ul className="card-list">
                  <li>Building production-grade AI pipelines for large-scale industrial systems</li>
                  <li>Migrating LangGraph workflows onto Google&apos;s A2A framework</li>
                  <li>Designing high-speed retrieval paths with Postgres and vector search</li>
                </ul>
              </AnimatedCard>
            </div>
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
              <AnimatedCard>
                <h3>AI PDF Processing Platform</h3>
                <p className="card-subtitle">
                  Contracted AI Software Engineer · Principal Financial Group · Jun 2024 – Aug 2024
                </p>

                <p className="card-body">
                  Built an end-to-end AI platform to ingest PDFs, chunk + embed content, and power traceable RAG with
                  evidence highlighting.
                </p>

                <ul className="card-list">
                  <li>RAG pipeline with transparent chunk highlighting</li>
                  <li>AWS Bedrock (Titan Text + Embeddings) + vector storage</li>
                  <li>Shipped for stakeholders and demoed to leadership</li>
                </ul>

                <div style={{ marginTop: 14 }}>
                  
                  <button className="btn ghost" onClick={viewCaseStudy("principal-ai-pdf")}>
                    View case study →
                  </button>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.1}>
                <h3>NASA South Pole Lunar Exploration App</h3>
                <p className="card-subtitle">Lead Coder & Game Developer · Oct 2023 – Apr 2024</p>

                <p className="card-body">
                  Led development of an AI-assisted lunar rover simulator using real lunar south pole terrain
                  constraints and mission-oriented exploration workflows.
                </p>

                <ul className="card-list">
                  <li>National winner — NASA App Development Challenge</li>
                  <li>Interactive exploration / simulation experience</li>
                  <li>Designed for storytelling + demo mode stability</li>
                </ul>

                <div style={{ marginTop: 14 }}>
                  
                  <button className="btn ghost" onClick={viewCaseStudy("nasa-adc")}>
                    View case study →
                  </button>
                </div>
              </AnimatedCard>
            </div>
          </CollapsibleSection>

          {/* Achievements */}
          <CollapsibleSection title="Achievements & Awards" defaultOpen id="achievements">
            <AchievementsGallery
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
            <div className="skills-grid">
              <div className="skills-category">
                <h3 className="skills-title">Languages & Core</h3>
                <ChipGroup chips={["Python", "Java", "C / C++", "C#", "SQL", "TypeScript"]} />
              </div>

              <div className="skills-category">
                <h3 className="skills-title">AI & Tooling</h3>
                <ChipGroup chips={["LangChain", "LangGraph", "A2A", "AWS Bedrock", "OpenAI"]} />
              </div>

              <div className="skills-category">
                <h3 className="skills-title">Infrastructure & Web</h3>
                <ChipGroup chips={["Postgres", "Docker", "Kubernetes", "Next.js", "React"]} />
              </div>
            </div>
          </CollapsibleSection>

          <footer className="footer">
            <p>© {new Date().getFullYear()} Moss Louvan. All rights reserved.</p>
            <p>
              Contact: <a href="mailto:mosslouvan67@gmail.com">mosslouvan67@gmail.com</a> ·{" "}
              <a href="tel:+15158039201">(515) 803-9201</a>
            </p>
          </footer>
        </main>
      </div>

      {/* Case Study Drawer */}
      <CaseStudyDrawer open={csOpen} onClose={closeCaseStudy} study={activeStudy} />
    </>
  );
}