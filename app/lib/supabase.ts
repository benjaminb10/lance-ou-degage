import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Some features will be disabled.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "lod-auth",
    },
  }
);

// Types
export interface Member {
  id: string;
  stripe_session_id: string | null;
  email: string;
  name: string;
  whatsapp: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  tiktok_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  avatar_url: string | null;
  bio: string | null;
  objective: string | null;
  tier: number;
  mrr: number;
  joined_at: string;
  onboarding_completed: boolean;
  discord_invited: boolean;
  is_founder: boolean;
  visible: boolean;
  countdown_started_at: string | null;
  auth_id: string | null;
  streak_count: number;
  last_update_at: string | null;
  projects?: Project[];
  member_achievements?: MemberAchievement[];
}

export interface Project {
  id: string;
  member_id: string;
  name: string;
  url: string | null;
  description: string | null;
  mrr: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  position: number;
}

export interface MemberAchievement {
  member_id: string;
  achievement_id: string;
  unlocked_at: string;
  // Joined data
  achievement?: Achievement;
  member?: Member;
}

export interface Update {
  id: string;
  member_id: string;
  content: string;
  created_at: string;
  // Joined data
  member?: Pick<Member, "id" | "name" | "avatar_url" | "streak_count">;
}
