import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

type Branch = {
  name: string;
  children: string[];
  accent: string;
  panelFill: string;
  panelBorder: string;
};

const branches: Branch[] = [
  {
    name: "Frontend",
    children: ["React", "TypeScript", "Redux", "Tailwind"],
    accent: "#ff4d94",
    panelFill: "#2d121c",
    panelBorder: "rgba(255, 77, 148, 0.45)",
  },
  {
    name: "Backend",
    children: ["Python", "FastAPI", "Node.js", "REST APIs"],
    accent: "#2df5a2",
    panelFill: "#11241d",
    panelBorder: "rgba(45, 245, 162, 0.45)",
  },
  {
    name: "AI",
    children: ["LangChain", "RAG", "ChromaDB", "Gemini API"],
    accent: "#d8a8ff",
    panelFill: "#211633",
    panelBorder: "rgba(216, 168, 255, 0.45)",
  },
  {
    name: "Cloud",
    children: ["Docker", "GCP", "CI/CD"],
    accent: "#4df6ff",
    panelFill: "#0d222b",
    panelBorder: "rgba(77, 246, 255, 0.45)",
  },
  {
    name: "Architecture",
    children: ["System Design", "Async Processing", "Performance"],
    accent: "#ff9a4d",
    panelFill: "#26160f",
    panelBorder: "rgba(255, 154, 77, 0.45)",
  },
];

const W = 1100;
const H = 640;
const ROOT = { x: W / 2, y: 60 };

function branchPos(i: number, total: number) {
  const spread = 0.85;
  const x = W * (0.5 - spread / 2) + (i / (total - 1)) * (W * spread);
  const y = 230;
  return { x, y };
}

function childPos(bx: number, by: number, j: number, total: number) {
  const x = bx - 60 + (j / Math.max(1, total - 1)) * 120;
  const y = by + 110 + j * 60;
  return { x, y };
}

function rootToBranchPath(branchX: number, branchY: number) {
  const midY = (ROOT.y + branchY) / 2;

  if (branchX === ROOT.x) {
    return `M ${ROOT.x} ${ROOT.y} C ${ROOT.x - 42} ${midY}, ${branchX - 42} ${midY}, ${branchX} ${branchY}`;
  }

  return `M ${ROOT.x} ${ROOT.y} C ${ROOT.x} ${midY}, ${branchX} ${midY}, ${branchX} ${branchY}`;
}

export function SkillTree() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section ref={ref} className="relative min-h-screen px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
            // Subsystem 02
          </div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-[0.2em] text-foreground sm:text-5xl">
            Engineering <span className="text-neon">Skill Tree</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            A living branch graph - every node compiled from real-world work.
          </p>
        </motion.div>

        <div className="relative mx-auto" style={{ maxWidth: W }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
            <defs>
              <radialGradient id="root-node-grad">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g key={replayKey}>
              {branches.map((b, i) => {
                const p = branchPos(i, branches.length);
                const d = rootToBranchPath(p.x, p.y);
                return (
                  <motion.path
                    key={`r-${b.name}`}
                    d={d}
                    stroke={b.accent}
                    strokeWidth="3.2"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 1.8,
                      delay: 0.45 + i * 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                );
              })}

              {branches.map((b, i) => {
                const bp = branchPos(i, branches.length);
                return b.children.map((c, j) => {
                  const cp = childPos(bp.x, bp.y, j, b.children.length);
                  const d = `M ${bp.x} ${bp.y} C ${bp.x} ${(bp.y + cp.y) / 2}, ${cp.x} ${(bp.y + cp.y) / 2}, ${cp.x} ${cp.y}`;
                  return (
                    <motion.path
                      key={`c-${b.name}-${c}`}
                      d={d}
                      stroke={b.accent}
                      strokeWidth="2.1"
                      strokeOpacity="0.95"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{
                        duration: 1.15,
                        delay: 1.65 + i * 0.18 + j * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  );
                });
              })}

              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${ROOT.x}px ${ROOT.y}px`, cursor: "pointer" }}
                onClick={() => {
                  if (inView) setReplayKey((value) => value + 1);
                }}
              >
                <circle cx={ROOT.x} cy={ROOT.y} r="22" fill="url(#root-node-grad)" filter="url(#glow)" />
                <circle cx={ROOT.x} cy={ROOT.y} r="34" fill="none" stroke="#ffffff" strokeOpacity="0.7">
                  <animate attributeName="r" values="34;42;34" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.7;0.15;0.7" dur="3s" repeatCount="indefinite" />
                </circle>
                <text x={ROOT.x} y={ROOT.y - 50} textAnchor="middle" fill="#fff" fontSize="11" letterSpacing="3">
                  ENGINEERING JOURNEY
                </text>
              </motion.g>

              {branches.map((b, i) => {
                const p = branchPos(i, branches.length);
                return (
                  <motion.g
                    key={`bn-${b.name}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 0.8,
                      delay: 1.35 + i * 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="16"
                      fill={b.panelFill}
                      stroke={b.accent}
                      strokeWidth="3"
                      filter="url(#glow)"
                    />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                      {b.name[0]}
                    </text>
                    <text x={p.x} y={p.y - 26} textAnchor="middle" fill="#ffffff" fontSize="11" letterSpacing="2">
                      {b.name.toUpperCase()}
                    </text>
                  </motion.g>
                );
              })}

              {branches.map((b, i) => {
                const bp = branchPos(i, branches.length);
                return b.children.map((c, j) => {
                  const cp = childPos(bp.x, bp.y, j, b.children.length);
                  return (
                    <motion.g
                      key={`cn-${b.name}-${c}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{
                        duration: 0.65,
                        delay: 2.3 + i * 0.18 + j * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformOrigin: `${cp.x}px ${cp.y}px` }}
                    >
                      <rect
                        x={cp.x - 56}
                        y={cp.y - 12}
                        width="112"
                        height="24"
                        rx="4"
                        fill={b.panelFill}
                        stroke={b.panelBorder}
                      />
                      <circle cx={cp.x - 44} cy={cp.y} r="4" fill={b.accent}>
                        <animate
                          attributeName="opacity"
                          values="1;0.3;1"
                          dur={`${2 + j * 0.3}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                      <text x={cp.x - 34} y={cp.y + 4} fill="#ffffff" fontSize="10" letterSpacing="1">
                        {c}
                      </text>
                    </motion.g>
                  );
                });
              })}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
