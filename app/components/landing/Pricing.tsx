import { motion } from "framer-motion";
import { Button } from "../ui/Button";

// Paliers fondateurs - rien n'est vendu encore
// Places décrémentées uniquement sur vente Stripe réelle
const nextTiers = [
  { price: 59, spots: 5 },
  { price: 99, spots: 10 },
  { price: 149, spots: 80, label: "fondateurs" },
];

export function Pricing() {
  // Tier actif actuel
  const currentPrice = 29;
  const currentRemaining = 1;

  return (
    <section id="pricing" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark to-bg-darker" />

      {/* Glow accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ background: "var(--color-accent-glow)", opacity: 0.4 }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Titre */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            Pricing
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary mt-2">
            prends ta place.
          </h2>
        </motion.div>

        {/* Carte principale - TIER ACTIF */}
        <motion.div
          className="relative bg-bg-darker border-2 border-accent p-8 md:p-12 text-center glow-accent"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-6 py-1">
            <span className="font-display text-sm text-bg-darker tracking-wide">
              MAINTENANT
            </span>
          </div>

          {/* Prix */}
          <div className="mt-6">
            <span className="font-display text-8xl md:text-9xl text-text-primary">
              {currentPrice}€
            </span>
            <span className="font-display text-2xl md:text-3xl text-accent ml-2">
              à vie
            </span>
          </div>

          {/* Places restantes */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="font-body text-lg text-text-primary">
              <span className="text-accent font-bold">{currentRemaining}</span> {currentRemaining === 1 ? "place restante" : "places restantes"}
            </span>
          </div>

          {/* Ce que tu obtiens */}
          <div className="mt-8 text-left max-w-md mx-auto space-y-2 font-body text-text-secondary">
            <p>✓ accès Discord privé à vie</p>
            <p>✓ ton profil public + véhicule</p>
            <p>✓ roadmap gamifiée 30 jours</p>
            <p>✓ call hebdo pour avancer ou se faire dégager</p>
            <p>✓ badge fondateur permanent</p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="https://buy.stripe.com/28EdR95XH5047JkgZc1VK00"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg" className="w-full md:w-auto text-xl px-12 py-4">
                je me lance
              </Button>
            </a>
          </div>

          {/* Sous-texte */}
          <p className="font-body text-sm text-text-secondary mt-6">
            paiement unique · pas de remboursement · accès immédiat
          </p>
        </motion.div>

        {/* Mini-frise des prochains paliers */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-center font-body text-base md:text-lg text-text-primary/70 mb-6">
            Ensuite le prix monte:
          </p>

          <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
            {/* Tier actuel (petit rappel) */}
            <div className="px-3 py-2 md:px-4 md:py-3 bg-accent/20 border-2 border-accent text-accent font-display text-base md:text-xl">
              29€ ✓
            </div>

            {/* Flèche */}
            <span className="text-text-primary/60 text-base md:text-xl">→</span>

            {/* Prochains tiers grisés */}
            {nextTiers.map((tier, index) => (
              <div key={tier.price} className="flex items-center gap-2 md:gap-4">
                <div className="px-3 py-2 md:px-4 md:py-3 bg-bg-darker/50 border border-text-primary/30 text-text-primary/50 font-display text-base md:text-xl">
                  {tier.price}€
                </div>
                {index < nextTiers.length - 1 && (
                  <span className="text-text-primary/40 text-base md:text-xl">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="text-center font-body text-sm md:text-base text-text-primary/50 mt-6">
            ~100 places fondateurs au total · après on passe en saisons
          </p>
        </motion.div>

        {/* Legal note */}
        <motion.p
          className="text-center font-body text-xs text-text-secondary/50 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          En achetant, tu acceptes les CGV et renonces à ton droit de rétractation
          pour accès immédiat au contenu numérique.
        </motion.p>
      </div>
    </section>
  );
}
