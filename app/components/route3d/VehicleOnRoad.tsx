import { Vehicle } from "~/components/landing/VehicleSVG";
import type { Member } from "~/lib/supabase";
import { memberTier } from "~/lib/tier";
import { tierZone } from "./projection";

interface VehicleOnRoadProps {
  member: Member;
  rank: number;
  registerEl: (id: string, el: HTMLDivElement | null) => void;
  onHover: (id: string | null) => void;
  onTap: (id: string) => void;
}

export function VehicleOnRoad({
  member,
  rank,
  registerEl,
  onHover,
  onTap,
}: VehicleOnRoadProps) {
  const tier = memberTier(member);
  const zone = tierZone(tier);

  return (
    // Wrapper 0x0 positionné par la boucle rAF (translate3d + scale)
    <div
      ref={(el) => registerEl(member.id, el)}
      className="absolute left-0 top-0 will-change-transform"
      style={{ display: "none", width: 0, height: 0 }}
    >
      <div
        className="absolute bottom-0 left-0 -translate-x-1/2 flex flex-col items-center cursor-pointer"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") onHover(member.id);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onTap(member.id);
        }}
      >
        {/* Label : rang + avatar + nom */}
        <div className="flex items-center gap-1.5 bg-bg-darker/85 border border-text-secondary/30 px-2 py-1 mb-2 whitespace-nowrap">
          <span className="font-display text-[10px] text-accent">#{rank}</span>
          <div className="w-5 h-5 rounded-full overflow-hidden border border-accent/50 bg-bg-dark flex-shrink-0">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent font-display text-[9px]">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-body text-[11px] text-text-primary">
            {member.name}
          </span>
        </div>

        {/* Véhicule */}
        <div className="relative w-24 h-24">
          <Vehicle tier={tier} className="w-full h-full" />
          {zone === "route" && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-2.5 rounded-full bg-black/50 blur-[2px]" />
          )}
          {zone === "mer" && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full bg-sky-400/30 blur-[3px]" />
          )}
        </div>
      </div>
    </div>
  );
}
