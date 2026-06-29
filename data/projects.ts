export type ProjectLink = { label: string; href: string };

export type Project = {
  /** matches a CaseStudy slug in data/caseStudies.ts */
  slug: string;
  title: string;
  role: string;
  timeframe: string;
  blurb: string;
  bullets: string[];
  tags: string[];
  visibility: "public" | "private";
  links: ProjectLink[];
  /** cover image shown on the card */
  cover?: string;
  /** how the cover fills its frame (photos => cover, logos => contain) */
  coverFit?: "cover" | "contain";
};

export const PROJECTS: Project[] = [
  {
    slug: "nasa-adc",
    title: "NASA South Pole Lunar Exploration App",
    role: "Lead Coder & Game Developer",
    timeframe: "Oct 2023 – Apr 2024",
    cover: "/projects/nasa.jpg",
    coverFit: "cover",
    blurb:
      "An AI-assisted lunar rover simulator built on real lunar south pole terrain constraints and mission-oriented exploration workflows.",
    bullets: [
      "National winner of the NASA App Development Challenge",
      "Interactive exploration + simulation experience",
      "Engineered for storytelling and demo-mode stability",
    ],
    tags: ["Game Dev", "AI", "Simulation", "Geospatial"],
    visibility: "private",
    links: [
      { label: "Email me about it", href: "mailto:mosslouvan67@gmail.com?subject=NASA%20Case%20Study" },
    ],
  },
  {
    slug: "converge",
    title: "Converge",
    role: "Full-Stack Developer · SwanHacks Spring 2026",
    timeframe: "May 2026",
    cover: "/projects/converge.png",
    coverFit: "cover",
    blurb:
      "An AI-powered lecture capture & study platform — records lectures, transcribes them on-device, and auto-generates notes, flashcards, quizzes, and study plans, with accessibility built in.",
    bullets: [
      "In-browser transcription with local Whisper — audio stays on-device",
      "Notes, flashcards (SM-2), quizzes & study plans via LLM + RAG",
      "ASL fingerspelling input + deep accessibility features",
    ],
    tags: ["React", "PocketBase", "Whisper", "RAG", "MediaPipe"],
    visibility: "public",
    links: [
      { label: "GitHub", href: "https://github.com/jackulau/SwanHacksSpring2026" },
      { label: "Devpost", href: "https://devpost.com/software/converge-4ek5ho" },
    ],
  },
  {
    slug: "principal-ai-pdf",
    title: "AI PDF Processing Platform",
    role: "Contracted AI Software Engineer · Principal Financial Group",
    timeframe: "Jun 2024 – Aug 2024",
    cover: "/projects/principal.png",
    coverFit: "contain",
    blurb:
      "An end-to-end AI platform that ingests PDFs, chunks + embeds content, and powers traceable RAG with evidence highlighting.",
    bullets: [
      "RAG pipeline with transparent chunk highlighting",
      "AWS Bedrock (Titan Text + Embeddings) + vector storage",
      "Shipped for stakeholders and demoed to leadership",
    ],
    tags: ["RAG", "AWS Bedrock", "Python", "Vector Search"],
    visibility: "private",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/moss-louvan-4614682a4/" },
    ],
  },
];
