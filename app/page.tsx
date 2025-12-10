"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  if (!mounted) return null;

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

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  id,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      id={id}
      className="collapsible-section"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h2 className="section-title">{title}</h2>
        <span className={`section-toggle ${open ? "open" : ""}`}>▼</span>
      </div>
      {open && <div className={`section-content ${open ? "open" : ""}`}>{children}</div>}
    </motion.div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  // gallery state: images read from public/achievements via API
  const [images, setImages] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function loadImages() {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) {
          console.error("Failed to fetch achievements:", res.statusText);
          return;
        }
        const data = await res.json();
        setImages(data.images || []);
      } catch (e) {
        console.error("Failed to load achievement images:", e);
      }
    }

    loadImages();
  }, []);

  return (
    <div className="page-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {mounted && (
            <div
              className="profile-avatar"
              style={{
                background: `url(/profile/avatar.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <h1 className="profile-name">Moss Louvan</h1>
          <p className="profile-title">Software Engineer • Iowa State University</p>
        </motion.div>

        <motion.nav
          className="sidebar-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#achievements">Achievements</a>
          <a href="#leadership">Leadership</a>
          <a href="#skills">Skills</a>
        </motion.nav>

        <ThemeToggle />
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Hero Banner */}
        <motion.section
          id="about"
          className="hero-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            I&apos;m Moss, a full-ride Software Engineering student at Iowa State University and winner of NASA&apos;s 2024 App Development Challenge. I&apos;ve shipped AI systems for enterprises and led a national-winning lunar exploration project.
          </h1>
          <p className="hero-subtitle">
            Full-stack engineer specializing in AI systems, infrastructure, and developer tools. Based in Des Moines, IA.
          </p>
          <div className="hero-actions">
            <a href="mailto:mosslouvan67@gmail.com" className="btn primary">
              Get in Touch
            </a>
            <a href="https://www.linkedin.com/in/moss-louvan-4614682a4/" target="_blank" rel="noreferrer" className="btn ghost">
              LinkedIn
            </a>
          </div>
        </motion.section>

        {/* Experience */}
        <CollapsibleSection title="Experience" defaultOpen={true}>
          <div className="cards-grid" id="experience">
            <div className="card">
              <h3>Contracted AI Software Engineer</h3>
              <p className="card-subtitle">Principal Financial Group · Jun 2024 – Aug 2024</p>
              <ul className="card-list">
                <li>Selected as the first high school engineer to join Principal&apos;s software teams</li>
                <li>Built a full-stack AI PDF processing platform using AWS Bedrock (Titan Text v2)</li>
                <li>Implemented RAG with transparent chunk highlighting for traceability</li>
                <li>Demoed to senior engineers, executives, and CEO Dan Houston</li>
              </ul>
            </div>

            <div className="card">
              <h3>Software Engineering Intern (Incoming 2026)</h3>
              <p className="card-subtitle">John Deere Headquarters · May 2026 – Jul 2026</p>
              <ul className="card-list">
                <li>Building production-grade AI pipelines for large-scale industrial systems</li>
                <li>Migrating LangGraph workflows onto Google&apos;s A2A framework</li>
                <li>Designing high-speed retrieval paths with Postgres and vector search</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Education */}
        <CollapsibleSection title="Education" defaultOpen={false}>
          <div className="cards-grid" id="about">
            <div className="card">
              <h3>Iowa State University</h3>
              <p className="card-subtitle">B.S. Software Engineering · Full-Ride Scholar</p>
              <p className="card-body">
                Pursuing Software Engineering with a focus on AI systems, large-scale tooling, and developer productivity.
              </p>
            </div>

            <div className="card">
              <h3>Virtual Campus High School</h3>
              <p className="card-subtitle">Valedictorian · Rank 1/143</p>
              <p className="card-body">
                Graduated as valedictorian while working as a contracted AI engineer and leading a national NASA project.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Projects */}
        <CollapsibleSection title="Projects" defaultOpen={true}>
          <div className="cards-grid" id="projects">
            <div className="card">
              <h3>NASA South Pole Lunar Exploration App</h3>
              <p className="card-subtitle">Lead Coder & Game Developer · Oct 2023 – Apr 2024</p>
              <p className="card-body">
                Led development of an AI-assisted lunar rover simulator built on real geospatial data of the Moon&apos;s south
                pole to support Artemis mission training.
              </p>
              <ul className="card-list">
                <li>Won the national 2024 NASA App Development Challenge</li>
                <li>Reached global audience through interviews and podcasts</li>
                <li>Recognized by Iowa state leadership as a STEM advocate</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Achievements Gallery */}
        <CollapsibleSection title="Achievements & Awards" defaultOpen={true}>
          {images.length === 0 ? (
            <p className="card-body">No images found. Add picture files to /public/achievements folder.</p>
          ) : (
            <div className="gallery-grid" id="achievements">
              {images.map((src) => (
                <motion.figure
                  key={src}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={src} alt={src.split("/").pop()} />
                  <figcaption>{src.split("/").pop()}</figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* Leadership & Outreach */}
        <CollapsibleSection title="Leadership & Outreach" defaultOpen={false} id="leadership">
          <div className="cards-grid">
            <div className="card">
              <h3>Team Lead · NASA ADC Winners</h3>
              <p className="card-body">
                Led a small, focused team to a national win in a NASA competition with over a hundred participating teams.
              </p>
            </div>

            <div className="card">
              <h3>Speaker & Presenter</h3>
              <p className="card-body">
                Delivered talks for the Technology Association of Iowa and other organizations, translating complex systems
                into clear language.
              </p>
            </div>

            <div className="card">
              <h3>Mentor & STEM Advocate</h3>
              <p className="card-body">
                Taught Python and problem-solving to elementary students and served as a panelist at a national STEM
                conference in Washington, D.C.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Skills */}
        <CollapsibleSection title="Technical Stack" defaultOpen={false} id="skills">
          <div className="skills-grid">
            <div className="skills-category">
              <h3 className="skills-title">Languages & Core</h3>
              <div className="chips">
                <span className="chip">Python</span>
                <span className="chip">Java</span>
                <span className="chip">C / C++</span>
                <span className="chip">C#</span>
                <span className="chip">SQL</span>
                <span className="chip">TypeScript</span>
              </div>
            </div>

            <div className="skills-category">
              <h3 className="skills-title">AI & Tooling</h3>
              <div className="chips">
                <span className="chip">LangChain</span>
                <span className="chip">LangGraph</span>
                <span className="chip">A2A</span>
                <span className="chip">AWS Bedrock</span>
                <span className="chip">OpenAI</span>
              </div>
            </div>

            <div className="skills-category">
              <h3 className="skills-title">Infrastructure & Web</h3>
              <div className="chips">
                <span className="chip">Postgres</span>
                <span className="chip">Docker</span>
                <span className="chip">Kubernetes</span>
                <span className="chip">Next.js</span>
                <span className="chip">React</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Moss Louvan. All rights reserved.</p>
          <p>
            Contact:{" "}
            <a href="mailto:mosslouvan67@gmail.com">mosslouvan67@gmail.com</a> ·{" "}
            <a href="tel:+15158039201">(515) 803-9201</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
