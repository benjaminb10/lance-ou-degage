import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RoadScene } from "./RoadScene";
import { Button } from "../ui/Button";
import { Vehicle } from "./VehicleSVG";
import { supabase } from "~/lib/supabase";

export function Hero() {
  const [stats, setStats] = useState({ lanceurs: 0, mrr: 0, trophees: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await supabase
          .from("members")
          .select("mrr, member_achievements(achievement_id)")
          .eq("onboarding_completed", true)
          .eq("visible", true);

        if (data) {
          const lanceurs = data.length;
          const mrr = data.reduce((acc, m) => acc + (m.mrr || 0), 0);
          const trophees = data.reduce((acc, m) => acc + (m.member_achievements?.length || 0), 0);
          setStats({ lanceurs, mrr, trophees });
        }
      } catch (err) {
        console.warn("Failed to fetch stats");
      }
    }
    fetchStats();
  }, []);
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Route animée en arrière-plan */}
      <RoadScene />

      {/* Contenu Hero superposé */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Titre LANCE OU DÉGAGE */}
        <motion.h1
          className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] leading-none tracking-tight text-text-primary"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-glow">LANCE OU DÉGAGE</span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          className="font-display text-2xl md:text-4xl lg:text-5xl text-text-primary mt-4 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Tu sors un truc en 30 jours.{" "}
          <span className="text-accent">ou tu dégages.</span>
        </motion.p>

        {/* Micro */}
        <motion.p
          className="font-body text-base md:text-lg lg:text-xl text-text-primary/80 mt-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Le club de ceux qui livrent, pendant que les autres peaufinent leur logo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a href="#pricing">
            <Button variant="primary" size="lg">
              je me lance
            </Button>
          </a>
          <a href="#route">
            <Button variant="secondary" size="lg">
              voir la route
            </Button>
          </a>
        </motion.div>

        {/* Parade des véhicules */}
        <motion.div
          className="mt-12 flex items-center gap-1 md:gap-2 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { tier: 0, label: "start" },
            { tier: 1, label: "domaine" },
            { tier: 2, label: "en ligne" },
            { tier: 3, label: "stripe" },
            { tier: 4, label: "marketing" },
            { tier: 5, label: "1er user" },
            { tier: 6, label: "1er €" },
            { tier: 7, label: "10 clients" },
            { tier: 8, label: "scale" },
          ].map((item, index) => (
            <div key={item.tier} className="flex items-center gap-1 md:gap-2">
              <motion.div
                className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1, y: -4 }}
              >
                <Vehicle tier={item.tier} className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                <span className="font-body text-[10px] md:text-xs text-text-primary/70 mt-1">
                  {item.label}
                </span>
              </motion.div>
              {index < 8 && (
                <span className="text-accent/40 text-sm md:text-base">→</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Stats FOMO - toujours visibles */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 md:gap-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-body text-sm md:text-base text-text-secondary">
            <span className="text-accent font-semibold">{stats.lanceurs}</span> lanceurs en course
          </span>
          <span className="text-text-secondary/50">·</span>
          <span className="font-body text-sm md:text-base text-text-secondary">
            <span className="text-accent font-semibold">{stats.mrr.toLocaleString("fr-FR")}€</span> générés ce mois
          </span>
          <span className="text-text-secondary/50">·</span>
          <span className="font-body text-sm md:text-base text-text-secondary">
            <span className="text-accent font-semibold">{stats.trophees}</span> trophées débloqués
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { delay: 2, duration: 1.5, repeat: Infinity },
        }}
      >
        <div className="w-6 h-10 border-2 border-text-secondary/50 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-accent rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
