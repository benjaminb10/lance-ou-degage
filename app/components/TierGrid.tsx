import { motion } from "framer-motion";
import { Vehicle } from "~/components/landing/VehicleSVG";
import { TIER_INFO } from "~/lib/tier";

export function TierGrid() {
  return (
    <section id="tiers" className="scroll-mt-20 mb-12">
      <h2 className="font-display text-xl text-text-primary">les véhicules</h2>
      <p className="font-body text-sm text-text-secondary mt-1 max-w-2xl">
        chaque trophée te fait monter de véhicule, jusqu'au jetski. au-delà,
        c'est ton mrr qui parle. ton véhicule = le meilleur des deux.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {TIER_INFO.map((tier, index) => (
          <motion.div
            key={tier.name}
            className="bg-bg-dark border border-text-secondary/20 p-4 hover:border-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Vehicle tier={index} className="w-12 h-12" />
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <h3 className="font-display text-base text-text-primary">
                {tier.name}
              </h3>
              <span className="font-body text-xs text-accent whitespace-nowrap">
                {tier.requirement}
              </span>
            </div>
            <p className="font-body text-xs text-text-secondary mt-1">
              {tier.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
