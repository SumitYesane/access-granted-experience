import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Github, X } from "lucide-react";

type Project = {
  id: string;
  name: string;
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
  hue: string;
  pos: { x: string; y: string; size: number };
};

const projects: Project[] = [
  {
    id: "meddoc",
    name: "MedDoc AI",
    tag: "RAG • Healthcare",
    blurb: "An LLM agent that reads, reasons over and explains medical documents in seconds.",
    problem: "Clinicians waste hours parsing lab reports, prescriptions and scans across systems.",
    architecture: [
      "Ingestion → OCR + structural parsing",
      "Embeddings → ChromaDB vector store",
      "RAG router → Gemini / GPT fallback",
      "Streaming UI → React + SSE",
    ],
    challenges: ["Token-bounded long docs", "Hallucination on critical fields", "PHI-safe pipelines"],
    decisions: [
      "Hybrid retrieval (semantic + keyword) for clinical accuracy",
      "Schema-locked output via tool-calling for structured fields",
      "Streaming-first UX so users feel the system thinking",
    ],
    stack: ["Python", "FastAPI", "LangChain", "ChromaDB", "Gemini", "React", "Tailwind"],
    impact: [
      { label: "Read time", value: "−84%" },
      { label: "Accuracy", value: "97%" },
      { label: "Cost / doc", value: "$0.004" },
    ],
    github: "/",
    demo: "/",
    hue: "#2323FF",
    pos: { x: "22%", y: "30%", size: 220 },
  },
  {
    id: "smartpipe",
    name: "SmartPipeline AI",
    tag: "Agents • Data Ops",
    blurb: "Self-healing data pipelines that re-route around failures with LLM reasoning.",
    problem: "Pipelines silently fail; on-call engineers debug at 3am.",
    architecture: [
      "DAG runtime with health probes",
      "Failure → LLM diagnostic agent",
      "Plan → patch → replay automatically",
      "Audit log streamed to dashboard",
    ],
    challenges: ["Determinism vs LLM creativity", "Cost ceilings", "Safe auto-remediation"],
    decisions: [
      "Two-tier agent: planner + critic before any prod action",
      "Async event bus for back-pressure under storms",
      "Per-stage circuit breakers with manual override",
    ],
    stack: ["Node.js", "TypeScript", "Docker", "GCP", "LangChain", "Redis"],
    impact: [
      { label: "MTTR", value: "−71%" },
      { label: "Auto-fixed", value: "62%" },
      { label: "Pages / wk", value: "−9" },
    ],
    github: "/",
    demo: "/",
    hue: "#7CFF6B",
    pos: { x: "70%", y: "55%", size: 260 },
  },
  {
    id: "atlas",
    name: "Atlas Core",
    tag: "Platform • Infra",
    blurb: "Internal platform layer abstracting auth, billing and AI quotas across products.",
    problem: "Every new product was re-implementing the same plumbing.",
    architecture: ["Shared SDK", "Edge gateway", "Quota & metering", "Multi-tenant DB"],
    challenges: ["Backward-compat across 4 apps", "Live migrations", "Zero-trust boundaries"],
    decisions: ["Contract-first APIs", "Feature flags as a primitive", "Observability budget per route"],
    stack: ["TypeScript", "FastAPI", "Postgres", "Docker", "GCP"],
    impact: [
      { label: "Boot time", value: "1 day" },
      { label: "Code reuse", value: "73%" },
      { label: "Incidents", value: "−48%" },
    ],
    github: "/",
    demo: "/",
    hue: "#9CFFB6",
    pos: { x: "46%", y: "78%", size: 180 },
  },
];

export function ProjectUniverse() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section className="relative min-h-screen px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">// Subsystem 03</div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-[0.2em] sm:text-5xl">
            Project <span className="text-neon">Universe</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Each world is a system I built end to end. Approach to enter.
          </p>
        </div>

        <div className="relative h-[640px] w-full overflow-hidden rounded-2xl border border-neon/15">
          {/* Star dust */}
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/40"
              style={{
                width: Math.random() < 0.85 ? 1 : 2,
                height: Math.random() < 0.85 ? 1 : 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.2,
              }}
            />
          ))}

          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setActive(p)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: p.pos.x, top: p.pos.y, width: p.pos.size, height: p.pos.size }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Aura */}
              <span
                className="absolute inset-0 rounded-full opacity-60 blur-2xl transition group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${p.hue}55, transparent 65%)` }}
              />
              {/* Planet */}
              <span
                className="absolute inset-[20%] rounded-full border"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${p.hue}cc, #050505 70%)`,
                  borderColor: `${p.hue}88`,
                  boxShadow: `inset 0 0 40px ${p.hue}55, 0 0 30px ${p.hue}44`,
                }}
              />
              {/* Orbit ring */}
              <span
                className="absolute inset-0 rounded-full border border-dashed"
                style={{ borderColor: `${p.hue}33` }}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-neon">
                {p.name}
              </span>
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                {p.tag}
              </span>
            </motion.button>
          ))}
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
                    {active.architecture.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-neon">{String(i + 1).padStart(2, "0")}</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
                <Block title="Challenges">
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {active.challenges.map((c) => <li key={c}>— {c}</li>)}
                  </ul>
                </Block>
                <Block title="Engineering decisions">
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {active.decisions.map((c) => <li key={c}>→ {c}</li>)}
                  </ul>
                </Block>
              </div>

              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Stack</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {active.stack.map((s) => (
                    <span key={s} className="rounded border border-neon/30 bg-neon/5 px-2 py-1 text-[10px] uppercase tracking-widest text-neon">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {active.impact.map((m) => (
                  <div key={m.label} className="rounded border border-neon/20 p-3 text-center">
                    <div className="text-2xl font-bold text-neon">{m.value}</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <a href={active.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-neon/40 px-4 py-2 text-xs uppercase tracking-widest text-neon hover:bg-neon/10">
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
                <a href={active.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded bg-neon px-4 py-2 text-xs uppercase tracking-widest text-black hover:opacity-90" style={{ background: "#2323FF" }}>
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
