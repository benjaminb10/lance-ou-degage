import { useState, useEffect } from "react";
import { supabase, type Member } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

export const ADMIN_EMAIL = "benoudis.benjamin@gmail.com";

interface AuthState {
  user: User | null;
  member: Member | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    member: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchMemberByAuthId(session.user.id);
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        fetchMemberByAuthId(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setState({ user: null, member: null, loading: false, error: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchMemberByAuthId(authId: string) {
    const { data, error } = await supabase
      .from("members")
      .select("*, projects(*)")
      .eq("auth_id", authId)
      .single();

    if (error) {
      // Member not linked yet - this is OK, they'll link on callback
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setState({ user: user, member: null, loading: false, error: null });
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setState({ user: user, member: data, loading: false, error: null });
    }
  }

  return state;
}

// Send magic link to email
export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  // First check if this email exists in members table
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id")
    .eq("email", email)
    .single();

  if (memberError || !member) {
    return { error: "Aucun compte membre pour cet email. As-tu payé ?" };
  }

  // Send magic link
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: "Erreur lors de l'envoi du lien. Réessaie." };
  }

  return { error: null };
}

// Link auth user to existing member (called from callback)
export async function linkAuthToMember(authUserId: string, email: string): Promise<{ member: Member | null; error: string | null }> {
  // Find member by email
  const { data: member, error: findError } = await supabase
    .from("members")
    .select("*")
    .eq("email", email)
    .single();

  if (findError || !member) {
    return { member: null, error: "Aucun compte membre pour cet email." };
  }

  // Check if member is already linked to another auth user
  if (member.auth_id && member.auth_id !== authUserId) {
    return { member: null, error: "Ce compte est déjà lié à un autre utilisateur." };
  }

  // Link auth_id if not already linked
  if (!member.auth_id) {
    const { error: updateError } = await supabase
      .from("members")
      .update({ auth_id: authUserId })
      .eq("id", member.id);

    if (updateError) {
      console.error("Error linking auth:", updateError);
      return { member: null, error: "Erreur lors de la liaison du compte." };
    }
  }

  return { member: { ...member, auth_id: authUserId }, error: null };
}

// Sign out
export async function signOut() {
  await supabase.auth.signOut();
}
