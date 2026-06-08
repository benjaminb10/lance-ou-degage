import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Achievement, type Member } from "~/lib/supabase";
import { AchievementIcon } from "~/components/AchievementIcons";

interface FeedItem {
  member_id: string;
  achievement_id: string;
  unlocked_at: string;
  member: Pick<Member, "id" | "name" | "avatar_url">;
  achievement: Achievement;
}

export function LiveTrophyNotification() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchRecentAchievements();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    // Show notification after a small delay
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Cycle through achievements every 5 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, [items]);

  async function fetchRecentAchievements() {
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
      .limit(10);

    if (!error && data) {
      // Shuffle the items randomly
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setItems(shuffled as any);
    }
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

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto z-50">
      <AnimatePresence>
        {isVisible && currentItem && (
          <motion.a
            href={`/membre/${currentItem.member.id}`}
            className="flex items-center gap-3 bg-bg-dark border border-accent/30 p-3 pr-5 shadow-lg hover:border-accent transition-colors"
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Trophy Icon */}
            <div className="w-10 h-10 flex-shrink-0">
              <AchievementIcon
                achievementId={currentItem.achievement_id}
                className="w-full h-full"
                unlocked={true}
              />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-text-secondary/30 bg-bg-darker flex-shrink-0">
                  {currentItem.member.avatar_url ? (
                    <img
                      src={currentItem.member.avatar_url}
                      alt={currentItem.member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary font-display text-[8px]">
                      {currentItem.member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-display text-sm text-text-primary truncate">
                  {currentItem.member.name}
                </span>
              </div>
              <div className="font-body text-xs text-text-secondary mt-0.5">
                a débloqué <span className="text-accent font-display">{currentItem.achievement.name}</span>
              </div>
              <div className="font-body text-[10px] text-text-secondary/60 mt-0.5">
                {formatTimeAgo(currentItem.unlocked_at)}
              </div>
            </div>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
