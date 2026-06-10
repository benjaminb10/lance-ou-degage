import { useEffect, useRef } from "react";
import { drawScene } from "~/components/route3d/RoadCanvas";
import type { ZoneSegment } from "~/components/route3d/projection";

// Fond du Hero : même moteur de rendu pixel art que /la-route,
// caméra fixe, zone "route" uniquement, les bandes défilent vers nous.
const ZONES: ZoneSegment[] = [
  { zone: "route", zStart: -Infinity, zEnd: Infinity },
];

export function RoadScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    function resize() {
      if (!container || !canvas || !ctx) return;
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = false;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let stripePhase = 0;
    let raf = 0;
    let last = performance.now();
    let inView = true;

    function frame(t: number) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      // la route vient vers nous : on avance
      stripePhase = (stripePhase + dt * 1.2) % 12;
      if (ctx) {
        // horizon plus bas que /la-route : plus de ciel sombre derrière le texte
        drawScene(ctx, {
          w,
          h,
          cameraZ: 0,
          stripePhase,
          t,
          zones: ZONES,
          horizonRatio: 0.55,
        });
      }
      raf = requestAnimationFrame(frame);
    }

    // n'anime que si le hero est à l'écran et l'onglet visible
    function sync() {
      const shouldRun = inView && document.visibilityState === "visible";
      if (shouldRun && raf === 0) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(container);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Vignette pour la lisibilité du contenu */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 40%,
            var(--color-bg-darker) 100%
          )`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}
