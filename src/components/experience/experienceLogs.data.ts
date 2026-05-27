export type ExperienceYearLog = {
  id: string;
  yearLabel: string;
  bullets: string[];
  tasks: string[];
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
    tasks: [
      "Led rollout of agentic workflows into production-grade systems across internal AI operations.",
      "Built orchestration patterns for multi-step reasoning, tool use, and response verification.",
      "Improved deployment readiness for AI services with stronger monitoring and runtime stability.",
    ],
  },
  {
    id: "year_2025",
    yearLabel: "2025",
    state: "complete",
    bullets: ["Delivered optimized AI systems with measurable business impact."],
    tasks: [
      "Optimized AI delivery pipelines to improve turnaround time for model-backed product features.",
      "Measured business impact of deployed AI systems through latency, adoption, and reliability metrics.",
      "Partnered across teams to turn experimental models into stable production workflows.",
    ],
  },
  {
    id: "year_2024",
    yearLabel: "2024",
    state: "complete",
    bullets: ["Refined real-time inference latency for production workflows."],
    tasks: [
      "Reduced inference bottlenecks in production flows through model-serving and request-path tuning.",
      "Benchmarked runtime behavior across workloads to identify latency spikes and recovery patterns.",
      "Improved responsiveness for real-time AI experiences used in day-to-day operations.",
    ],
  },
  {
    id: "year_2023",
    yearLabel: "2023",
    state: "complete",
    bullets: ["Scaled training data pipelines from 1M to 5M tokens."],
    tasks: [
      "Expanded training data pipelines from 1M to 5M tokens with stronger data ingestion controls.",
      "Improved data throughput for model preparation while reducing manual cleanup effort.",
      "Created repeatable processing flows to support larger training runs with fewer failures.",
    ],
  },
  {
    id: "year_2022",
    yearLabel: "2022",
    state: "complete",
    bullets: ["Established foundational ML models for data segmentation."],
    tasks: [
      "Built foundational ML models for segmentation workflows used in early product experimentation.",
      "Defined baseline evaluation patterns to compare model quality across multiple training runs.",
      "Laid the groundwork for later automation in testing, deployment, and model iteration cycles.",
    ],
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
