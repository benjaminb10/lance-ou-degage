import { motion } from "framer-motion";
import { Vehicle } from "./landing/VehicleSVG";
import type { Member } from "~/lib/supabase";

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
  return (
    <motion.div
      className="bg-bg-darker/80 border border-text-secondary/20 p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:border-accent/50 transition-all"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {/* Rank */}
      <div className="font-display text-2xl md:text-3xl text-accent w-6 md:w-8 text-center flex-shrink-0">
        {rank}
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-accent/50 flex-shrink-0 bg-bg-dark">
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
        <h3 className="font-display text-base md:text-xl text-text-primary truncate">
          {member.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1 mt-1">
          {member.projects?.slice(0, 3).map((project, i) => (
            <span key={project.id} className="flex items-center gap-1">
              <a
                href={project.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs md:text-sm text-accent hover:text-text-primary transition-colors"
              >
                {project.name}
              </a>
              {i < Math.min((member.projects?.length || 0), 3) - 1 && (
                <span className="text-text-secondary">·</span>
              )}
            </span>
          ))}
          {(member.projects?.length || 0) > 3 && (
            <span className="text-text-secondary text-xs">
              +{(member.projects?.length || 0) - 3}
            </span>
          )}
        </div>
      </div>

      {/* MRR + Vehicle */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="text-right">
          <div className="font-display text-lg md:text-2xl text-text-primary">
            {formatMRR(member.mrr)}
          </div>
          <div className="font-body text-[10px] md:text-xs text-text-secondary uppercase tracking-wide">
            MRR
          </div>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12">
          <Vehicle tier={member.tier} className="w-full h-full" />
        </div>
      </div>
    </motion.div>
  );
}
