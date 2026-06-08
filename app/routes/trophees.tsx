import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, type Achievement, type Member } from "~/lib/supabase";
import { AchievementIcon } from "~/components/AchievementIcons";

export const Route = createFileRoute("/trophees")({
  component: TropheesPage,
});

interface AchievementWithMembers extends Achievement {
  members: Pick<Member, "id" | "name" | "avatar_url">[];
}

function TropheesPage() {
  const [achievements, setAchievements] = useState<AchievementWithMembers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    // Fetch all achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .order("position", { ascending: true });

    if (!achievementsData) {
      setLoading(false);
      return;
    }

    // Fetch all member_achievements with member info
    const { data: memberAchievementsData } = await supabase
      .from("member_achievements")
      .select(`
        achievement_id,
        member:members!inner(id, name, avatar_url)
      `);

    // Group members by achievement
    const membersByAchievement: Record<string, Pick<Member, "id" | "name" | "avatar_url">[]> = {};
    (memberAchievementsData || []).forEach((ma: any) => {
      if (!membersByAchievement[ma.achievement_id]) {
        membersByAchievement[ma.achievement_id] = [];
      }
      membersByAchievement[ma.achievement_id].push(ma.member);
    });

    // Combine achievements with their members
    const achievementsWithMembers: AchievementWithMembers[] = achievementsData.map((achievement) => ({
      ...achievement,
      members: membersByAchievement[achievement.id] || [],
    }));

    // Sort by number of members (most first)
    achievementsWithMembers.sort((a, b) => b.members.length - a.members.length);

    setAchievements(achievementsWithMembers);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-bg-darker py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-accent">trophées</h1>
            <p className="font-body text-sm text-text-secondary mt-1">
              Les jalons de ton parcours de maker
            </p>
          </div>
          <a
            href="/leaderboard"
            className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
          >
            leaderboard →
          </a>
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="text-text-secondary font-body">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="bg-bg-dark border border-text-secondary/20 p-4 hover:border-accent/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <div className="flex items-start gap-4">
                  {/* Trophy Icon */}
                  <div className={`w-14 h-14 flex-shrink-0 ${achievement.members.length === 0 ? 'opacity-40 grayscale' : ''}`}>
                    <AchievementIcon
                      achievementId={achievement.id}
                      className="w-full h-full"
                      unlocked={achievement.members.length > 0}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-display text-lg ${achievement.members.length > 0 ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {achievement.name}
                    </h3>
                    <p className="font-body text-sm text-text-secondary mt-0.5">
                      {achievement.description}
                    </p>

                    {/* Members who unlocked */}
                    {achievement.members.length > 0 ? (
                      <div className="mt-3">
                        <div className="flex items-center">
                          {/* Stacked avatars */}
                          <div className="flex -space-x-3">
                            {achievement.members.slice(0, 5).map((member) => (
                              <a
                                key={member.id}
                                href={`/membre/${member.id}`}
                                className="group relative w-9 h-9 rounded-full border-2 border-bg-dark bg-bg-darker hover:z-10 hover:scale-110 transition-transform"
                              >
                                <div className="w-full h-full rounded-full overflow-hidden">
                                  {member.avatar_url ? (
                                    <img
                                      src={member.avatar_url}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-secondary font-display text-sm">
                                      {member.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-dark border border-text-secondary/30 text-text-primary font-body text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                  {member.name}
                                </div>
                              </a>
                            ))}
                          </div>
                          {/* Extra count */}
                          {achievement.members.length > 5 && (
                            <span className="ml-2 font-body text-xs text-text-secondary">
                              +{achievement.members.length - 5}
                            </span>
                          )}
                          {/* Count label */}
                          <span className="ml-auto font-body text-xs text-text-secondary">
                            obtenu par {achievement.members.length} {achievement.members.length === 1 ? 'membre' : 'membres'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <span className="font-body text-xs text-text-secondary/60 italic">
                          Pas encore débloqué
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
