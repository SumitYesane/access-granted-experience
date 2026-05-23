import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Line = { text: string; tone?: "out" | "in" | "ok" | "warn" };

const facts = [
  "Sumit once debugged a prod incident from a moving train. The trains in India do have wifi, sometimes.",
  "Sumit's first 'AI app' was a Markov chain that wrote terrible haiku in 2019.",
  "Coffee → Code → Commit. In that exact order.",
  "Personal record: 11 PRs merged in a single day, zero rollbacks.",
  "Refactors >>> rewrites. Always.",
];

function format(input: string): Line[] {
  const cmd = input.trim().toLowerCase();
  switch (cmd) {
    case "hire sumit":
    case "hire":
      return [
        { text: "[protocol] recruiter_mode → activated", tone: "ok" },
        { text: "Available for: senior engineering, AI systems, founding eng." },
        { text: "Ping → sumit@example.com" },
      ];
    case "coffee":
      return [
        { text: "[energy] +100  ☕  espresso pulled", tone: "ok" },
        { text: "Productivity multiplier engaged." },
      ];
    case "whoami":
      return [
        { text: "name        : sumit" },
        { text: "role        : full stack engineer / ai builder" },
        { text: "location    : pune, india" },
        { text: "years       : 4" },
        { text: "currently   : exploring ai systems" },
        { text: "motto       : ship calm, sharp software." },
      ];
    case "help":
    case "?":
      return [
        { text: "available commands:" },
        { text: "  hire sumit   — initiate recruiter protocol" },
        { text: "  coffee       — restore energy" },
        { text: "  whoami       — engineer summary" },
        { text: "  fact         — random engineering fact" },
        { text: "  clear        — wipe terminal" },
      ];
    case "fact":
      return [{ text: facts[Math.floor(Math.random() * facts.length)] }];
    case "":
      return [];
    default:
      return [{ text: `command not found: ${input}. try 'help'.`, tone: "warn" }];
  }
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { text: "secure shell // sumit@system ~ $", tone: "ok" },
    { text: "type 'help' for commands. press ESC or ` to close.", tone: "out" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const buffer = useRef("");

  useEffect(() => {
    const triggers = ["hire sumit", "coffee", "whoami"];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" || (e.key === "Escape" && open)) {
        e.preventDefault();
        setOpen((v) => !v);
        buffer.current = "";
        return;
      }
      if (open) return;
      if (e.key.length === 1) buffer.current = (buffer.current + e.key).slice(-32);
      if (e.key === "Backspace") buffer.current = buffer.current.slice(0, -1);
      const b = buffer.current.toLowerCase();
      const hit = triggers.find((t) => b.endsWith(t));
      if (hit) {
        buffer.current = "";
        setOpen(true);
        setTimeout(() => runCommand(hit), 220);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [lines]);

  // Double-click background → random fact
  useEffect(() => {
    const onDbl = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("button,a,input,[data-no-fact]")) return;
      setOpen(true);
      setTimeout(() => runCommand("fact"), 200);
    };
    window.addEventListener("dblclick", onDbl);
    return () => window.removeEventListener("dblclick", onDbl);
  }, []);

  function runCommand(cmd: string) {
    if (cmd.trim() === "clear") {
      setLines([]);
      return;
    }
    const out = format(cmd);
    setLines((prev) => [...prev, { text: `~ $ ${cmd}`, tone: "in" }, ...out]);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded border border-neon/40 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-neon backdrop-blur hover:bg-neon/10 md:inline-flex"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--neon)]" />
        ~ shell  · press `
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 left-1/2 z-[80] w-[min(680px,calc(100vw-2rem))] -translate-x-1/2"
            data-no-fact
          >
            <div className="glass overflow-hidden rounded-lg shadow-[var(--neon-glow)]">
              <div className="flex items-center justify-between border-b border-neon/15 px-3 py-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neon">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--neon)]" />
                  sumit@system : ~/secure-shell
                </div>
                <button onClick={() => setOpen(false)} className="text-[10px] text-muted-foreground hover:text-neon">close</button>
              </div>
              <div ref={listRef} className="max-h-64 overflow-y-auto px-4 py-3 font-mono text-xs">
                {lines.map((l, i) => (
                  <div
                    key={i}
                    className={
                      l.tone === "ok" ? "text-neon"
                        : l.tone === "in" ? "text-foreground"
                        : l.tone === "warn" ? "text-red-400"
                        : "text-foreground/80"
                    }
                  >
                    {l.text}
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); runCommand(input); setInput(""); }}
                className="flex items-center gap-2 border-t border-neon/15 px-3 py-2"
              >
                <span className="text-neon">~ $</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none"
                  placeholder="try: hire sumit · coffee · whoami · fact"
                  autoComplete="off"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}