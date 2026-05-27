import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ExternalLink, Folder, Github, X } from "lucide-react";

type Project = {
  id: string;
  name: string;
  systemName: string;
  category: string;
  tag: string;
  blurb: string;
  problem: string;
  architecture: string[];
  challenges: string[];
  decisions: string[];
  stack: string[];
  impact: { label: string; value: string }[];
  github: string;
  demo: string;
  previewLabel: string;
};

const projects: Project[] = [
  {
    id: "meddoc",
    name: "MedDoc AI",
    systemName: "Project_01: MedDoc_AI.sys",
    category: "Research Agents",
    tag: "RAG | Healthcare",
    blurb: "An LLM agent that reads, reasons over, and explains medical documents in seconds.",
    problem: "Clinicians waste hours parsing lab reports, prescriptions, and scans across systems.",
    architecture: [
      "Ingestion -> OCR + structural parsing",
      "Embeddings -> ChromaDB vector store",
      "RAG router -> Gemini / GPT fallback",
      "Streaming UI -> React + SSE",
    ],
    challenges: ["Token-bounded long docs", "Hallucination on critical fields", "PHI-safe pipelines"],
    decisions: [
      "Hybrid retrieval (semantic + keyword) for clinical accuracy",
      "Schema-locked output via tool-calling for structured fields",
      "Streaming-first UX so users feel the system thinking",
    ],
    stack: ["Python", "FastAPI", "LangChain", "ChromaDB", "Gemini", "React", "Tailwind"],
    impact: [
      { label: "Read time", value: "-84%" },
      { label: "Accuracy", value: "97%" },
      { label: "Cost / doc", value: "$0.004" },
    ],
    github: "/",
    demo: "/",
    previewLabel: "DOC",
  },
  {
    id: "smartpipe",
    name: "SmartPipeline AI",
    systemName: "Project_02: SmartPipeline_AI.sys",
    category: "AI Applications",
    tag: "Agents | Data Ops",
    blurb: "Self-healing data pipelines that re-route around failures with LLM reasoning.",
    problem: "Pipelines silently fail and on-call engineers debug production incidents at 3am.",
    architecture: [
      "DAG runtime with health probes",
      "Failure -> LLM diagnostic agent",
      "Plan -> patch -> replay automatically",
      "Audit log streamed to dashboard",
    ],
    challenges: ["Determinism vs LLM creativity", "Cost ceilings", "Safe auto-remediation"],
    decisions: [
      "Two-tier agent: planner + critic before any production action",
      "Async event bus for back-pressure under traffic storms",
      "Per-stage circuit breakers with manual override",
    ],
    stack: ["Node.js", "TypeScript", "Docker", "GCP", "LangChain", "Redis"],
    impact: [
      { label: "MTTR", value: "-71%" },
      { label: "Auto-fixed", value: "62%" },
      { label: "Pages / wk", value: "-9" },
    ],
    github: "/",
    demo: "/",
    previewLabel: "PIPE",
  },
  {
    id: "atlas",
    name: "Atlas Core",
    systemName: "Project_03: Atlas_Core.sys",
    category: "Full-Stack Infrastructure",
    tag: "Platform | Infra",
    blurb: "Internal platform primitives for auth, billing, quotas, and cross-product operations.",
    problem: "Every new product was re-implementing the same platform plumbing from scratch.",
    architecture: ["Shared SDK", "Edge gateway", "Quota and metering", "Multi-tenant database"],
    challenges: ["Backward compatibility across apps", "Live migrations", "Zero-trust boundaries"],
    decisions: ["Contract-first APIs", "Feature flags as a primitive", "Observability budget per route"],
    stack: ["TypeScript", "FastAPI", "Postgres", "Docker", "GCP"],
    impact: [
      { label: "Boot time", value: "1 day" },
      { label: "Code reuse", value: "73%" },
      { label: "Incidents", value: "-48%" },
    ],
    github: "/",
    demo: "/",
    previewLabel: "CORE",
  },
  {
    id: "swarm",
    name: "Swarm Intelligence",
    systemName: "Project_04: Swarm_Intelligence.sys",
    category: "Core Innovation",
    tag: "Multi-Agent | Research",
    blurb: "A multi-agent framework that optimizes distributed reasoning loops and role delegation.",
    problem: "Single-agent workflows struggled with decomposing complex, multi-step reasoning tasks.",
    architecture: [
      "Coordinator routes tasks to specialist agents",
      "Shared memory store tracks context handoffs",
      "Critic agent scores outputs before merge",
      "Operator dashboard streams chain-of-thought summaries",
    ],
    challenges: ["Context drift", "Latency across chained tools", "Reliable arbitration"],
    decisions: [
      "Specialized agents with narrow responsibilities",
      "Checkpointed memory to avoid repeated inference",
      "Critic pass before user-visible synthesis",
    ],
    stack: ["Python", "LangGraph", "Redis", "FastAPI", "Next.js"],
    impact: [
      { label: "Accuracy", value: "99.2%" },
      { label: "Latency", value: "45ms" },
      { label: "Runtime", value: "-38%" },
    ],
    github: "/",
    demo: "/",
    previewLabel: "AGI",
  },
  {
    id: "prophet",
    name: "Market Prophet",
    systemName: "Project_05: Market_Prophet.sys",
    category: "AI Applications",
    tag: "Forecasting | Analytics",
    blurb: "Signal-fusion forecasting for trend analysis, scenario testing, and operations planning.",
    problem: "Teams were making planning decisions from fragmented dashboards and delayed reports.",
    architecture: [
      "Time-series ingestion layer",
      "Feature fusion across business signals",
      "Forecast service with confidence bands",
      "Ops dashboard with scenario comparison",
    ],
    challenges: ["Noisy signals", "Model drift", "Keeping forecast explanations legible"],
    decisions: [
      "Confidence scoring beside every forecast output",
      "Rolling retraining windows tied to drift thresholds",
      "Scenario explorer prioritized over static reports",
    ],
    stack: ["Python", "Pandas", "XGBoost", "FastAPI", "React"],
    impact: [
      { label: "Forecast hit rate", value: "91%" },
      { label: "Planning time", value: "-57%" },
      { label: "Alert lead", value: "+18h" },
    ],
    github: "/",
    demo: "/",
    previewLabel: "PRM",
  },
];

const categories = [
  "Research Agents",
  "AI Applications",
  "Full-Stack Infrastructure",
  "Core Innovation",
];

export function ProjectUniverse() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [previewId, setPreviewId] = useState("meddoc");
  const [active, setActive] = useState<Project | null>(null);

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.category === selectedCategory),
    [selectedCategory],
  );

  const preview =
    filteredProjects.find((project) => project.id === previewId) ?? filteredProjects[0] ?? projects[0];

  return (
    <section className="relative min-h-screen px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">// Subsystem 03</div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-[0.2em] sm:text-5xl">
            Project <span className="text-neon">Systems</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Same project deep-dives, re-skinned as a focused command deck instead of a universe map.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-neon/20 bg-[#04101f]/80 p-4 shadow-[0_0_50px_rgba(35,35,255,0.1)] backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(72,214,255,0.12),transparent_30%),linear-gradient(180deg,rgba(0,173,255,0.04),rgba(0,0,0,0))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="relative grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_400px]">
            <div className="space-y-3">
              {categories.map((category) => {
                const isActive = category === selectedCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      const firstProject = projects.find((project) => project.category === category);
                      if (firstProject) {
                        setPreviewId(firstProject.id);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-[11px] uppercase tracking-[0.28em] transition ${
                      isActive
                        ? "border-cyan-300/80 bg-cyan-300/10 text-cyan-100 shadow-[0_0_22px_rgba(72,214,255,0.28)]"
                        : "border-cyan-300/20 bg-black/20 text-cyan-200/75 hover:border-cyan-300/45 hover:bg-cyan-300/5"
                    }`}
                  >
                    <Folder className="h-4 w-4 shrink-0" />
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-md border border-cyan-300/25 bg-[#07111f]/85 p-4">
              <div className="mb-3 flex items-center justify-between border-b border-cyan-300/15 pb-3">
                <div className="text-[10px] uppercase tracking-[0.45em] text-cyan-100/70">
                  {selectedCategory}
                </div>
                <div className="text-[9px] uppercase tracking-[0.4em] text-cyan-100/45">
                  {filteredProjects.length.toString().padStart(2, "0")} files
                </div>
              </div>

              <div className="space-y-2">
                {filteredProjects.map((project) => {
                  const isPreview = project.id === preview.id;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onMouseEnter={() => setPreviewId(project.id)}
                      onFocus={() => setPreviewId(project.id)}
                      onClick={() => setActive(project)}
                      className={`flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition ${
                        isPreview ? "bg-cyan-300/8 text-cyan-50" : "text-cyan-100/78 hover:bg-cyan-300/5"
                      }`}
                    >
                      <span className="text-cyan-300/85">{isPreview ? "v" : ">"}</span>
                      <span className="truncate text-[13px] tracking-[0.18em]">{project.systemName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md border border-cyan-300/25 bg-[#07111f]/90 p-4">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-1">
                <div className="rounded-md border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(7,24,39,0.94),rgba(4,10,18,0.96))] p-3">
                  <div className="flex items-center justify-between border-b border-cyan-300/15 pb-2">
                    <div className="text-[10px] uppercase tracking-[0.42em] text-cyan-100/75">
                      Preview Feed
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.35em] text-cyan-300/80">GIF</div>
                  </div>

                  <div className="mt-3 flex h-44 items-center justify-center overflow-hidden rounded-md border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),rgba(3,10,18,0.92)_58%)]">
                    <motion.div
                      key={preview.id}
                      initial={{ opacity: 0.45, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/35 text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.18)]"
                    >
                      <span className="absolute inset-3 rounded-full border border-cyan-300/15" />
                      <span className="absolute h-20 w-px rotate-12 bg-cyan-300/45" />
                      <span className="absolute w-20 h-px -rotate-12 bg-cyan-300/45" />
                      <span className="text-xl font-semibold tracking-[0.4em]">{preview.previewLabel}</span>
                    </motion.div>
                  </div>

                  <div className="mt-3 text-[11px] leading-5 text-cyan-50/85">
                    <span className="mr-2 uppercase tracking-[0.28em] text-cyan-300/80">Description:</span>
                    {preview.blurb}
                  </div>
                </div>

                <div className="rounded-md border border-cyan-300/20 bg-black/15 p-3">
                  <div className="border-b border-cyan-300/15 pb-2 text-[10px] uppercase tracking-[0.42em] text-cyan-100/75">
                    Metrics & Stack
                  </div>

                  <div className="mt-3 space-y-2 text-[11px] text-cyan-50/82">
                    {preview.impact.map((item) => (
                      <div key={item.label} className="flex items-start gap-2">
                        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        <span>
                          <span className="text-cyan-100/55">{item.label}:</span> {item.value}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-start gap-2">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>
                        <span className="text-cyan-100/55">Stack:</span> {preview.stack.slice(0, 3).join(" | ")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={preview.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-w-[132px] items-center justify-center gap-2 rounded-sm border border-cyan-300/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-cyan-100 transition hover:bg-cyan-300/10"
                    >
                      <Github className="h-3.5 w-3.5" />
                      View Code
                    </a>
                    <a
                      href={preview.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-w-[132px] items-center justify-center gap-2 rounded-sm border border-cyan-300/55 bg-cyan-300/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-cyan-50 transition hover:bg-cyan-300/18"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 text-center text-[9px] uppercase tracking-[0.5em] text-cyan-100/40">
            Scroll to traverse
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setActive(null)}
            />
            <motion.div
              className="glass relative z-10 max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-xl p-6 sm:p-8"
              initial={{ scale: 0.85, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ boxShadow: "var(--neon-glow)" }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 rounded-md border border-neon/30 p-2 text-neon hover:bg-neon/10"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">{active.tag}</div>
              <h3 className="mt-2 text-3xl font-black uppercase tracking-[0.15em] text-neon sm:text-5xl">
                {active.name}
              </h3>
              <p className="mt-3 max-w-2xl text-sm text-foreground/80">{active.blurb}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Block title="Problem">{active.problem}</Block>
                <Block title="Architecture">
                  <ol className="space-y-1 text-xs text-foreground/80">
                    {active.architecture.map((item, index) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-neon">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
                <Block title="Challenges">
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {active.challenges.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </Block>
                <Block title="Engineering decisions">
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {active.decisions.map((item) => (
                      <li key={item}>{"->"} {item}</li>
                    ))}
                  </ul>
                </Block>
              </div>

              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Stack</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {active.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-neon/30 bg-neon/5 px-2 py-1 text-[10px] uppercase tracking-widest text-neon"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {active.impact.map((item) => (
                  <div key={item.label} className="rounded border border-neon/20 p-3 text-center">
                    <div className="text-2xl font-bold text-neon">{item.value}</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={active.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-neon/40 px-4 py-2 text-xs uppercase tracking-widest text-neon hover:bg-neon/10"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
                <a
                  href={active.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-neon px-4 py-2 text-xs uppercase tracking-widest text-black hover:opacity-90"
                  style={{ background: "#2323FF" }}
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-neon/15 bg-black/40 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{title}</div>
      <div className="text-sm text-foreground/85">{children}</div>
    </div>
  );
}
