import { motion } from "framer-motion";

interface StatsGridProps {
  members: number;
  mrr: number;
  projects: number;
  trophies: number;
  delay?: number;
}

function formatMRR(mrr: number): string {
  if (mrr >= 1000000) return `${(mrr / 1000000).toFixed(1)}M€`;
  if (mrr >= 1000) return `${(mrr / 1000).toFixed(mrr % 1000 === 0 ? 0 : 1)}K€`;
  return `${mrr}€`;
}

export function StatsGrid({ members, mrr, projects, trophies, delay = 0 }: StatsGridProps) {
  const stats = [
    { value: members, label: "lanceurs", accent: true },
    { value: formatMRR(mrr), label: "MRR total", accent: false },
    { value: projects, label: "projets", accent: false },
    { value: trophies, label: "trophées", accent: true },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-bg-darker/60 border border-text-secondary/20 p-4 md:p-6 text-center"
        >
          <div
            className={`font-display text-2xl md:text-4xl ${
              stat.accent ? "text-accent" : "text-text-primary"
            }`}
          >
            {stat.value}
          </div>
          <div className="font-body text-xs md:text-sm text-text-secondary uppercase tracking-wider mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
