import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "rejoins le crew",
    content:
      "tu es la moyenne des 5 personnes que tu côtoies le plus. rejoins le Discord privé des lanceurs, un crew de gens qui sortent des trucs, pas de touristes de la productivité. check-ins quotidiens, channels vocaux pour cowork.",
  },
  {
    number: "02",
    title: "fais des petits paris",
    content:
      "monter un business ça fout les jetons, monter une feature avec un bouton payer non. une feature, un bouton payer, tu valides. roadmap gamifiée qui te dit chaque étape suivante. tu lances, c'est obligatoire.",
  },
  {
    number: "03",
    title: "lâche rien",
    content:
      "PRODEUR existe pour que lâcher devienne ridicule et que sortir des trucs devienne fun. profil public, deadline 30 jours, ton véhicule qui grimpe à chaque étape franchie. sortir, lancer, recommencer.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-32 px-4 bg-bg-dark overflow-hidden">
      {/* Titre */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            Comment ça marche
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-text-primary mt-2">
            30 jours pour passer de l'idée au premier client,
            <br />
            <span className="text-accent">étape par étape.</span>
          </h2>
        </motion.div>

        {/* Steps - Layout asymétrique */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`relative ${index === 1 ? "md:mt-16" : ""} ${index === 2 ? "md:mt-32" : ""}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Numéro */}
              <span className="font-display text-8xl md:text-9xl text-accent/20 absolute -top-8 -left-4 select-none">
                {step.number}
              </span>

              {/* Contenu */}
              <div className="relative bg-bg-darker/50 border border-text-secondary/10 p-8 hover:border-accent/50 transition-colors duration-300">
                <h3 className="font-display text-2xl md:text-3xl text-text-primary mb-4">
                  {step.title}
                </h3>
                <p className="font-body text-text-secondary leading-relaxed">
                  {step.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
