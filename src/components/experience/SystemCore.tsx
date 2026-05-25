import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const orbits = [
  { label: "Experience", value: "4 Years", angle: 0, r: 240 },
  { label: "Focus", value: "Full Stack + AI", angle: 90, r: 280 },
  { label: "Current Mode", value: "Exploring AI Systems", angle: 180, r: 240 },
  { label: "Projects Built", value: "__count__", angle: 270, r: 280 },
];

function useCount(target: number, ms = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

export function SystemCore() {
  const count = useCount(23);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const tx = useTransform(sx, (v) => v * 20);
  const ty = useTransform(sy, (v) => v * 20);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-28">
      <motion.div style={{ x: tx, y: ty }} className="relative">
        {/* Halo */}
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(35,35,255,0.35), transparent 60%)" }}
        />
        {/* Rings */}
        {[260, 320, 380].map((r, i) => (
          <motion.div
            key={r}
            className="absolute left-1/2 top-1/2 rounded-full border border-neon/20"
            style={{ width: r * 2, height: r * 2, x: -r, y: -r }}
            animate={{ rotate: i % 2 ? -360 : 360 }}
            transition={{ duration: 60 + i * 20, ease: "linear", repeat: Infinity }}
          >
            <span
              className="absolute h-1.5 w-1.5 rounded-full bg-[color:var(--neon)]"
              style={{ top: -3, left: "50%", background: "#2323FF", boxShadow: "0 0 12px #2323FF" }}
            />
          </motion.div>
        ))}
        {/* Center */}
        <div className="relative z-10 text-center">
          <div className="mb-3 text-[10px] uppercase tracking-[0.6em] text-muted-foreground">
            System Core // Operator
          </div>
          <h1
            className="text-6xl font-black uppercase tracking-[0.18em] text-neon sm:text-8xl"
            style={{ textShadow: "0 0 40px rgba(35,35,255,0.6)" }}
          >
            SUMIT
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm text-foreground/70">
            Building systems, products and AI experiences.
          </p>
        </div>

        {/* Orbiting cards */}
        {orbits.map((o, i) => {
          const rad = (o.angle * Math.PI) / 180;
          const x = Math.cos(rad) * o.r;
          const y = Math.sin(rad) * o.r * 0.55;
          return (
            <motion.div
              key={o.label}
              className="glass absolute left-1/2 top-1/2 w-56 rounded-lg px-4 py-3 text-left shadow-[var(--neon-glow)]"
              style={{ x: x - 112, y: y - 32 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [y - 32, y - 28, y - 32],
              }}
              transition={{
                opacity: { delay: 0.2 + i * 0.15, duration: 0.6 },
                scale: { delay: 0.2 + i * 0.15, duration: 0.6 },
                y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.05, borderColor: "rgba(35,35,255,0.7)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{o.label}</div>
              <div className="mt-1 text-base font-bold text-neon">
                {o.value === "__count__" ? `${count}+` : o.value}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
      >
        ↓ Scroll to traverse
      </motion.div>
    </section>
  );
}
