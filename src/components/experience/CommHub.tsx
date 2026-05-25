import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText } from "lucide-react";

const nodes = [
  { label: "GitHub", icon: Github, href: "/", x: 50, y: 18 },
  { label: "LinkedIn", icon: Linkedin, href: "/", x: 18, y: 62 },
  { label: "Mail", icon: Mail, href: "#comm", x: 82, y: 62 },
  { label: "Resume", icon: FileText, href: "/", x: 50, y: 94 },
];

export function CommHub() {
  return (
    <section id="comm" className="relative min-h-screen px-6 py-32">
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">// Channel open</div>
        <h2 className="mt-3 text-3xl font-bold uppercase tracking-[0.2em] sm:text-5xl">
          Interested in building <span className="text-neon">something meaningful?</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Pick a channel. Signal is live.
        </p>

        <div className="relative mx-auto mt-12 aspect-square w-full max-w-xl">
          {/* Concentric rings */}
          {[1, 2, 3].map((r) => (
            <motion.span
              key={r}
              className="absolute inset-0 m-auto rounded-full border border-neon/25"
              style={{ width: `${r * 30}%`, height: `${r * 30}%`, left: 0, right: 0, top: 0, bottom: 0 }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3 + r, repeat: Infinity, delay: r * 0.4 }}
            />
          ))}

          {/* Core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border border-neon"
              style={{ background: "radial-gradient(circle, #2323FF55, transparent 70%)", boxShadow: "var(--neon-glow)" }}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-neon">SIGNAL</span>
            </div>
          </div>

          {/* Nodes */}
          {nodes.map((n) => (
            <a
              key={n.label}
              href={n.href}
              target={n.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {/* Connection line via pseudo SVG line not needed — use a thin div */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="glass flex h-16 w-16 items-center justify-center rounded-full border-neon/40 transition group-hover:border-neon">
                  <n.icon className="h-5 w-5 text-neon" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/80 group-hover:text-neon">{n.label}</span>
                <span className="pointer-events-none absolute -bottom-2 h-px w-16 origin-left scale-x-0 bg-[color:var(--neon)] transition-transform duration-500 group-hover:scale-x-100" />
              </motion.div>
            </a>
          ))}

          {/* Pulse beams */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {nodes.map((n, i) => (
              <line
                key={i}
                x1="50%" y1="50%"
                x2={`${n.x}%`} y2={`${n.y}%`}
                stroke="#2323FF" strokeOpacity="0.18" strokeDasharray="4 6"
              />
            ))}
          </svg>
        </div>

        <div className="mt-16 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
          End of transmission · Built by SUMIT · MMXXVI
        </div>
      </div>
    </section>
  );
}
