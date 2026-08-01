"use client";

import { useCallback, useMemo, useState } from "react";

import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import CollapsibleSection from "@/components/CollapsibleSection";
import SkillsGrid from "@/components/SkillsGrid";
import AchievementsCarousel from "@/components/AchievementsCarousel";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import CaseStudyDrawer from "@/components/CaseStudyDrawer";
import ProjectCard from "@/components/ProjectCard";
import { EducationCards, LeadershipCards } from "@/components/StaticSections";

import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";
import { PROJECTS } from "@/data/projects";
import { ACHIEVEMENT_IMAGES } from "@/data/achievements";
import { buildCommands } from "@/data/commands";

export default function HomePage() {
  // Achievements lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Case study drawer state
  const [csOpen, setCsOpen] = useState(false);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % ACHIEVEMENT_IMAGES.length), []);

  const goPrev = useCallback(
    () => setActiveIndex((i) => (i - 1 + ACHIEVEMENT_IMAGES.length) % ACHIEVEMENT_IMAGES.length),
    []
  );

  const openCaseStudy = useCallback((slug: string) => {
    setActiveStudy(CASE_STUDIES.find((s) => s.slug === slug) ?? null);
    setCsOpen(true);
  }, []);

  const closeCaseStudy = useCallback(() => setCsOpen(false), []);

  const commands = useMemo(() => buildCommands(openCaseStudy), [openCaseStudy]);

  return (
    <>
      <div className="page-root">
        <Sidebar commands={commands} />

        <main className="main">
          <HeroSection />

          <CollapsibleSection title="Experience" defaultOpen id="experience">
            <ExperienceTimeline />
          </CollapsibleSection>

          <CollapsibleSection title="Education" defaultOpen={false} id="education">
            <EducationCards />
          </CollapsibleSection>

          <CollapsibleSection title="Projects" defaultOpen id="projects">
            <div className="cards-grid">
              {PROJECTS.map((p, i) => (
                <ProjectCard key={p.slug} project={p} delay={i * 0.08} onViewCaseStudy={openCaseStudy} />
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Achievements & Awards" defaultOpen id="achievements">
            <AchievementsCarousel
              images={ACHIEVEMENT_IMAGES}
              lightboxOpen={lightboxOpen}
              activeIndex={activeIndex}
              onOpen={openLightbox}
              onClose={closeLightbox}
              onNext={goNext}
              onPrev={goPrev}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Leadership & Outreach" defaultOpen={false} id="leadership">
            <LeadershipCards />
          </CollapsibleSection>

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

      <CaseStudyDrawer open={csOpen} onClose={closeCaseStudy} study={activeStudy} />
    </>
  );
}
