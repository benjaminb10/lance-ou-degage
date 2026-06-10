import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Member } from "~/lib/supabase";
import { RouteScene } from "~/components/route3d/RouteScene";
import { memberTier } from "~/lib/tier";

export const Route = createFileRoute("/la-route")({
  component: LaRoutePage,
});

function LaRoutePage() {
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
        .eq("visible", true);

      if (error) {
        console.error("Error fetching members:", error);
      }

      // Même ordre que le leaderboard : tier calculé puis MRR
      const sorted = (data || []).sort(
        (a: Member, b: Member) => memberTier(b) - memberTier(a) || b.mrr - a.mrr
      );
      setMembers(sorted);
      setLoading(false);
    }
    fetchMembers();
  }, []);

  return (
    <main className="relative h-[calc(100dvh-3.5rem)] bg-bg-dark overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-sm text-text-secondary animate-pulse">
            chargement de la route...
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="text-4xl">🛣️</div>
          <p className="font-body text-text-secondary text-center">
            aucun lanceur sur la route.
            <br />
            sois le premier.
          </p>
        </div>
      ) : (
        <RouteScene members={members} />
      )}

      {/* Titre */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none z-[40000] w-full px-4">
        <h1 className="font-display text-2xl md:text-4xl text-text-primary text-glow">
          la route.
        </h1>
        <p className="font-body text-xs md:text-sm text-text-secondary mt-2">
          scrolle pour descendre le classement.
        </p>
        <a
          href="/trophees#tiers"
          className="pointer-events-auto inline-block font-body text-xs text-text-secondary hover:text-accent transition-colors mt-2"
        >
          c'est quoi les véhicules ? →
        </a>
      </div>
    </main>
  );
}
