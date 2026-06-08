import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, type Member } from "~/lib/supabase";
import { MemberCard } from "~/components/MemberCard";
import { Button } from "~/components/ui/Button";
import { StatsGrid } from "~/components/StatsGrid";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("members")
        .select(
          `
          *,
          projects(*),
          member_achievements(achievement_id)
        `
        )
        .eq("onboarding_completed", true)
        .eq("visible", true)
        .order("tier", { ascending: false })
        .order("mrr", { ascending: false });

      if (error) {
        console.error("Error fetching members:", error);
      }

      setMembers(data || []);
      setLoading(false);
    }
    fetchMembers();
  }, []);

  return (
    <main className="min-h-screen bg-bg-dark">
      <section className="py-16 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a
              href="/"
              className="inline-block font-body text-accent text-sm tracking-widest uppercase hover:text-text-primary transition-colors mb-4"
            >
              ← retour
            </a>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-text-primary mt-2">
              leaderboard.
            </h1>
            <p className="font-body text-text-secondary mt-4 max-w-md mx-auto">
              ceux qui ont lancé, pas ceux qui parlent.
            </p>
          </motion.div>

          {/* Stats */}
          {!loading && members.length > 0 && (
            <div className="mb-12">
              <StatsGrid
                members={members.length}
                mrr={members.reduce((acc, m) => acc + m.mrr, 0)}
                projects={members.reduce((acc, m) => acc + (m.projects?.length || 0), 0)}
                trophies={members.reduce((acc, m) => acc + (m.member_achievements?.length || 0), 0)}
                delay={0.2}
              />
            </div>
          )}

          {/* Leaderboard */}
          {loading ? (
            <LoadingSkeleton />
          ) : members.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 md:space-y-4">
              {members.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  rank={index + 1}
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            className="text-center mt-12 md:mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-body text-text-secondary mb-4">
              ta place est ici.
            </p>
            <a href="/#pricing">
              <Button variant="primary" size="lg">
                rejoindre le club
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}


function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-bg-darker/80 border border-text-secondary/20 p-6 h-24 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-4xl mb-4">🚀</div>
      <p className="font-body text-text-secondary">
        aucun lanceur pour l'instant.
        <br />
        sois le premier.
      </p>
    </motion.div>
  );
}
