import type { CommandItem } from "@/components/CommandPalette";
import { CASE_STUDIES } from "@/data/caseStudies";
import { ALL_SKILLS } from "@/data/skills";

/** Sections reachable from the sidebar and the palette's "Navigation" group. */
export const NAV_SECTIONS = [
  "About",
  "Experience",
  "Projects",
  "Achievements",
  "Leadership",
  "Skills",
] as const;

const NAV: CommandItem[] = [
  { id: "nav-about", group: "Navigation", label: "About", href: "#about", meta: "Section", suggested: true },
  { id: "nav-exp", group: "Navigation", label: "Experience", href: "#experience", meta: "Section", suggested: true },
  { id: "nav-edu", group: "Navigation", label: "Education", href: "#education", meta: "Section", suggested: true },
  { id: "nav-proj", group: "Navigation", label: "Projects", href: "#projects", meta: "Section", suggested: true },
  { id: "nav-ach", group: "Navigation", label: "Achievements", href: "#achievements", meta: "Section", suggested: true },
  { id: "nav-lead", group: "Navigation", label: "Leadership", href: "#leadership", meta: "Section", suggested: true },
  { id: "nav-skill", group: "Navigation", label: "Skills", href: "#skills", meta: "Section", suggested: true },
];

const EXPERIENCE: CommandItem[] = [
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

const EDUCATION: CommandItem[] = [
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

const LEADERSHIP: CommandItem[] = [
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

const LINKS: CommandItem[] = [
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

const SKILLS: CommandItem[] = ALL_SKILLS.map((s) => ({
  id: `skill-${s.slug}`,
  group: "Skills",
  label: s.name,
  href: "#skills",
  meta: "Skill",
  keywords: [s.slug],
}));

/**
 * Builds the palette's command list.
 *
 * Case studies need a click handler, so the list is a function of that handler
 * rather than a module constant. Everything else is static and hoisted above.
 */
export function buildCommands(openCaseStudy: (slug: string) => void): CommandItem[] {
  const caseStudies: CommandItem[] = CASE_STUDIES.map((s) => ({
    id: `cs-${s.slug}`,
    group: "Case Studies",
    label: s.title,
    meta: "Case study",
    keywords: [s.subtitle ?? "", s.timeframe ?? "", s.slug],
    suggested: true,
    action: () => openCaseStudy(s.slug),
  }));

  return [...NAV, ...caseStudies, ...EXPERIENCE, ...EDUCATION, ...SKILLS, ...LEADERSHIP, ...LINKS];
}
