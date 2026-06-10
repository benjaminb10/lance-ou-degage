import { Vehicle } from "~/components/landing/VehicleSVG";
import { VEHICLE_NAMES } from "~/lib/tier";

// Condition de déblocage affichée par tier
export const UNLOCK_LABELS: Record<number, string> = {
  1: "1 trophée",
  2: "3 trophées",
  3: "5 trophées",
  4: "8 trophées",
  5: "11 trophées",
  6: "5K€ MRR",
  7: "10K€ MRR",
  8: "20K€ MRR",
};

interface GhostVehicleProps {
  tier: number;
  registerEl: (key: string, el: HTMLDivElement | null) => void;
}

// Véhicule à débloquer : personne dessus, affiché estompé au-delà du leader
export function GhostVehicle({ tier, registerEl }: GhostVehicleProps) {
  return (
    // Wrapper 0x0 positionné par la boucle rAF (translate3d + scale)
    <div
      ref={(el) => registerEl(`ghost-${tier}`, el)}
      className="absolute left-0 top-0 will-change-transform pointer-events-none"
      style={{ display: "none", width: 0, height: 0 }}
    >
      <div className="absolute bottom-0 left-0 -translate-x-1/2 flex flex-col items-center">
        {/* Vignette : place libre + condition de déblocage */}
        <div className="flex flex-col items-center bg-bg-darker/85 border border-dashed border-text-secondary/40 px-2 py-1 mb-2 whitespace-nowrap">
          <span className="font-body text-[10px] text-text-secondary">
            personne ici — place libre
          </span>
          <span className="font-display text-[10px] text-accent">
            {VEHICLE_NAMES[tier]} · {UNLOCK_LABELS[tier]}
          </span>
        </div>

        {/* Véhicule estompé */}
        <div className="relative w-24 h-24 opacity-40 grayscale">
          <Vehicle tier={tier} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
