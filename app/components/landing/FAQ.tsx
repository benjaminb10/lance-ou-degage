import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "sur quoi je peux bosser?",
    answer:
      "tout ce qui se partage avec un lien. SaaS, outil, offre, directory, marketplace, automatisation, AI wrapper, campagne, deal, ta plus petite expérience bancale. si le crew peut cliquer, ça compte.",
  },
  {
    question: "j'ai déjà une idée?",
    answer:
      "parfait, arrête de fignoler le plan et sors la plus petite version utilisable.",
  },
  {
    question: "pas encore d'idée?",
    answer:
      "tu vas en choisir une vite, pas trois semaines à demander la permission au ciel.",
  },
  {
    question: "faut être dev?",
    answer:
      "non, business ou tech. faut juste assez de cran pour mettre un lien en ligne.",
  },
  {
    question: "le timer démarre quand?",
    answer:
      "après paiement tu choisis ton projet, la mission créée lance les 30 jours.",
  },
  {
    question: "si je sors rien en 30 jours?",
    answer: "tu dégages, ta place se vide, mur de la honte.",
  },
  {
    question: "je peux changer d'idée?",
    answer:
      "tôt et pour une vraie raison oui, après tu es engagé sur l'idée et le chrono.",
  },
  {
    question: "c'est une formation?",
    answer:
      "non. les formations te donnent l'illusion d'avancer en restant caché. ici c'est une deadline, un crew exclusif, et un lancement public qui attend de juger tes excuses.",
  },
  {
    question: "combien de temps par semaine?",
    answer: "assez pour faire avancer ton truc tous les jours.",
  },
  {
    question: "on m'aide?",
    answer:
      "oui, crew, feedback, pression, visibilité. mais c'est toi qui tiens le marteau.",
  },
  {
    question: "remboursement?",
    answer:
      "si tu poses sérieusement la question, recommence depuis le début.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-text-secondary/10">
      <button
        className="w-full py-6 flex items-center justify-between text-left group"
        onClick={onToggle}
      >
        <span className="font-display text-xl md:text-2xl text-text-primary group-hover:text-accent transition-colors">
          {faq.question}
        </span>
        <motion.span
          className="text-accent text-2xl ml-4 flex-shrink-0"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-body text-text-secondary pb-6 pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 px-4 bg-bg-dark">
      <div className="max-w-3xl mx-auto">
        {/* Titre */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mt-2">
            questions.
          </h2>
        </motion.div>

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
