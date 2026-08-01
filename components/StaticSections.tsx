"use client";

import AnimatedCard from "@/components/AnimatedCard";

/** Education cards — copy-only, no state. */
export function EducationCards() {
  return (
    <div className="cards-grid">
      <AnimatedCard>
        <h3>Iowa State University</h3>
        <p className="card-subtitle">B.S. Software Engineering · Full-Ride Scholar</p>
        <p className="card-body">
          Pursuing Software Engineering with a focus on AI systems, large-scale tooling, and developer productivity.
        </p>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3>Virtual Campus High School</h3>
        <p className="card-subtitle">Valedictorian · Rank 1/143</p>
        <p className="card-body">
          Graduated as valedictorian while working as a contracted AI engineer and leading a national NASA project.
        </p>
      </AnimatedCard>
    </div>
  );
}

/** Leadership & outreach cards — copy-only, no state. */
export function LeadershipCards() {
  return (
    <div className="cards-grid">
      <AnimatedCard>
        <h3>Team Lead · NASA ADC Winners</h3>
        <p className="card-body">
          Led a small, focused team to a national win in a NASA competition with over a hundred participating teams.
        </p>
      </AnimatedCard>

      <AnimatedCard delay={0.08}>
        <h3>Speaker & Presenter</h3>
        <p className="card-body">
          Delivered talks for the Technology Association of Iowa and other organizations, translating complex systems
          into clear language.
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
  );
}
