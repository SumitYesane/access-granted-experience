import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, FileText, Mail, MapPin, ChevronDown } from "lucide-react";
import "./portfolio.css";
import brainImg from "@/assets/pf-brain.png";
import robotImg from "@/assets/pf-robot.png";
import cloudImg from "@/assets/pf-cloud.png";
import matrixImg from "@/assets/pf-matrix.jpg";
import codeImg from "@/assets/pf-code.jpg";

const PortfolioScene = lazy(() => import("./PortfolioScene"));

const cubes = [
  { img: robotImg, text: "Research Agents", pos: "pf-cube-1" },
  { img: cloudImg, text: "AI Applications", pos: "pf-cube-2" },
  { img: matrixImg, text: "Full-Stack Infrastructure", pos: "pf-cube-3" },
  { img: codeImg, text: "Core Innovation & R&D", pos: "pf-cube-4" },
];

const codeSnippet = `def neural_net(x):
  w = init_weights()
  h = relu(x @ w1 + b1)
  y = softmax(h @ w2 + b2)
  return y

model.train(epochs=100)
# accuracy: 0.9842`;

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="pf-root">
      <span className="pf-corner tl" />
      <span className="pf-corner tr" />
      <span className="pf-corner bl" />
      <span className="pf-corner br" />

      {mounted && (
        <Suspense fallback={null}>
          <div className="pf-canvas">
            <PortfolioScene />
          </div>
        </Suspense>
      )}

      <motion.img
        src={brainImg}
        alt=""
        aria-hidden
        className="pf-brain"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ delay: 0.8, duration: 1.4 }}
      />

      <motion.pre
        className="pf-code-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        {codeSnippet}
      </motion.pre>

      <div className="pf-overlay">
        <motion.nav
          className="pf-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="pf-brand">
            <div className="pf-brand-title">
              <span className="pf-brand-dot" />
              AI/ML ENGINEER // PORTFOLIO
            </div>
            <div className="pf-brand-sub">MACHINE LEARNING | DEEP LEARNING BUILDER</div>
          </div>
          <div className="pf-nav-links">
            <a className="pf-nav-link" href="#location">
              <MapPin /> <span>Pune, India</span>
            </a>
            <a className="pf-nav-link" href="#github">
              <Github /> <span>Github</span>
            </a>
            <a className="pf-nav-link" href="#linkedin">
              <Linkedin /> <span>LinkedIn</span>
            </a>
            <a className="pf-nav-link" href="#resume">
              <FileText /> <span>Resume</span>
            </a>
            <a className="pf-nav-link" href="#contact">
              <Mail /> <span>Contact</span>
            </a>
          </div>
        </motion.nav>

        <div className="pf-cubes">
          {cubes.map((c, i) => (
            <motion.div
              key={c.text}
              className={`pf-cube ${c.pos}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + i * 0.18, duration: 0.7 }}
            >
              <div className="pf-cube-frame">
                <span className="pf-cube-tick tl" />
                <span className="pf-cube-tick tr" />
                <span className="pf-cube-tick bl" />
                <span className="pf-cube-tick br" />
                <img src={c.img} alt={c.text} className="pf-cube-img" loading="lazy" />
                <div className="pf-cube-scan" />
              </div>
              <div className="pf-cube-label">{c.text}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pf-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="pf-scroll-bar">Scroll to traverse</div>
          <div className="pf-chev">
            <ChevronDown />
            <ChevronDown />
          </div>
        </motion.div>

        <div className="pf-hud-frame" aria-hidden />
      </div>
    </div>
  );
}
