import { useEffect, useRef } from "react";

/** Layered animated backdrop: aurora blobs + drifting protein-molecule particles + grid + grain. */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const COUNT = Math.min(60, Math.floor((w * h) / 26000));
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // links
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            const o = (1 - d2 / (130 * 130)) * 0.22;
            ctx.strokeStyle = `rgba(74,222,128,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(120,200,255,0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="aurora-blob"
        style={{
          width: 520,
          height: 520,
          left: "-8%",
          top: "-12%",
          background: "radial-gradient(circle, #16a34a, transparent 70%)",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: 560,
          height: 560,
          right: "-10%",
          top: "8%",
          background: "radial-gradient(circle, #0ea5e9, transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: 600,
          height: 600,
          left: "20%",
          bottom: "-20%",
          background: "radial-gradient(circle, #7c3aed, transparent 70%)",
          animationDelay: "-14s",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, transparent 40%, rgba(6,7,13,0.85) 100%)",
        }}
      />
    </div>
  );
}
