import { motion } from "framer-motion";

// Données réelles depuis la DB - pour l'instant vide
const feed: Array<{ pseudo: string; product: string; days: number }> = [];
const posts: Array<{ platform: string; embedUrl: string }> = [];

// Compteurs réels (viendront de la DB)
const stats = {
  lanceurs: 0,
  degages: 0,
  etapesFranchies: 0,
};

export function SocialProof() {
  const feedIsEmpty = feed.length === 0;
  const postsIsEmpty = posts.length === 0;

  // Si tout est vide, on n'affiche rien
  if (stats.lanceurs === 0 && feedIsEmpty && postsIsEmpty) {
    return null;
  }

  return (
    <section className="relative py-32 px-4 bg-bg-dark overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Compteur principal - affiché uniquement s'il y a des lanceurs */}
        {stats.lanceurs > 0 && (
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-bg-darker px-6 py-3 border border-text-secondary/20">
              <span className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              <span className="font-display text-2xl md:text-3xl text-text-primary">
                <span className="text-accent">{stats.lanceurs}</span> lanceurs en action
              </span>
            </div>
          </motion.div>
        )}

        {/* Two columns: Feed + Mur social - affichés uniquement s'il y a du contenu */}
        {(!feedIsEmpty || !postsIsEmpty) && (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Feed live - affiché uniquement s'il y a des items */}
            {!feedIsEmpty && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-display text-2xl text-text-primary mb-6">
                  <span className="text-accent">///</span> Feed Live
                </h3>
                <div className="space-y-3">
                  {feed.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-bg-darker/50 border border-text-secondary/10 p-4 flex items-center justify-between hover:border-accent/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="font-body">
                        <span className="text-accent">@{item.pseudo}</span>
                        <span className="text-text-secondary"> a sorti </span>
                        <span className="text-text-primary">{item.product}</span>
                      </div>
                      <span className="font-body text-sm text-text-secondary">
                        en {item.days}j
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mur social - affiché uniquement s'il y a des posts */}
            {!postsIsEmpty && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-display text-2xl text-text-primary mb-6">
                  <span className="text-accent">///</span> Mur des Vrais
                </h3>
                <div className="space-y-4">
                  {/* Ici on intégrera les vrais embeds X/LinkedIn */}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
