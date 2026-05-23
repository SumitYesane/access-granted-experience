import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BackgroundField } from "@/components/experience/BackgroundField";
import { BootSequence } from "@/components/experience/BootSequence";
import { GlitchTransition } from "@/components/experience/GlitchTransition";
import { Header } from "@/components/experience/Header";
import { SystemCore } from "@/components/experience/SystemCore";
import { SkillTree } from "@/components/experience/SkillTree";
import { ProjectUniverse } from "@/components/experience/ProjectUniverse";
import { MissionLogs } from "@/components/experience/MissionLogs";
import { CommHub } from "@/components/experience/CommHub";
import { Terminal } from "@/components/experience/Terminal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SUMIT // ACCESS GRANTED — Engineer / AI Builder" },
      {
        name: "description",
        content:
          "Not a portfolio — a secure system to enter. Full-stack engineer and AI builder based in Pune, India.",
      },
      { property: "og:title", content: "SUMIT // ACCESS GRANTED" },
      { property: "og:description", content: "Enter a private AI engineering system." },
    ],
  }),
  component: Index,
});

type Phase = "boot" | "glitch" | "main";

function Index() {
  const [phase, setPhase] = useState<Phase>("boot");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-foreground">
      <BackgroundField intensity={phase === "main" ? 1 : 0.6} />

      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <motion.div key="boot" exit={{ opacity: 0 }}>
            <BootSequence onComplete={() => setPhase("glitch")} />
          </motion.div>
        )}
        {phase === "glitch" && (
          <GlitchTransition key="glitch" onDone={() => setPhase("main")} />
        )}
      </AnimatePresence>

      {phase === "main" && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <Header />
          <main>
            <SystemCore />
            <SkillTree />
            <ProjectUniverse />
            <MissionLogs />
            <CommHub />
          </main>
          <Terminal />
        </motion.div>
      )}
    </div>
  );
}
