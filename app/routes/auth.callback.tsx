import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "~/lib/supabase";
import { linkAuthToMember } from "~/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      // Check if there's a hash with tokens (magic link format)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // Extract tokens from hash and set session
        const { data, error: hashError } = await supabase.auth.getSession();

        if (hashError) {
          console.error("Hash session error:", hashError);
        }

        // Give Supabase time to process the hash
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error("Erreur de session");
      }

      if (!session?.user) {
        // Wait a bit and try again - sometimes the session takes a moment
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { data: { session: retrySession } } = await supabase.auth.getSession();

        if (!retrySession?.user) {
          throw new Error("Session invalide. Le lien a peut-être expiré.");
        }

        await processSession(retrySession.user.id, retrySession.user.email!);
        return;
      }

      await processSession(session.user.id, session.user.email!);
    } catch (err) {
      console.error("Auth callback error:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setStatus("error");
    }
  }

  async function processSession(authUserId: string, email: string) {
    // Link auth user to member
    const { member, error: linkError } = await linkAuthToMember(authUserId, email);

    if (linkError || !member) {
      throw new Error(linkError || "Erreur lors de la liaison du compte");
    }

    setStatus("success");

    // Redirect to mon-espace after a brief delay
    setTimeout(() => {
      navigate({ to: "/mon-espace" });
    }, 1500);
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-text-secondary">Connexion en cours...</p>
        </motion.div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
        <motion.div
          className="max-w-sm w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 border border-red-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-text-primary mb-4">
            oops
          </h1>
          <p className="font-body text-red-400 mb-6">
            {error}
          </p>
          <a
            href="/login"
            className="inline-block font-body text-accent hover:underline"
          >
            Reessayer
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
      <motion.div
        className="max-w-sm w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-accent/20 border border-accent flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-accent mb-4">
          connecte !
        </h1>
        <p className="font-body text-text-secondary">
          Redirection vers ton espace...
        </p>
      </motion.div>
    </main>
  );
}
