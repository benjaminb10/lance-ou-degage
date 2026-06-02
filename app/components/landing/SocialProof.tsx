import { motion } from "framer-motion";
import { Vehicle } from "./VehicleSVG";

// Fondateurs actifs
const founders = [
  {
    name: "Benjamin Benoudis",
    avatar: "/founders/benjamin-benoudis.png",
    projects: [
      { name: "BeReach.ai", url: "https://bereach.ai" },
      { name: "Viewlify.app", url: "https://www.viewlify.app" },
      { name: "lance-ou-degage.fr", url: "https://www.lance-ou-degage.fr" },
    ],
    mrr: 3500,
    tier: 2, // Moto
  },
  {
    name: "Alexandre Sarfati",
    avatar: "/founders/alexandre-sarfati.png",
    projects: [
      { name: "PIMMS.io", url: "https://pimms.io" },
      { name: "BeReach.ai", url: "https://bereach.ai" },
    ],
    mrr: 3500,
    tier: 2, // Moto
  },
  {
    name: "Axel Briche",
    avatar: "/founders/axel-briche.png",
    projects: [
      { name: "Tailwind2Landing", url: "https://tailwind2landing.com" },
    ],
    mrr: 0,
    tier: 0, // Trottinette
  },
];

function formatMRR(mrr: number): string {
  if (mrr === 0) return "0€";
  if (mrr >= 1000) return `${(mrr / 1000).toFixed(mrr % 1000 === 0 ? 0 : 1)}K€`;
  return `${mrr}€`;
}

export function SocialProof() {
  return (
    <section className="relative py-32 px-4 bg-bg-dark overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
        style={{ background: "var(--color-accent-glow)", opacity: 0.2 }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            Fondateurs
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-text-primary mt-2">
            ils ont déjà lancé.
          </h2>
        </motion.div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              className="bg-bg-darker/80 border border-text-secondary/20 p-6 flex items-center gap-6 hover:border-accent/50 transition-all"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Rank */}
              <div className="font-display text-3xl text-accent w-8 text-center">
                {index + 1}
              </div>

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/50 flex-shrink-0">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl text-text-primary">
                  {founder.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {founder.projects.map((project, i) => (
                    <span key={project.name} className="flex items-center gap-1">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-accent hover:text-text-primary transition-colors"
                      >
                        {project.name}
                      </a>
                      {i < founder.projects.length - 1 && (
                        <span className="text-text-secondary">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* MRR + Vehicle */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="font-display text-2xl text-text-primary">
                    {formatMRR(founder.mrr)}
                  </div>
                  <div className="font-body text-xs text-text-secondary uppercase tracking-wide">
                    MRR
                  </div>
                </div>
                <div className="w-12 h-12">
                  <Vehicle tier={founder.tier} className="w-full h-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA subtil */}
        <motion.p
          className="text-center font-body text-text-secondary mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          ta place est ici. <span className="text-accent">rejoins-nous.</span>
        </motion.p>
      </div>
    </section>
  );
}
