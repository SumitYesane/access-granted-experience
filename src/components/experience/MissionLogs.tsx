import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Lock, Unlock } from "lucide-react";

const missions = [
  {
    id: "01",
    title: "Frontend Explorer",
    classified: "REACT // INTERFACE LAYER",
    challenge: "Ship interfaces that didn't just work — they had to feel intentional.",
    action: "Built component systems, animation primitives and accessibility patterns across 4 products.",
    impact: "Cut UI bug reports by 38%, onboarded 3 engineers using the same primitives.",
    growth: "Learned that the smallest detail (focus rings, easing) is the difference between cheap and crafted.",
  },
  {
    id: "02",
    title: "Full Stack Ownership",
    classified: "API // CONTRACT // UI",
    challenge: "Stop throwing tickets over the wall. Own features end-to-end.",
    action: "Designed schemas, wrote APIs, shipped UIs, monitored prod incidents.",
    impact: "Feature lead-time dropped from weeks to days; ownership unblocked the team.",
    growth: "Speed comes from removing handoffs, not from typing faster.",
  },
  {
    id: "03",
    title: "Performance Optimization",
    classified: "LATENCY // PROFILER",
    challenge: "App felt heavy. CLS, INP, and TTFB were all in the red.",
    action: "Profiled, batched, deferred, virtualized, prefetched. Killed two SDKs.",
    impact: "p75 INP cut 4×. Bounce rate down 22%.",
    growth: "Performance is a product feature, not a backlog ticket.",
  },
  {
    id: "04",
    title: "AI Systems Journey",
    classified: "RAG // AGENTS // EVAL",
    challenge: "Move beyond prompt-hacking into production-grade AI systems.",
    action: "Built RAG pipelines, eval harnesses, agent loops and cost guardrails.",
    impact: "Two AI products shipped; one saved a client 40+ hrs/week.",
    growth: "LLMs are components, not magic. Discipline beats demos.",
  },
];

export function MissionLogs() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">// Subsystem 04</div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-[0.2em] sm:text-5xl">
            Mission <span className="text-neon">Logs</span>
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Declassified records. Open a file to read the brief.
          </p>
        </div>

        <div className="space-y-3">
          {missions.map((m) => {
            const isOpen = open === m.id;
            return (
              <motion.div
                key={m.id}
                layout
                className="overflow-hidden rounded border border-neon/15 bg-black/40"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-neon/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.4em] text-muted-foreground">FILE</span>
                    <span className="text-lg font-bold text-neon">{m.id}</span>
                    <span className="font-semibold uppercase tracking-[0.2em]">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="hidden sm:inline">{m.classified}</span>
                    {isOpen ? <Unlock className="h-4 w-4 text-neon" /> : <Lock className="h-4 w-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <div className="grid gap-4 border-t border-neon/15 px-5 py-5 sm:grid-cols-2">
                        {[
                          ["Challenge", m.challenge],
                          ["Action", m.action],
                          ["Impact", m.impact],
                          ["Growth", m.growth],
                        ].map(([label, body]) => (
                          <div key={label}>
                            <div className="text-[10px] uppercase tracking-[0.4em] text-neon/80">{label}</div>
                            <p className="mt-1 text-sm text-foreground/85">{body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}