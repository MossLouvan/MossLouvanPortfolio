export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  timeframe?: string;
  links?: { label: string; href: string }[];

  overview: {
    problem: string;
    role: string;
    solution: string;
    highlights: string[];
  };

  architecture: {
    nodes: { id: string; label: string; desc: string }[];
    edges: { from: string; to: string }[];
  };

  impact: {
    bullets: string[];
  };
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "nasa-adc",
    title: "NASA South Pole Lunar Exploration App",
    subtitle: "Lead Coder & Game Developer",
    timeframe: "Oct 2023 – Apr 2024",
    links: [
      { label: "Email me about it", href: "mailto:mosslouvan67@gmail.com?subject=NASA%20Case%20Study" },
      // Add demo/repo if you want:
      // { label: "GitHub", href: "https://github.com/..." },
    ],
    overview: {
      problem:
        "Build a lunar exploration experience that uses real geospatial constraints and communicates technical decisions clearly to judges.",
      role:
        "Led core development and integration. Built the app experience, coordinated engineering tasks, and ensured competition requirements were met.",
      solution:
        "Shipped an AI-assisted rover exploration simulator grounded in real lunar south pole data, designed for clarity, reliability, and a strong demo narrative.",
      highlights: [
        "National 2024 NASA App Development Challenge winner",
        "Designed the core experience to be demo-ready and judge-friendly",
        "Built with a focus on reliability under live presentation conditions",
        "Won out of over 100 teams nationwide, with a large field of strong competitors"
      ],
    },
    architecture: {
      nodes: [
        { id: "ui", label: "UI / Simulator", desc: "Interactive rover exploration experience & user controls." },
        { id: "data", label: "Geospatial Data", desc: "Real lunar south pole terrain constraints & reference data." },
        { id: "logic", label: "Core Logic", desc: "Rules, constraints, navigation, and simulation loop." },
        { id: "ai", label: "AI Assist", desc: "Assists decision-making / guidance for exploration workflow." },
        { id: "demo", label: "Demo Layer", desc: "Storytelling hooks, quick-start flows, presentation mode stability." },
      ],
      edges: [
        { from: "data", to: "logic" },
        { from: "logic", to: "ui" },
        { from: "ai", to: "ui" },
        { from: "demo", to: "ui" },
      ],
    },
    impact: {
      bullets: [
        "Won nationally against a large field of participating teams",
        "Created a polished demo experience for presentations and judging",
        "Strengthened public speaking + technical communication through talks and showcases",
        "Lit the path for the future showing how people coming from low income areas can win national competitions and work with NASA",
      ],
    },
  },

  {
    slug: "principal-ai-pdf",
    title: "AI PDF Processing Platform",
    subtitle: "Contracted AI Software Engineer — Principal Financial Group",
    timeframe: "Jun 2024 – Aug 2024",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/moss-louvan-4614682a4/" },
    ],
    overview: {
      problem:
        "Speed up understanding of dense PDFs while keeping answers traceable and enterprise-friendly (people need to trust the output).",
      role:
        "Built the full-stack platform: ingestion, chunking, retrieval, and UI experience for citations / highlighting.",
      solution:
        "Implemented a RAG PDF assistant with transparent chunk highlighting and production-minded UX for fast navigation + verification.",
      highlights: [
        "Built end-to-end platform (ingest → retrieve → answer → highlight evidence)",
        "Designed for traceability and stakeholder trust by keeping the human in the loop",
        "Presented to senior engineers/executives (including CEO visibility)",
        "Reduced reliance on third party vendors costing 500k+/year"
      ],
    },
    architecture: {
      nodes: [
        { id: "upload", label: "Upload / Ingest", desc: "PDF upload + parsing + normalization." },
        { id: "chunk", label: "Chunking", desc: "Split into retrieval-friendly chunks." },
        { id: "embed", label: "Embeddings", desc: "Vectorize chunks for semantic search." },
        { id: "store", label: "Vector Store", desc: "Stores embeddings + metadata for retrieval." },
        { id: "rag", label: "RAG Orchestrator", desc: "Retrieve relevant chunks + generate answer." },
        { id: "ui", label: "UI Evidence View", desc: "Highlight retrieved chunks for transparency." },
      ],
      edges: [
        { from: "upload", to: "chunk" },
        { from: "chunk", to: "embed" },
        { from: "embed", to: "store" },
        { from: "store", to: "rag" },
        { from: "rag", to: "ui" },
      ],
    },
    impact: {
      bullets: [
        "Improved trust via chunk highlighting + evidence-first UX",
        "Streamlined PDF exploration for technical and non-technical stakeholders",
        "Delivered demo-ready system for leadership review",
      ],
    },
  },
];