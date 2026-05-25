import { useEffect, useRef } from "react";

/**
 * Living background: particle nodes + neural connections + scan sweep + parallax to mouse.
 * Single canvas, throttled, pauses when tab hidden.
 */
export function BackgroundField({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const bgBlue = { r: 35, g: 35, b: 255 };

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const NODES = Math.floor(70 * intensity);
    const nodes = Array.from({ length: NODES }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      r: Math.random() * 1.4 + 0.4,
      p: Math.random() * Math.PI * 2,
    }));
    const packets: { from: number; to: number; t: number }[] = [];

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5);
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);

    let scan = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.04;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      // subtle vignette grid base
      ctx.fillStyle = "rgba(5,5,5,0.4)";
      ctx.fillRect(0, 0, w, h);

      const ox = mouse.current.x * 18;
      const oy = mouse.current.y * 18;

      // update nodes
      for (const n of nodes) {
        n.x += n.vx * dt; n.y += n.vy * dt; n.p += dt * 0.002;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      // connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x * w + ox, ay = a.y * h + oy;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const bx = b.x * w + ox, by = b.y * h + oy;
          const dx = ax - bx, dy = ay - by;
          const d2 = dx * dx + dy * dy;
          const max = 150 * 150;
          if (d2 < max) {
            const alpha = (1 - d2 / max) * 0.22;
            ctx.strokeStyle = `rgba(${bgBlue.r},${bgBlue.g},${bgBlue.b},${alpha})`;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
            if (Math.random() < 0.00008 * intensity) packets.push({ from: i, to: j, t: 0 });
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const x = n.x * w + ox, y = n.y * h + oy;
        const pulse = 0.6 + Math.sin(n.p) * 0.4;
        ctx.fillStyle = `rgba(${bgBlue.r},${bgBlue.g},${bgBlue.b},${0.35 + pulse * 0.25})`;
        ctx.beginPath(); ctx.arc(x, y, n.r * (0.9 + pulse * 0.3), 0, Math.PI * 2); ctx.fill();
      }

      // data packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]; p.t += dt * 0.0012;
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        const a = nodes[p.from], b = nodes[p.to];
        const x = (a.x + (b.x - a.x) * p.t) * w + ox;
        const y = (a.y + (b.y - a.y) * p.t) * h + oy;
        ctx.fillStyle = "rgba(145,145,255,0.95)";
        ctx.shadowBlur = 12; ctx.shadowColor = "#2323FF";
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // scan sweep
      scan += dt * 0.06;
      const sy = (scan % (h + 200)) - 100;
      const grad = ctx.createLinearGradient(0, sy - 60, 0, sy + 60);
      grad.addColorStop(0, "rgba(35,35,255,0)");
      grad.addColorStop(0.5, "rgba(35,35,255,0.05)");
      grad.addColorStop(1, "rgba(35,35,255,0)");
      ctx.fillStyle = grad; ctx.fillRect(0, sy - 60, w, 120);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={ref} className="h-full w-full" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="scanlines absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(35,35,255,0.08), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(35,35,255,0.05), transparent 60%)",
        }}
      />
    </div>
  );
}
