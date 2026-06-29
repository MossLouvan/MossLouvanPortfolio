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

  /** Optional real diagram image (PNG/SVG in /public); overrides the generated SVG when set. */
  diagramImage?: string;

  /** Plain-language ordered pipeline — the easy-to-read "how it works". */
  flow?: string[];

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
    flow: [
      "Start from a single CSV of lunar elevation data",
      "Generate a terrain heightmap from it in Python",
      "Model a 3D rover and build a traversable lunar scene",
      "Research the best region & pick optimal start/end points",
      "Plan the route with A* — weighted to constrain slope & sun visibility",
      "Simulate the rover traversing the optimal path",
    ],
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
        { id: "csv", label: "Elevation CSV", desc: "A single CSV of real lunar south-pole elevation data." },
        { id: "heightmap", label: "Heightmap (Python)", desc: "Python converts the height data into a terrain heightmap." },
        { id: "region", label: "Region Research", desc: "Analysis of the best area to explore; picks optimal start & end points." },
        { id: "scene", label: "3D Scene + Rover", desc: "A 3D-modeled rover and a traversable scene built from the heightmap." },
        { id: "astar", label: "A* Path Planner", desc: "A* search with weighted costs that constrain slope and sun visibility." },
        { id: "sim", label: "Rover Simulator", desc: "The rover traverses the optimal route through the 3D scene." },
      ],
      edges: [
        { from: "csv", to: "heightmap" },
        { from: "heightmap", to: "scene" },
        { from: "heightmap", to: "astar" },
        { from: "region", to: "astar" },
        { from: "scene", to: "sim" },
        { from: "astar", to: "sim" },
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
    subtitle: "Contracted AI Software Engineer · Principal Financial Group",
    timeframe: "Jun 2024 – Aug 2024",
    flow: [
      "Ingest & parse uploaded PDFs",
      "Chunk the text and generate embeddings",
      "Store vectors for fast semantic retrieval",
      "Answer questions with highlighted source evidence",
    ],
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

  {
    slug: "converge",
    title: "Converge",
    subtitle: "Full-Stack Developer · SwanHacks Spring 2026 (Iowa State)",
    timeframe: "May 2026",
    flow: [
      "Capture lecture audio — or upload a recording / PDF / Word doc",
      "Transcribe on-device with local Whisper (no server round-trip)",
      "Generate notes, flashcards, quizzes & study plans (LLM + RAG)",
      "Study with spaced repetition + accessibility tools",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/jackulau/SwanHacksSpring2026" },
      { label: "Devpost", href: "https://devpost.com/software/converge-4ek5ho" },
    ],
    overview: {
      problem:
        "Students juggle Otter.ai, Notion, Quizlet, Anki and their calendar to keep up with lectures — and accessibility is usually an afterthought.",
      role:
        "Full-stack developer on a 4-person team. Built capture → transcript → study pipeline pieces, Canvas integration, and the accessibility layer.",
      solution:
        "One AI-powered platform that captures lectures, transcribes them on-device, and auto-generates notes, flashcards, quizzes, and study plans — with deep accessibility built in from the start.",
      highlights: [
        "In-browser transcription with local Whisper (transformers.js) — audio never leaves the device",
        "Notes, flashcards (SM-2 spaced repetition), quizzes & study plans built from a RAG knowledge base",
        "Pluggable LLM — local Ollama by default, with OpenAI / Gemini / OpenRouter presets",
        "ASL fingerspelling-to-text using fully client-side MediaPipe hand tracking",
        "Accessibility-first: text-to-speech, dyslexia-friendly fonts, reading ruler, focus mode",
        "Canvas LMS integration maps study materials to the right courses",
      ],
    },
    architecture: {
      nodes: [
        { id: "capture", label: "Capture / Upload", desc: "Record lecture audio in the browser, or upload a recording, PDF, or Word doc." },
        { id: "asl", label: "ASL Input (MediaPipe)", desc: "Client-side hand tracking turns ASL fingerspelling into text." },
        { id: "canvas", label: "Canvas LMS", desc: "Pulls courses so study materials map to the right class." },
        { id: "stt", label: "Local Whisper (in-browser)", desc: "In-browser Whisper (transformers.js, whisper-tiny) transcribes audio in ~8s chunks — nothing leaves the device." },
        { id: "transcript", label: "Transcript", desc: "Unified, timestamped transcript that drives everything downstream." },
        { id: "ai", label: "AI Pipeline (LLM + RAG)", desc: "Pluggable LLM — Ollama by default, or OpenAI / Gemini / OpenRouter — over a chunked knowledge base: clean up → notes → flashcards → quizzes → study plans." },
        { id: "store", label: "PocketBase", desc: "Backend + database the app is built on; persists lectures, transcripts, the knowledge base, and study materials." },
        { id: "study", label: "Notes · Flashcards · Quizzes · Study plans", desc: "The study output — artifacts with SM-2 spaced repetition + Pomodoro sessions." },
      ],
      edges: [
        { from: "capture", to: "stt" },
        { from: "stt", to: "transcript" },
        { from: "asl", to: "transcript" },
        { from: "transcript", to: "ai" },
        { from: "transcript", to: "store" },
        { from: "canvas", to: "store" },
        { from: "ai", to: "study" },
      ],
    },
    impact: {
      bullets: [
        "Built end-to-end at SwanHacks Spring 2026 (Iowa State) with a 4-person team",
        "Converges five separate study tools into one accessible workflow",
        "Accessibility is core, not bolted on — designed for every student",
      ],
    },
  },
];