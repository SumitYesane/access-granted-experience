import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BackgroundField } from "@/components/experience/BackgroundField";
import { BootSequence } from "@/components/experience/BootSequence";
import { GlitchTransition } from "@/components/experience/GlitchTransition";
import { ExperienceLogs } from "@/components/experience/ExperienceLogs";
import { SkillTree } from "@/components/experience/SkillTree";
import { ProjectUniverse } from "@/components/experience/ProjectUniverse";
import { EducationMatrix } from "@/components/education/EducationMatrix";
import { MissionLogs } from "@/components/experience/MissionLogs";
import { CommHub } from "@/components/experience/CommHub";
import { Terminal } from "@/components/experience/Terminal";
import Portfolio from "@/components/portfolio/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SUMIT // ACCESS GRANTED - Engineer / AI Builder" },
      {
        name: "description",
        content:
          "Immersive engineering portfolio and AI systems showcase with a holographic landing experience.",
      },
      { property: "og:title", content: "SUMIT // ACCESS GRANTED" },
      {
        property: "og:description",
        content: "Enter a private AI engineering system with a holographic landing experience.",
      },
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
          <main>
            <Portfolio />
            <ExperienceLogs />
            <SkillTree />
            <ProjectUniverse />
            <EducationMatrix />
            <MissionLogs />
            <CommHub />
          </main>
          <Terminal />
        </motion.div>
      )}
    </div>
  );
}
