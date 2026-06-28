export type Skill = {
  name: string;
  /** filename (without extension) in /public/logos/skills/ */
  slug: string;
  /** when true, no logo file exists — render a monogram tile instead */
  monogram?: boolean;
  /** explicit monogram label (defaults to initials derived from name) */
  mono?: string;
  /** subtle hover context: where this was used */
  usedAt?: string;
};

export type SkillCategory = {
  title: string;
  /** featured tier gets larger tiles and is shown first */
  featured?: boolean;
  skills: Skill[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Core Stack",
    featured: true,
    skills: [
      { name: "Python", slug: "python" },
      { name: "TypeScript", slug: "typescript" },
      { name: "React", slug: "react", usedAt: "This site + Converge" },
      { name: "FastAPI", slug: "fastapi", usedAt: "AI pipeline services" },
      { name: "LangGraph", slug: "langgraph", monogram: true, mono: "LG", usedAt: "John Deere AI agents" },
      { name: "LangChain", slug: "langchain", usedAt: "John Deere AI agents" },
      { name: "Docker", slug: "docker" },
      { name: "PostgreSQL", slug: "postgresql", usedAt: "John Deere vector search" },
      { name: "Amazon Bedrock", slug: "awsbedrock", usedAt: "Principal RAG app" },
    ],
  },
  {
    title: "AI / ML",
    skills: [
      { name: "PyTorch", slug: "pytorch" },
      { name: "scikit-learn", slug: "scikitlearn" },
      { name: "NumPy", slug: "numpy" },
      { name: "Pandas", slug: "pandas" },
      { name: "OpenCV", slug: "opencv", usedAt: "Computer vision" },
      { name: "ChromaDB", slug: "chromadb", monogram: true, mono: "Ch", usedAt: "Principal RAG app" },
      { name: "FastMCP", slug: "fastmcp", monogram: true, mono: "MCP", usedAt: "Agent tooling" },
      { name: "Google A2A", slug: "a2a", monogram: true, mono: "A2A", usedAt: "John Deere AI agents" },
    ],
  },
  {
    title: "Backend & Infrastructure",
    skills: [
      { name: "C++", slug: "cpp" },
      { name: "SQL", slug: "sql" },
      { name: "Kubernetes", slug: "kubernetes" },
      { name: "Terraform", slug: "terraform" },
      { name: "Linux", slug: "linux" },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "GitHub Actions", slug: "githubactions" },
      { name: "Playwright", slug: "playwright", usedAt: "Browser automation + E2E" },
      { name: "Unreal Engine 5", slug: "unrealengine", usedAt: "NASA Artemis II visualization" },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((c) => c.skills);
