import { motion } from "framer-motion";

export function Stakes() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background dramatique */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at top,
            rgba(255, 107, 53, 0.1) 0%,
            var(--color-bg-darker) 50%
          )`,
        }}
      />

      {/* Lignes de warning */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-accent"
            style={{ top: `${i * 10}%` }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre choc */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            L'Enjeu
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-text-primary mt-4 leading-none">
            tu rates ta deadline,
            <br />
            <span className="text-accent text-glow">et tu dégages.</span>
          </h2>
        </motion.div>

        {/* Conséquences */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-bg-darker/80 border border-accent/30 p-6 text-center">
            <div className="text-4xl mb-3">💀</div>
            <p className="font-body text-text-primary">
              affiché dans le mur de la honte du discord
            </p>
          </div>
          <div className="bg-bg-darker/80 border border-accent/30 p-6 text-center">
            <div className="text-4xl mb-3">🚪</div>
            <p className="font-body text-text-primary">
              viré du crew
            </p>
          </div>
          <div className="bg-bg-darker/80 border border-accent/30 p-6 text-center">
            <div className="text-4xl mb-3">👻</div>
            <p className="font-body text-text-primary">
              ta place se vide sous les yeux de tous
            </p>
          </div>
        </motion.div>

        {/* No remboursement */}
        <motion.p
          className="text-center mt-12 font-display text-xl text-accent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          pas de remboursement.
        </motion.p>
      </div>
    </section>
  );
}
