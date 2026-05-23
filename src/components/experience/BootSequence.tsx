import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const scans = [
  { label: "Identity verification", target: 100 },
  { label: "Loading AI modules", target: 100 },
  { label: "Decrypting engineering profile", target: 100 },
  { label: "Loading memory systems", target: 100 },
  { label: "Preparing secure environment", target: 100 },
];

function Bar({ value, width = 22 }: { value: number; width?: number }) {
  const filled = Math.round((value / 100) * width);
  return (
    <span className="text-neon">
      {"█".repeat(filled)}
      <span className="text-muted-foreground">{"░".repeat(width - filled)}</span>
    </span>
  );
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); // 0 warning, 1 scan, 2 granted, 3 done
  const [progress, setProgress] = useState<number[]>(scans.map(() => 0));

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (stage !== 1) return;
    let raf = 0;
    const start = performance.now();
    const total = 3200;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setProgress(
        scans.map((_, i) => {
          const offset = i * 0.12;
          const local = Math.max(0, Math.min(1, (p - offset) / (1 - offset)));
          const eased = 1 - Math.pow(1 - local, 2.5);
          return Math.round(eased * 100);
        })
      );
      if (p < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => setStage(2), 400);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  useEffect(() => {
    if (stage !== 2) return;
    const t = setTimeout(() => {
      setStage(3);
      setTimeout(onComplete, 900);
    }, 1400);
    return () => clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="warn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="mb-4 inline-block border border-red-500/60 px-3 py-1 text-[10px] uppercase tracking-[0.5em] text-red-400">
              ⚠ Warning
            </div>
            <h1 className="glitch text-3xl font-bold uppercase tracking-[0.3em] text-red-400 sm:text-5xl">
              Unauthorized access detected
            </h1>
            <p className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <span className="inline-block animate-pulse">Initializing secure environment...</span>
            </p>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl space-y-3 font-mono text-xs sm:text-sm"
          >
            <div className="mb-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              [system] running diagnostic
            </div>
            {scans.map((s, i) => (
              <div key={s.label} className="flex items-center justify-between gap-4">
                <span className="truncate text-foreground/80">{s.label}</span>
                <span className="flex items-center gap-3">
                  <Bar value={progress[i]} />
                  <span className="w-8 text-right text-neon">{progress[i]}%</span>
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {stage >= 2 && (
          <motion.div
            key="granted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.6, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center"
          >
            <div className="mb-3 text-[10px] uppercase tracking-[0.6em] text-muted-foreground">
              Clearance level — ENGINEER
            </div>
            <h1
              className="text-5xl font-black uppercase tracking-[0.25em] text-neon sm:text-7xl"
              style={{ textShadow: "0 0 32px rgba(57,255,20,0.8), 0 0 80px rgba(57,255,20,0.4)" }}
            >
              Access Granted
            </h1>
            <div className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-foreground/70">
              <span className="h-1 w-1 animate-ping rounded-full bg-[color:var(--neon)]" />
              Welcome to the system
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}