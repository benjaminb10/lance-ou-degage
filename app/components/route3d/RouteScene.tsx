import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Member } from "~/lib/supabase";
import { VEHICLE_NAMES, memberTier } from "~/lib/tier";
import { drawScene } from "./RoadCanvas";
import { VehicleOnRoad } from "./VehicleOnRoad";
import { GhostVehicle } from "./GhostVehicle";
import { MemberTooltip } from "./MemberTooltip";
import { RankIndicator } from "./RankIndicator";
import {
  SPACING,
  VEHICLE_SCALE,
  VIEW_BACK,
  Z_FIRST_OFFSET,
  clamp,
  computeZoneSegments,
  ghostZ,
  laneX,
  maxCameraZ,
  memberZ,
  project,
  tierAltitude,
} from "./projection";

interface RouteSceneProps {
  members: Member[];
}

export function RouteScene({ members }: RouteSceneProps) {
  const total = members.length;
  const tiers = useMemo(() => members.map(memberTier), [members]);
  // Tiers au-dessus du meilleur membre : véhicules fantômes à débloquer
  const ghostTiers = useMemo(() => {
    const maxTier = tiers.length > 0 ? Math.max(...tiers) : -1;
    const out: number[] = [];
    for (let tr = maxTier + 1; tr <= 8; tr++) out.push(tr);
    return out;
  }, [tiers]);
  const zones = useMemo(
    () => computeZoneSegments(tiers, total, ghostTiers),
    [tiers, total, ghostTiers]
  );
  // Bandes de zones pour la barre de progression (fraction 0..1)
  const zoneBands = useMemo(() => {
    const maxZ = maxCameraZ(total, ghostTiers.length);
    if (maxZ <= 0) return [{ zone: zones[0].zone, from: 0, to: 1 }];
    return zones.map((seg) => ({
      zone: seg.zone,
      from: clamp((seg.zStart - VIEW_BACK) / maxZ, 0, 1),
      to: clamp((seg.zEnd - VIEW_BACK) / maxZ, 0, 1),
    }));
  }, [zones, total, ghostTiers]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const vehicleEls = useRef(new Map<string, HTMLDivElement>());

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // Boutons/clavier pilotent la caméra via ce ref (rempli dans l'effet)
  const controls = useRef({
    prev: () => {},
    next: () => {},
    jumpFrac: (_f: number) => {},
  });

  const state = useRef({
    cameraZ: 0,
    targetZ: 0,
    stripePhase: 0,
    w: 0,
    h: 0,
    dragging: false,
    lastY: 0,
    dragDist: 0,
    lastPointerType: "mouse",
    lastLabel: "",
  });

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  const registerEl = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) vehicleEls.current.set(id, el);
    else vehicleEls.current.delete(id);
  }, []);

  const handleHover = useCallback((id: string | null) => {
    window.clearTimeout(closeTimer.current);
    if (id) {
      setHoveredId(id);
    } else {
      closeTimer.current = window.setTimeout(() => setHoveredId(null), 150);
    }
  }, []);

  const handleTap = useCallback((id: string) => {
    const s = state.current;
    if (s.dragDist > 8) return; // c'était un drag, pas un tap
    window.clearTimeout(closeTimer.current);
    setHoveredId((prev) =>
      prev === id && s.lastPointerType !== "mouse" ? null : id
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = state.current;
    const maxZ = maxCameraZ(total, ghostTiers.length);

    function resize() {
      if (!container || !canvas || !ctx) return;
      s.w = container.clientWidth;
      s.h = container.clientHeight;
      canvas.width = s.w;
      canvas.height = s.h;
      ctx.imageSmoothingEnabled = false;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function setTarget(z: number) {
      s.targetZ = clamp(z, 0, maxZ);
    }

    // Index du véhicule actuellement "au focus" selon la caméra
    // (indices négatifs = fantômes au-delà du leader : -1 = premier fantôme)
    function focusIdx(z: number) {
      const fromBack = Math.round((z + VIEW_BACK - Z_FIRST_OFFSET) / SPACING);
      return clamp(total - 1 - fromBack, -ghostTiers.length, total - 1);
    }
    function jumpToIndex(i: number) {
      const idx = clamp(i, -ghostTiers.length, total - 1);
      setTarget(
        (idx >= 0 ? memberZ(idx, total) : ghostZ(-idx - 1, total)) - VIEW_BACK
      );
    }
    controls.current = {
      // prev = vers l'arrière du peloton (rang plus bas)
      prev: () => jumpToIndex(focusIdx(s.targetZ) + 1),
      // next = vers le leader
      next: () => jumpToIndex(focusIdx(s.targetZ) - 1),
      jumpFrac: (f: number) => setTarget(f * maxZ),
    };

    // --- Inputs ---
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      setTarget(s.targetZ + e.deltaY * 0.012);
    }
    container.addEventListener("wheel", onWheel, { passive: false });

    function onPointerDown(e: PointerEvent) {
      s.dragging = true;
      s.lastY = e.clientY;
      s.dragDist = 0;
      s.lastPointerType = e.pointerType;
    }
    function onPointerMove(e: PointerEvent) {
      if (!s.dragging) return;
      const dy = e.clientY - s.lastY;
      s.lastY = e.clientY;
      s.dragDist += Math.abs(dy);
      // drag vers le bas = on tire la route vers soi = on avance
      setTarget(s.targetZ + dy * 0.03);
    }
    function onPointerUp() {
      s.dragging = false;
    }
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        controls.current.next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        controls.current.prev();
      }
    }
    window.addEventListener("keydown", onKey);

    // --- Boucle d'animation ---
    let raf = 0;
    let last = performance.now();

    function frame(t: number) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;

      s.cameraZ += (s.targetZ - s.cameraZ) * Math.min(1, dt * 7);
      // les bandes défilent en continu, même sans interaction
      s.stripePhase = (s.stripePhase + dt * 1.2) % 12;

      if (ctx) {
        drawScene(ctx, {
          w: s.w,
          h: s.h,
          cameraZ: s.cameraZ,
          stripePhase: s.stripePhase,
          t,
          zones,
        });
      }

      // Position des véhicules (impératif, zéro re-render React)
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const el = vehicleEls.current.get(m.id);
        if (!el) continue;
        const p = project(
          laneX(i),
          tierAltitude(tiers[i]),
          memberZ(i, total),
          s.cameraZ,
          s.w,
          s.h
        );
        if (!p.visible) {
          el.style.display = "none";
          continue;
        }
        el.style.display = "";
        const sc = clamp(p.scale * VEHICLE_SCALE, 0.08, 2.6);
        const bobAmp = tiers[i] >= 7 ? 6 : tiers[i] >= 5 ? 4 : 2;
        const bob = Math.sin(t / 450 + i * 1.7) * bobAmp * sc;
        el.style.transform = `translate3d(${p.x}px, ${p.y + bob}px, 0) scale(${sc})`;
        el.style.zIndex = String(Math.max(1, 20000 - Math.round(p.dz * 100)));
      }

      // Position des véhicules fantômes (au-delà du leader)
      for (let g = 0; g < ghostTiers.length; g++) {
        const tier = ghostTiers[g];
        const el = vehicleEls.current.get(`ghost-${tier}`);
        if (!el) continue;
        const p = project(
          laneX(total + g),
          tierAltitude(tier),
          ghostZ(g, total),
          s.cameraZ,
          s.w,
          s.h
        );
        if (!p.visible) {
          el.style.display = "none";
          continue;
        }
        el.style.display = "";
        const sc = clamp(p.scale * VEHICLE_SCALE, 0.08, 2.6);
        const bobAmp = tier >= 7 ? 6 : tier >= 5 ? 4 : 2;
        const bob = Math.sin(t / 450 + (total + g) * 1.7) * bobAmp * sc;
        el.style.transform = `translate3d(${p.x}px, ${p.y + bob}px, 0) scale(${sc})`;
        el.style.zIndex = String(Math.max(1, 20000 - Math.round(p.dz * 100)));
      }

      // Tooltip suit le véhicule survolé
      const hid = hoveredIdRef.current;
      if (hid && tooltipRef.current) {
        const i = members.findIndex((m) => m.id === hid);
        if (i >= 0) {
          const p = project(
            laneX(i),
            tierAltitude(tiers[i]),
            memberZ(i, total),
            s.cameraZ,
            s.w,
            s.h
          );
          const sc = clamp(p.scale * VEHICLE_SCALE, 0.08, 2.6);
          const x = clamp(p.x, 120, Math.max(120, s.w - 120));
          const y = Math.max(16, p.y - 140 * sc - 8);
          tooltipRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      }

      // Marqueur + label de progression
      if (markerRef.current) {
        const frac = maxZ > 0 ? s.cameraZ / maxZ : 0;
        markerRef.current.style.left = `${(frac * 100).toFixed(2)}%`;
      }
      if (labelRef.current) {
        const fi = focusIdx(s.cameraZ);
        const lbl =
          fi >= 0
            ? `#${fi + 1} / ${total}`
            : `à débloquer : ${VEHICLE_NAMES[ghostTiers[-fi - 1]]}`;
        if (s.lastLabel !== lbl) {
          s.lastLabel = lbl;
          labelRef.current.textContent = lbl;
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(closeTimer.current);
    };
  }, [members, tiers, total, zones, ghostTiers]);

  const hoveredIndex = hoveredId
    ? members.findIndex((m) => m.id === hoveredId)
    : -1;
  const hoveredMember = hoveredIndex >= 0 ? members[hoveredIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ touchAction: "none", overscrollBehavior: "contain" }}
      onClick={() => {
        if (state.current.dragDist < 8) handleHover(null);
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Véhicules des membres */}
      {members.map((m, i) => (
        <VehicleOnRoad
          key={m.id}
          member={m}
          rank={i + 1}
          registerEl={registerEl}
          onHover={handleHover}
          onTap={handleTap}
        />
      ))}

      {/* Véhicules à débloquer (personne dessus) */}
      {ghostTiers.map((tr) => (
        <GhostVehicle key={`ghost-${tr}`} tier={tr} registerEl={registerEl} />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(15,13,11,0.55) 100%)",
        }}
      />

      {/* Tooltip */}
      {hoveredMember && (
        <div
          ref={tooltipRef}
          className="absolute left-0 top-0 z-[25000]"
          style={{ transform: "translate3d(-9999px, 0, 0)" }}
          onPointerEnter={() => handleHover(hoveredMember.id)}
          onPointerLeave={() => handleHover(null)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="-translate-x-1/2 -translate-y-full">
            <MemberTooltip member={hoveredMember} rank={hoveredIndex + 1} />
          </div>
        </div>
      )}

      {/* Indicateur de classement + navigation */}
      <RankIndicator
        total={total}
        zoneBands={zoneBands}
        markerRef={markerRef}
        labelRef={labelRef}
        onPrev={() => controls.current.prev()}
        onNext={() => controls.current.next()}
        onJump={(f) => controls.current.jumpFrac(f)}
      />
    </div>
  );
}
