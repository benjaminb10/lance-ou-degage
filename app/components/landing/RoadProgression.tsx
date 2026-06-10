import { motion } from "framer-motion";
import { Vehicle } from "./VehicleSVG";

// Système de rang : trophées débloqués, puis MRR pour les derniers paliers
// Du sol vers l'espace - le décor change de zone
const achievements = [
  {
    tier: 0,
    vehicle: "trottinette",
    zone: "route",
    achievement: "départ",
    description: "tu rejoins la route"
  },
  {
    tier: 1,
    vehicle: "vélo",
    zone: "route",
    achievement: "1 trophée",
    description: "premier trophée débloqué"
  },
  {
    tier: 2,
    vehicle: "moto",
    zone: "route",
    achievement: "3 trophées",
    description: "tu prends de la vitesse"
  },
  {
    tier: 3,
    vehicle: "voiture",
    zone: "route",
    achievement: "5 trophées",
    description: "ça roule sérieusement"
  },
  {
    tier: 4,
    vehicle: "voiture de sport",
    zone: "route",
    achievement: "8 trophées",
    description: "machine de guerre"
  },
  {
    tier: 5,
    vehicle: "jetski",
    zone: "mer",
    achievement: "11 trophées",
    description: "tu quittes la route"
  },
  {
    tier: 6,
    vehicle: "yacht",
    zone: "mer",
    achievement: "5K€ de MRR",
    description: "MRR vérifié via Stripe"
  },
  {
    tier: 7,
    vehicle: "jet privé",
    zone: "ciel",
    achievement: "10K€ de MRR",
    description: "ça commence à décoller"
  },
  {
    tier: 8,
    vehicle: "fusée",
    zone: "espace",
    achievement: "20K€ de MRR",
    description: "ça scale"
  },
];

export function RoadProgression() {
  return (
    <section id="route" className="relative py-32 px-4 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            var(--color-bg-dark) 0%,
            var(--color-bg-darker) 50%,
            var(--color-bg-dark) 100%
          )`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Titre */}
        <motion.div
          className="mb-16 text-center md:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            La Route
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-text-primary mt-2">
            Ta place sur la route dépend
            <br />
            <span className="text-accent">des étapes que tu franchis.</span>
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          className="mb-16 max-w-3xl space-y-4 font-body text-lg text-text-secondary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p>
            chaque trophée débloqué te fait monter de véhicule. les derniers paliers se gagnent au MRR. tu commences en trottinette, tu finis dans l'espace.
          </p>
          <p className="text-text-primary">
            chaque trophée se débloque en soumettant une preuve: un lien, une URL, un screenshot. le MRR est vérifié via Stripe.
          </p>
        </motion.div>

        {/* Visualisation des étapes - layout vertical progressif */}
        <div className="relative">
          {/* Ligne de progression verticale */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-road via-accent/50 to-accent" />

          {/* Étapes */}
          <div className="space-y-6">
            {achievements.map((step, index) => (
              <motion.div
                key={step.tier}
                className="relative flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Véhicule */}
                <motion.div
                  className="relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Point sur la ligne */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full" />

                  {/* Glow */}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full blur-md opacity-40"
                    style={{ background: "var(--color-accent-glow)" }}
                  />
                  <Vehicle
                    tier={step.tier}
                    className="w-14 h-14 md:w-16 md:h-16"
                  />
                </motion.div>

                {/* Contenu */}
                <div className="flex-1 bg-bg-darker/50 border border-text-secondary/10 p-4 md:p-6 hover:border-accent/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <span className="font-display text-lg md:text-xl text-text-primary">
                        {step.vehicle}
                      </span>
                      <span className={`ml-3 text-xs px-2 py-0.5 rounded ${
                        step.zone === "route" ? "bg-road-line/20 text-road-line" :
                        step.zone === "mer" ? "bg-blue-500/20 text-blue-400" :
                        step.zone === "ciel" ? "bg-sky-500/20 text-sky-400" :
                        "bg-accent/20 text-accent"
                      }`}>
                        {step.zone}
                      </span>
                    </div>
                    <span className="font-body text-accent text-sm md:text-base">
                      {step.achievement}
                    </span>
                  </div>
                  <p className="font-body text-sm text-text-secondary mt-2">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Note business */}
        <motion.div
          className="mt-16 p-6 bg-bg-darker border-l-4 border-accent"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-text-secondary">
            <span className="text-text-primary font-semibold">tu fais du business et pas du SaaS?</span>{" "}
            un produit, une offre, une campagne, une automatisation, un deal signé, si ça se partage avec un lien ça compte.
          </p>
        </motion.div>

        {/* Badge MRR */}
        <motion.div
          className="mt-8 p-6 bg-bg-darker/50 border border-text-secondary/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-body text-text-secondary">
            <span className="text-accent font-semibold">badge MRR optionnel:</span>{" "}
            branche ton Stripe, ton MRR vérifié s'affiche sur ton profil.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
