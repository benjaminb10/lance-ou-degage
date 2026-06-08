import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export function Footer() {
  return (
    <footer className="relative py-20 px-4 bg-bg-darker overflow-hidden">
      {/* Ligne accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* CTA final */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-6xl text-text-primary mb-6">
            prêt à livrer?
          </h2>
          <a href="#pricing">
            <Button variant="primary" size="lg">
              je me lance
            </Button>
          </a>
        </motion.div>

        {/* Logo + links */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-display text-3xl text-text-primary">LANCE OU DÉGAGE</span>
            <p className="font-body text-sm text-text-secondary mt-1">
              le club de ceux qui livrent.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="/leaderboard"
              className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Leaderboard
            </a>
            <a
              href="/feed"
              className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Feed
            </a>
            <a
              href="#faq"
              className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Pricing
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="font-body text-xs text-text-secondary/50 text-center mt-12">
          © 2026 LANCE OU DÉGAGE. tous droits réservés.
          <br />
          pas de refund, pas d'excuses, pas de regrets.
        </p>
      </div>
    </footer>
  );
}
