import { motion } from "framer-motion";

const fragments = Array.from({ length: 18 });

export function GlitchTransition({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      onAnimationComplete={onDone}
    >
      {/* Flashing strips */}
      {fragments.map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 bg-[color:var(--neon)]/20"
          style={{ top: `${(i / fragments.length) * 100}%`, height: `${100 / fragments.length}%` }}
          initial={{ x: 0, opacity: 0 }}
          animate={{
            x: [0, (i % 2 ? 1 : -1) * 80, 0],
            opacity: [0, 0.9, 0],
            backgroundColor: ["rgba(35,35,255,0.2)", "rgba(255,255,255,0.05)", "rgba(35,35,255,0.0)"],
          }}
          transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
      {/* Particle burst */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const dist = 400 + Math.random() * 400;
        return (
          <motion.span
            key={`p-${i}`}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[color:var(--neon)]"
            style={{ boxShadow: "0 0 12px #2323FF" }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        );
      })}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <span
          className="glitch text-3xl font-black uppercase tracking-[0.4em] text-neon sm:text-5xl"
          style={{ textShadow: "0 0 30px #2323FF" }}
        >
          ░ Decompiling ░
        </span>
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      />
    </motion.div>
  );
}
