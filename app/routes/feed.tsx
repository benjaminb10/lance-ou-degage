import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, type Achievement, type Member, type Update } from "~/lib/supabase";
import { AchievementIcon } from "~/components/AchievementIcons";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

interface AchievementFeedItem {
  type: "achievement";
  id: string;
  timestamp: string;
  member: Pick<Member, "id" | "name" | "avatar_url" | "streak_count">;
  achievement: Achievement;
}

interface UpdateFeedItem {
  type: "update";
  id: string;
  timestamp: string;
  content: string;
  member: Pick<Member, "id" | "name" | "avatar_url" | "streak_count">;
}

type FeedItem = AchievementFeedItem | UpdateFeedItem;

function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    // Fetch achievements
    const { data: achievementData } = await supabase
      .from("member_achievements")
      .select(`
        member_id,
        achievement_id,
        unlocked_at,
        member:members!inner(id, name, avatar_url, streak_count),
        achievement:achievements!inner(id, name, description, icon)
      `)
      .order("unlocked_at", { ascending: false })
      .limit(30);

    // Fetch updates
    const { data: updateData } = await supabase
      .from("updates")
      .select(`
        id,
        content,
        created_at,
        member:members!inner(id, name, avatar_url, streak_count)
      `)
      .order("created_at", { ascending: false })
      .limit(30);

    // Transform achievements to feed items
    const achievementItems: AchievementFeedItem[] = (achievementData || []).map((item: any) => ({
      type: "achievement" as const,
      id: `achievement-${item.member_id}-${item.achievement_id}`,
      timestamp: item.unlocked_at,
      member: item.member,
      achievement: item.achievement,
    }));

    // Transform updates to feed items
    const updateItems: UpdateFeedItem[] = (updateData || []).map((item: any) => ({
      type: "update" as const,
      id: `update-${item.id}`,
      timestamp: item.created_at,
      content: item.content,
      member: item.member,
    }));

    // Merge and sort by timestamp
    const allItems = [...achievementItems, ...updateItems].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setItems(allItems.slice(0, 50));
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
              L'activité de la communauté
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
            <div className="text-4xl mb-4">📝</div>
            <p className="font-body text-text-secondary">
              Aucune activité pour le moment.
            </p>
            <p className="font-body text-sm text-text-secondary/60 mt-2">
              Sois le premier à poster une update !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.a
                key={item.id}
                href={`/membre/${item.member.id}`}
                className="block bg-bg-dark border border-text-secondary/20 p-4 hover:border-accent/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {item.type === "achievement" ? (
                  // Achievement item - trophy icon on left
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <AchievementIcon
                        achievementId={item.achievement.id}
                        className="w-full h-full"
                        unlocked={true}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-text-secondary/30 bg-bg-darker flex-shrink-0">
                          {item.member.avatar_url ? (
                            <img
                              src={item.member.avatar_url}
                              alt={item.member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-secondary font-display text-xs">
                              {item.member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-display text-text-primary">{item.member.name}</span>
                        <span className="font-body text-xs text-text-secondary">
                          · {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      <div className="font-body text-sm text-text-secondary mt-1">
                        a débloqué <span className="font-display text-accent">{item.achievement.name}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Update item - avatar on left
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-text-secondary/30 bg-bg-darker flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-text-primary">{item.member.name}</span>
                        {item.member.streak_count > 0 && (
                          <span className="text-sm text-orange-400">🔥{item.member.streak_count}</span>
                        )}
                        <span className="font-body text-xs text-text-secondary">
                          · {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      <div className="font-body text-sm text-text-secondary mt-1">
                        raconte sa journée
                      </div>
                      <p className="font-body text-sm text-text-primary mt-2 whitespace-pre-wrap">{item.content}</p>
                    </div>
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
