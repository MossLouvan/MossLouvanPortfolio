export type Skill = {
  name: string;
  /** filename (without extension) in /public/logos/skills/ */
  slug: string;
  /** brand color for the logo tile accent / monogram fallback */
  brandColor?: string;
  /** when true, no logo file exists — render a monogram tile instead */
  monogram?: boolean;
  /** explicit monogram label (defaults to initials derived from name) */
  mono?: string;
};

export type SkillCategory = {
  title: string;
  skills: Skill[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages & Core",
    skills: [
      { name: "Python", slug: "python", brandColor: "#3776AB" },
      { name: "TypeScript", slug: "typescript", brandColor: "#3178C6" },
      { name: "C", slug: "c", brandColor: "#A8B9CC" },
      { name: "C++", slug: "cpp", brandColor: "#00599C" },
      { name: "SQL", slug: "sql", brandColor: "#4479A1" },
    ],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      { name: "PyTorch", slug: "pytorch", brandColor: "#EE4C2C" },
      { name: "scikit-learn", slug: "scikitlearn", brandColor: "#F7931E" },
      { name: "NumPy", slug: "numpy", brandColor: "#013243" },
      { name: "Pandas", slug: "pandas", brandColor: "#150458" },
      { name: "OpenCV", slug: "opencv", brandColor: "#5C3EE8" },
      { name: "Matplotlib", slug: "matplotlib", brandColor: "#11557C" },
      { name: "LangChain", slug: "langchain", brandColor: "#1C3C3C" },
      { name: "LangGraph", slug: "langgraph", brandColor: "#1C3C3C", monogram: true, mono: "LG" },
      { name: "FastMCP", slug: "fastmcp", brandColor: "#4F46E5", monogram: true, mono: "MCP" },
      { name: "Google A2A", slug: "a2a", brandColor: "#4285F4", monogram: true, mono: "A2A" },
      { name: "Amazon Bedrock", slug: "awsbedrock", brandColor: "#FF9900" },
      { name: "ChromaDB", slug: "chromadb", brandColor: "#6366F1", monogram: true, mono: "Ch" },
    ],
  },
  {
    title: "Backend & Infrastructure",
    skills: [
      { name: "FastAPI", slug: "fastapi", brandColor: "#009688" },
      { name: "PostgreSQL", slug: "postgresql", brandColor: "#4169E1" },
      { name: "Docker", slug: "docker", brandColor: "#2496ED" },
      { name: "Kubernetes", slug: "kubernetes", brandColor: "#326CE5" },
      { name: "Terraform", slug: "terraform", brandColor: "#7B42BC" },
      { name: "Linux", slug: "linux", brandColor: "#FCC624" },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "React", slug: "react", brandColor: "#61DAFB" },
      { name: "Git", slug: "git", brandColor: "#F05032" },
      { name: "GitHub", slug: "github", brandColor: "#181717" },
      { name: "GitHub Actions", slug: "githubactions", brandColor: "#2088FF" },
      { name: "Playwright", slug: "playwright", brandColor: "#2EAD33" },
      { name: "Unreal Engine 5", slug: "unrealengine", brandColor: "#0E1128" },
      { name: "VS Code", slug: "vscode", brandColor: "#007ACC" },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((c) => c.skills);
