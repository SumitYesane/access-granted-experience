import { motion } from "framer-motion";
import { MapPin, Github, Linkedin, FileText, Mail } from "lucide-react";

const links = [
  { label: "GitHub", icon: Github, href: "/" },
  { label: "LinkedIn", icon: Linkedin, href: "/" },
  { label: "Resume", icon: FileText, href: "/" },
  { label: "Contact", icon: Mail, href: "#comm" },
];

export function Header() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4"
    >
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--neon)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--neon)]" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-[0.3em] text-neon">SUMIT</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Full Stack Engineer<span className="mx-2 text-[color:var(--neon)]/40">|</span>AI Builder
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <span className="mr-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3 text-[color:var(--neon)]" /> Pune, India
          </span>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="magnetic group flex items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-xs uppercase tracking-widest text-foreground/80 transition hover:border-neon hover:text-neon"
            >
              <l.icon className="h-3.5 w-3.5 transition group-hover:drop-shadow-[0_0_6px_#2323FF]" />
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {links.slice(0, 3).map((l) => (
            <a key={l.label} href={l.href} className="rounded-md border border-neon/30 p-2 text-neon">
              <l.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
