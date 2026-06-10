import type { Member } from "~/lib/supabase";
import { formatMRR } from "~/components/MemberCard";
import { memberTier, VEHICLE_NAMES } from "~/lib/tier";

interface MemberTooltipProps {
  member: Member;
  rank: number;
}

export function MemberTooltip({ member, rank }: MemberTooltipProps) {
  const trophies = member.member_achievements?.length || 0;

  return (
    <div className="bg-bg-darker border border-accent/50 px-4 py-3 w-56 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent/50 bg-bg-dark flex-shrink-0">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-accent font-display text-sm">
              {member.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-display text-xs text-text-primary truncate">
            {member.name}
          </div>
          <div className="font-body text-[11px] text-text-secondary mt-0.5">
            #{rank} · {VEHICLE_NAMES[memberTier(member)]}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 font-body text-xs text-text-secondary">
        <span>🏆 {trophies}</span>
        <span>
          <span className="text-text-primary font-bold">
            {formatMRR(member.mrr)}
          </span>{" "}
          MRR
        </span>
      </div>

      <a
        href={`/membre/${member.id}`}
        className="block mt-3 text-center font-body text-xs text-accent border border-accent/40 py-1.5 hover:bg-accent/10 transition-colors"
      >
        voir le profil →
      </a>
    </div>
  );
}
