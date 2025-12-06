// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Load saved theme
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="page-root">
      {/* Navigation */}
      <header className="nav">
        <div className="nav-left">
          <span className="logo">ML</span>
          <span className="nav-name">Moss Louvan</span>
        </div>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#leadership">Leadership</a>
          <a href="#skills">Skills</a>
        </nav>
        <ThemeToggle />
      </header>

      {/* Hero section */}
      <main className="main">
        <motion.section
          id="about"
          className="section hero"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="hero-kicker">US Citizen • Software Engineering @ ISU</p>
          <h1 className="hero-title">
            Building systems at the intersection of{" "}
            <span className="highlight">AI</span>,{" "}
            <span className="highlight">infrastructure</span>, and{" "}
            <span className="highlight">space</span>.
          </h1>
          <p className="hero-subtitle">
            I&apos;m Moss, a full-ride Software Engineering student at Iowa State University and winner
            of NASA&apos;s 2024 App Development Challenge. I&apos;ve shipped AI systems for enterprises and
            led a national-winning lunar exploration project before graduating high school.
          </p>
          <div className="hero-actions">
            <a
              href="mailto:mosslouvan67@gmail.com"
              className="btn primary"
            >
              Contact Me
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="btn ghost"
            >
              View LinkedIn
            </a>
          </div>
          <div className="hero-meta">
            <span>Des Moines, IA → Moline, IL → Houston, TX</span>
            <span>AI · LLMs · Systems · Developer Tools</span>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          id="experience"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="section-title">Experience</h2>
          <div className="cards-grid">
            <article className="card">
              <header className="card-header">
                <h3>Contracted AI Software Engineer</h3>
                <p className="card-subtitle">Principal Financial Group · Des Moines, IA · Jun 2024 – Aug 2024</p>
              </header>
              <ul className="card-list">
                <li>
                  Selected as the first high school engineer to join Principal&apos;s software teams, working directly
                  with senior developers and leadership.
                </li>
                <li>
                  Built a full-stack AI PDF processing platform using AWS Bedrock (Titan Text v2) that replaced a
                  third-party vendor and substantially reduced recurring licensing costs.
                </li>
                <li>
                  Implemented Retrieval-Augmented Generation with transparent chunk highlighting so business users
                  could trace every AI answer back to source documents.
                </li>
                <li>
                  Demoed the system to senior engineers, executives, and CEO Dan Houston, translating technical
                  decisions into business impact.
                </li>
              </ul>
            </article>

            <article className="card">
              <header className="card-header">
                <h3>Software Engineering Intern (Incoming 2026)</h3>
                <p className="card-subtitle">John Deere Headquarters · Moline, IL · May 2026 – Jul 2026</p>
              </header>
              <ul className="card-list">
                <li>
                  Joining John Deere&apos;s headquarters to build production-grade AI pipelines that support real-world,
                  large-scale industrial systems.
                </li>
                <li>
                  Contributing to modernizing internal AI infrastructure by migrating LangGraph-based workflows onto
                  Google&apos;s A2A framework to simplify architecture and increase reliability.
                </li>
                <li>
                  Designing high-speed retrieval paths using Postgres and vector search to unlock enterprise knowledge
                  for engineers and business stakeholders.
                </li>
              </ul>
            </article>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="section-title">Education</h2>
          <div className="cards-grid">
            <article className="card">
              <header className="card-header">
                <h3>Iowa State University</h3>
                <p className="card-subtitle">B.S. Software Engineering · Full-Ride Scholar · Ames, IA</p>
              </header>
              <p className="card-body">
                Pursuing Software Engineering with a focus on AI systems, large-scale tooling, and developer productivity.
                Combining research, internships, and outreach to bridge cutting-edge technology with real communities.
              </p>
            </article>

            <article className="card">
              <header className="card-header">
                <h3>Virtual Campus High School</h3>
                <p className="card-subtitle">Valedictorian · Rank 1/143</p>
              </header>
              <p className="card-body">
                Graduated as valedictorian while working as a contracted AI engineer and leading a national NASA project.
                Built a foundation in programming, physics, and math that now fuels university-level work.
              </p>
              <p className="card-body small">
                Additional training through Pi515 John Deere mentorship in Python, data analytics (NumPy, Pandas,
                scikit-learn), interview preparation, and professional readiness.
              </p>
            </article>
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          id="projects"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="section-title">Highlighted Project</h2>
          <article className="card project-card">
            <header className="card-header">
              <h3>NASA South Pole Lunar Exploration App</h3>
              <p className="card-subtitle">
                Lead Coder & Game Developer · NASA App Development Challenge · Oct 2023 – Apr 2024
              </p>
            </header>
            <p className="card-body">
              Led development of an AI-assisted lunar rover simulator built on real geospatial data of the Moon&apos;s
              south pole to support Artemis mission training. Integrated realistic rover behavior, terrain interaction,
              and mission objectives into an immersive experience.
            </p>
            <ul className="card-list">
              <li>
                Won the national 2024 NASA App Development Challenge and presented the project to NASA officials and
                engineers.
              </li>
              <li>
                Reached a global audience through interviews, podcasts, and news coverage, with viewers as far as
                South Korea engaging with the project and its story.
              </li>
              <li>
                Recognized by Iowa state leadership and invited to the Capitol as a student advocate for STEM
                education and accessibility.
              </li>
            </ul>
          </article>
        </motion.section>

        {/* Leadership & Outreach */}
        <motion.section
          id="leadership"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="section-title">Leadership & Outreach</h2>
          <div className="cards-grid">
            <article className="card">
              <header className="card-header">
                <h3>Team Lead · NASA ADC Winners</h3>
              </header>
              <p className="card-body">
                Led a small, focused team to a national win in a NASA competition with over a hundred participating
                teams from across the country. Balanced technical direction, scope decisions, and team morale under
                tight deadlines.
              </p>
            </article>

            <article className="card">
              <header className="card-header">
                <h3>Speaker & Presenter</h3>
              </header>
              <p className="card-body">
                Delivered talks for the Technology Association of Iowa and other organizations, presenting project work
                directly to executives, engineers, and community leaders. Learned how to translate complex systems into
                clear, human language.
              </p>
            </article>

            <article className="card">
              <header className="card-header">
                <h3>Mentor & STEM Advocate</h3>
              </header>
              <p className="card-body">
                Taught Python and problem-solving fundamentals to dozens of elementary students, making code feel less
                intimidating and more like a creative tool. Served as a panelist at a national STEM conference in
                Washington, D.C., sharing the student perspective with software engineers and CS faculty.
              </p>
            </article>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          id="skills"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="section-title">Technical Stack</h2>
          <div className="skills-grid">
            <div>
              <h3 className="skills-title">Languages & Core</h3>
              <div className="chips">
                <span className="chip">Python</span>
                <span className="chip">Java</span>
                <span className="chip">C / C++</span>
                <span className="chip">C#</span>
                <span className="chip">SQL</span>
              </div>
            </div>
            <div>
              <h3 className="skills-title">AI & Tooling</h3>
              <div className="chips">
                <span className="chip">LangChain</span>
                <span className="chip">LangGraph</span>
                <span className="chip">A2A</span>
                <span className="chip">AWS Bedrock</span>
              </div>
            </div>
            <div>
              <h3 className="skills-title">Infrastructure</h3>
              <div className="chips">
                <span className="chip">Postgres</span>
                <span className="chip">Docker</span>
                <span className="chip">Kubernetes</span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Moss Louvan. All rights reserved.</p>
        <p>
          Contact:{" "}
          <a href="mailto:mosslouvan67@gmail.com">mosslouvan67@gmail.com</a> ·{" "}
          <a href="tel:+15158039201">(515) 803-9201</a>
        </p>
      </footer>
    </div>
  );
}
