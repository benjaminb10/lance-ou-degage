import { motion } from "framer-motion";
import { Vehicle } from "./landing/VehicleSVG";
import type { Member } from "~/lib/supabase";
import { memberTier } from "~/lib/tier";

interface MemberCardProps {
  member: Member;
  rank: number;
  delay?: number;
}

export function formatMRR(mrr: number): string {
  if (mrr === 0) return "0€";
  if (mrr >= 1000)
    return `${(mrr / 1000).toFixed(mrr % 1000 === 0 ? 0 : 1)}K€`;
  return `${mrr}€`;
}

export function MemberCard({ member, rank, delay = 0 }: MemberCardProps) {
  const tier = memberTier(member);
  return (
    <a href={`/membre/${member.id}`}>
      <motion.div
        className="bg-bg-darker/80 border border-text-secondary/20 p-4 md:p-6 hover:border-accent/50 hover:bg-bg-darker transition-all cursor-pointer"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
      >
        {/* Mobile Layout - Vertical */}
        <div className="md:hidden">
          {/* Line 1: Rank + Avatar + Name */}
          <div className="flex items-center gap-3">
            <div className="font-display text-2xl text-accent w-10 text-center flex-shrink-0">
              {rank}
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent/50 flex-shrink-0 bg-bg-dark">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent text-lg font-display">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base text-text-primary">
                {member.name}
              </h3>
              {(member.member_achievements?.length || 0) > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs">🏆</span>
                  <span className="font-body text-xs text-text-secondary">
                    {member.member_achievements?.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line 2: Projects */}
          {member.projects && member.projects.length > 0 && (
            <div className="flex items-center gap-2 mt-2 ml-11 pl-3">
              {member.projects.slice(0, 2).map((project, i) => (
                <span key={project.id} className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (project.url) window.open(project.url, "_blank");
                    }}
                    className="font-body text-sm text-accent hover:text-text-primary transition-colors"
                  >
                    {project.name}
                  </button>
                  {i < Math.min((member.projects?.length || 0), 2) - 1 && (
                    <span className="text-text-secondary text-sm">·</span>
                  )}
                </span>
              ))}
              {(member.projects?.length || 0) > 2 && (
                <span className="text-text-secondary text-xs">
                  +{(member.projects?.length || 0) - 2}
                </span>
              )}
            </div>
          )}

          {/* Line 3: MRR + Vehicle */}
          <div className="flex items-center justify-between mt-3 ml-11 pl-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-text-primary">
                {formatMRR(member.mrr)}
              </span>
              <span className="font-body text-xs text-text-secondary uppercase">
                MRR
              </span>
            </div>
            <div className="w-10 h-10">
              <Vehicle tier={tier} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex items-center gap-6">
          {/* Rank */}
          <div className="font-display text-3xl text-accent w-10 text-center flex-shrink-0">
            {rank}
          </div>

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/50 flex-shrink-0 bg-bg-dark">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent text-xl font-display">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-xl text-text-primary truncate">
                {member.name}
              </h3>
              {(member.member_achievements?.length || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm">🏆</span>
                  <span className="font-body text-sm text-text-secondary">
                    {member.member_achievements?.length}
                  </span>
                </div>
              )}
            </div>
            {/* Projects */}
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {member.projects?.slice(0, 2).map((project, i) => (
                <span key={project.id} className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (project.url) window.open(project.url, "_blank");
                    }}
                    className="font-body text-sm text-accent hover:text-text-primary transition-colors"
                  >
                    {project.name}
                  </button>
                  {i < Math.min((member.projects?.length || 0), 2) - 1 && (
                    <span className="text-text-secondary text-sm">·</span>
                  )}
                </span>
              ))}
              {(member.projects?.length || 0) > 2 && (
                <span className="text-text-secondary text-xs">
                  +{(member.projects?.length || 0) - 2}
                </span>
              )}
            </div>
          </div>

          {/* MRR + Vehicle */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="font-display text-2xl text-text-primary">
                {formatMRR(member.mrr)}
              </div>
              <div className="font-body text-xs text-text-secondary uppercase tracking-wide">
                MRR
              </div>
            </div>
            <div className="w-12 h-12">
              <Vehicle tier={tier} className="w-full h-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </a>
  );
}
