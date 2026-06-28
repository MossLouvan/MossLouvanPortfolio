export type Skill = {
  name: string;
  /** filename (without extension) in /public/logos/skills/ */
  slug: string;
  /** brand color for the logo tile accent / monogram fallback */
  brandColor?: string;
  /** when true, no logo file exists — render a monogram tile instead */
  monogram?: boolean;
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
      { name: "Java", slug: "java", brandColor: "#E76F00" },
      { name: "C / C++", slug: "cpp", brandColor: "#00599C" },
      { name: "C#", slug: "csharp", brandColor: "#9B4F96" },
      { name: "SQL", slug: "sql", brandColor: "#4479A1" },
      { name: "TypeScript", slug: "typescript", brandColor: "#3178C6" },
    ],
  },
  {
    title: "AI & Tooling",
    skills: [
      { name: "LangChain", slug: "langchain", brandColor: "#1C3C3C" },
      { name: "LangGraph", slug: "langgraph", brandColor: "#1C3C3C", monogram: true },
      { name: "A2A", slug: "a2a", brandColor: "#4285F4", monogram: true },
      { name: "AWS Bedrock", slug: "awsbedrock", brandColor: "#FF9900" },
      { name: "OpenAI", slug: "openai", brandColor: "#412991" },
    ],
  },
  {
    title: "Infrastructure & Web",
    skills: [
      { name: "Postgres", slug: "postgresql", brandColor: "#4169E1" },
      { name: "Docker", slug: "docker", brandColor: "#2496ED" },
      { name: "Kubernetes", slug: "kubernetes", brandColor: "#326CE5" },
      { name: "Next.js", slug: "nextdotjs", brandColor: "#000000" },
      { name: "React", slug: "react", brandColor: "#61DAFB" },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((c) => c.skills);
