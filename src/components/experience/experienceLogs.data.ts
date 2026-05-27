export type ExperienceYearLog = {
  id: string;
  yearLabel: string;
  bullets: string[];
  state?: "complete" | "active";
};

export type ExperienceTaskBlock = {
  company: string;
  position: string;
  timeline: string;
  tasks: string[];
};

export const experienceYearLogs: ExperienceYearLog[] = [
  {
    id: "year_2026",
    yearLabel: "2026",
    state: "active",
    bullets: ["Scaling agentic workflows into production-grade systems."],
  },
  {
    id: "year_2025",
    yearLabel: "2025",
    state: "complete",
    bullets: ["Delivered optimized AI systems with measurable business impact."],
  },
  {
    id: "year_2024",
    yearLabel: "2024",
    state: "complete",
    bullets: ["Refined real-time inference latency for production workflows."],
  },
  {
    id: "year_2023",
    yearLabel: "2023",
    state: "complete",
    bullets: ["Scaled training data pipelines from 1M to 5M tokens."],
  },
  {
    id: "year_2022",
    yearLabel: "2022",
    state: "complete",
    bullets: ["Established foundational ML models for data segmentation."],
  },
];

export const experienceTaskBlock: ExperienceTaskBlock = {
  company: "Alpha AI Labs",
  position: "Lead AI/ML Engineer (4 years)",
  timeline: "Jan 2020 - Present",
  tasks: [
    "Orchestrated multi-agent RAG vector space and scaled distributed LLM training pipeline.",
    "Architected and deployed production-grade MLOps pipelines reducing time-to-market by 50%.",
    "Deployed cloud compute strategy across LLM workloads, unlocking multi-team model experimentation.",
    "Benchmarked and optimized cloud compute strategy, cutting costs by -35% annually.",
  ],
};
