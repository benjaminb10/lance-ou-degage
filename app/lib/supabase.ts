import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Some features will be disabled.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

// Types
export interface Member {
  id: string;
  stripe_session_id: string | null;
  email: string;
  name: string;
  linkedin_url: string | null;
  twitter_url: string | null;
  avatar_url: string | null;
  bio: string | null;
  tier: number;
  mrr: number;
  joined_at: string;
  onboarding_completed: boolean;
  discord_invited: boolean;
  is_founder: boolean;
  projects?: Project[];
}

export interface Project {
  id: string;
  member_id: string;
  name: string;
  url: string | null;
  description: string | null;
  mrr: number;
}
