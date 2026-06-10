import type { RefObject } from "react";
import type { TierZone } from "./projection";

interface ZoneBand {
  zone: TierZone;
  from: number; // fraction 0..1 sur la barre
  to: number;
}

// route reste transparente (fond de la barre)
const ZONE_TINT: Record<TierZone, string> = {
  route: "",
  plage: "bg-amber-500/15",
  mer: "bg-sky-500/15",
  ciel: "bg-indigo-500/15",
  espace: "bg-violet-500/15",
};

interface RankIndicatorProps {
  total: number;
  zoneBands?: ZoneBand[];
  markerRef: RefObject<HTMLDivElement | null>;
  labelRef: RefObject<HTMLDivElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onJump: (fraction: number) => void;
}

export function RankIndicator({
  total,
  zoneBands,
  markerRef,
  labelRef,
  onPrev,
  onNext,
  onJump,
}: RankIndicatorProps) {
  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(92%,32rem)] z-[30000]"
      // empêche le drag caméra quand on interagit avec l'indicateur
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={labelRef}
        className="text-center font-display text-xs text-text-primary mb-2"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          aria-label="Membre précédent"
          className="min-w-11 min-h-11 flex items-center justify-center font-display text-sm text-text-secondary border border-text-secondary/30 bg-bg-darker/80 hover:text-accent hover:border-accent transition-colors"
        >
          ◀
        </button>
        <div
          className="relative flex-1 h-3 bg-bg-darker/80 border border-text-secondary/30 cursor-pointer"
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onJump((e.clientX - rect.left) / rect.width);
          }}
        >
          {zoneBands?.map(
            (b, i) =>
              ZONE_TINT[b.zone] &&
              b.to > b.from && (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 pointer-events-none ${ZONE_TINT[b.zone]}`}
                  style={{
                    left: `${(b.from * 100).toFixed(2)}%`,
                    width: `${((b.to - b.from) * 100).toFixed(2)}%`,
                  }}
                />
              )
          )}
          {total > 1 &&
            total <= 60 &&
            [...Array(total)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-text-secondary/30"
                style={{ left: `${(i / (total - 1)) * 100}%` }}
              />
            ))}
          <div
            ref={markerRef}
            className="absolute -top-1 w-2 h-5 bg-accent -translate-x-1/2 pointer-events-none"
            style={{ left: "0%" }}
          />
        </div>
        <button
          onClick={onNext}
          aria-label="Membre suivant"
          className="min-w-11 min-h-11 flex items-center justify-center font-display text-sm text-text-secondary border border-text-secondary/30 bg-bg-darker/80 hover:text-accent hover:border-accent transition-colors"
        >
          ▶
        </button>
      </div>
      <div className="hidden md:flex justify-between font-body text-[10px] text-text-secondary mt-1 px-14">
        <span>leader</span>
        <span>dernier</span>
      </div>
    </div>
  );
}
