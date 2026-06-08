import { supabase, type Update } from "./supabase";

const STREAK_MILESTONES = [3, 7, 14, 30] as const;

interface PostUpdateResult {
  success: boolean;
  update?: Update;
  newStreak: number;
  unlockedAchievements: string[];
  error?: string;
  alreadyPostedToday?: boolean;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

export async function postUpdate(
  memberId: string,
  content: string
): Promise<PostUpdateResult> {
  const today = getToday();

  // 1. Check if already posted today
  const { data: todayUpdates, error: checkError } = await supabase
    .from("updates")
    .select("id")
    .eq("member_id", memberId)
    .gte("created_at", `${today}T00:00:00`)
    .lt("created_at", `${today}T23:59:59.999`);

  if (checkError) {
    return {
      success: false,
      newStreak: 0,
      unlockedAchievements: [],
      error: checkError.message,
    };
  }

  if (todayUpdates && todayUpdates.length > 0) {
    return {
      success: false,
      newStreak: 0,
      unlockedAchievements: [],
      alreadyPostedToday: true,
      error: "Tu as déjà posté aujourd'hui !",
    };
  }

  // 2. Get current member data
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("streak_count, last_update_at")
    .eq("id", memberId)
    .single();

  if (memberError || !member) {
    return {
      success: false,
      newStreak: 0,
      unlockedAchievements: [],
      error: memberError?.message || "Membre non trouvé",
    };
  }

  // 3. Calculate new streak
  const yesterday = getYesterday();
  let newStreak: number;

  if (member.last_update_at === yesterday) {
    // Consecutive day - increment streak
    newStreak = (member.streak_count || 0) + 1;
  } else if (member.last_update_at === today) {
    // Same day - keep streak (shouldn't happen due to check above)
    newStreak = member.streak_count || 1;
  } else {
    // Gap in posting - reset to 1
    newStreak = 1;
  }

  // 4. Insert the update
  const { data: update, error: insertError } = await supabase
    .from("updates")
    .insert({
      member_id: memberId,
      content: content.trim(),
    })
    .select()
    .single();

  if (insertError) {
    return {
      success: false,
      newStreak: 0,
      unlockedAchievements: [],
      error: insertError.message,
    };
  }

  // 5. Update member streak
  const { error: updateError } = await supabase
    .from("members")
    .update({
      streak_count: newStreak,
      last_update_at: today,
    })
    .eq("id", memberId);

  if (updateError) {
    console.error("Failed to update streak:", updateError);
  }

  // 6. Check and unlock streak achievements
  const unlockedAchievements: string[] = [];

  for (const milestone of STREAK_MILESTONES) {
    if (newStreak >= milestone) {
      const achievementId = `streak_${milestone}`;

      // Check if already unlocked
      const { data: existing } = await supabase
        .from("member_achievements")
        .select("achievement_id")
        .eq("member_id", memberId)
        .eq("achievement_id", achievementId)
        .single();

      if (!existing) {
        // Unlock new achievement
        const { error: achievementError } = await supabase
          .from("member_achievements")
          .insert({
            member_id: memberId,
            achievement_id: achievementId,
          });

        if (!achievementError) {
          unlockedAchievements.push(achievementId);
        }
      }
    }
  }

  return {
    success: true,
    update,
    newStreak,
    unlockedAchievements,
  };
}

export async function getMemberUpdates(
  memberId: string,
  limit = 10
): Promise<Update[]> {
  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching updates:", error);
    return [];
  }

  return data || [];
}

export async function hasPostedToday(memberId: string): Promise<boolean> {
  const today = getToday();

  const { data, error } = await supabase
    .from("updates")
    .select("id")
    .eq("member_id", memberId)
    .gte("created_at", `${today}T00:00:00`)
    .lt("created_at", `${today}T23:59:59.999`);

  if (error) {
    console.error("Error checking today's update:", error);
    return false;
  }

  return (data?.length || 0) > 0;
}
