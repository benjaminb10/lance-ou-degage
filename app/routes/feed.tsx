import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, type Achievement, type Member } from "~/lib/supabase";
import { AchievementIcon } from "~/components/AchievementIcons";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

interface FeedItem {
  member_id: string;
  achievement_id: string;
  unlocked_at: string;
  member: Pick<Member, "id" | "name" | "avatar_url">;
  achievement: Achievement;
}

function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    const { data, error } = await supabase
      .from("member_achievements")
      .select(`
        member_id,
        achievement_id,
        unlocked_at,
        member:members!inner(id, name, avatar_url),
        achievement:achievements!inner(id, name, description, icon)
      `)
      .order("unlocked_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching feed:", error);
    } else {
      setItems((data as any) || []);
    }
    setLoading(false);
  }

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 7) return `il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }

  return (
    <main className="min-h-screen bg-bg-darker py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-accent">feed</h1>
            <p className="font-body text-sm text-text-secondary mt-1">
              Les derniers trophées débloqués par la communauté
            </p>
          </div>
          <a
            href="/leaderboard"
            className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
          >
            leaderboard →
          </a>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-text-secondary font-body">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏆</div>
            <p className="font-body text-text-secondary">
              Aucun trophée débloqué pour le moment.
            </p>
            <p className="font-body text-sm text-text-secondary/60 mt-2">
              Sois le premier à débloquer un trophée !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.a
                key={`${item.member_id}-${item.achievement_id}`}
                href={`/membre/${item.member.id}`}
                className="block bg-bg-dark border border-text-secondary/20 p-4 hover:border-accent/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  {/* Trophy Icon - left and bigger */}
                  <div className="w-14 h-14 flex-shrink-0">
                    <AchievementIcon
                      achievementId={item.achievement_id}
                      className="w-full h-full"
                      unlocked={true}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-text-secondary/30 bg-bg-darker flex-shrink-0">
                        {item.member.avatar_url ? (
                          <img
                            src={item.member.avatar_url}
                            alt={item.member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-secondary font-display text-sm">
                            {item.member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-display text-text-primary">{item.member.name}</span>
                    </div>
                    <div className="font-body text-sm text-text-primary mt-1">
                      a débloqué <span className="font-display text-accent">{item.achievement.name}</span>
                    </div>
                    <div className="font-body text-xs text-text-secondary mt-1">
                      {formatTimeAgo(item.unlocked_at)}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
