import { motion } from "framer-motion";

export function ProblemSection() {
  return (
    <section className="relative py-32 px-4 bg-bg-darker overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px]"
        style={{ background: "var(--color-accent-glow)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre choc */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-lg md:text-xl text-text-secondary mb-4">
            Ton dernier projet, franchement:
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary leading-none line-through decoration-accent/60">
            0 utilisateur.
          </h2>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-accent leading-none line-through decoration-text-primary/60">
            0 euro.
          </h2>
        </motion.div>

        {/* Corps du texte */}
        <motion.div
          className="mt-12 space-y-8 font-body text-lg md:text-xl text-text-secondary max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p>
            et c'est pas parce que ton idée est nulle.
          </p>
          <p className="text-text-primary">
            c'est parce que personne peut encore cliquer sur ton truc.
          </p>
          <p className="text-accent italic border-l-4 border-accent pl-4">
            "je sors ça la semaine prochaine." ça fait 4 mois que tu dis ça. ton produit est toujours dans un onglet Cursor.
          </p>
          <p>
            peaufiner en privé, c'est pas avancer. c'est se cacher.
          </p>
          <p className="text-text-primary font-semibold text-2xl">
            t'as pas besoin de plus de temps. t'as besoin d'une deadline et de gens qui te regardent.
          </p>
        </motion.div>
      </div>

      {/* Décoration: ligne diagonale */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30"
      />
    </section>
  );
}
