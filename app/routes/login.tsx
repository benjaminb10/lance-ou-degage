import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/Button";
import { sendMagicLink, useAuth } from "~/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, member, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Redirect if already logged in with a member
  useEffect(() => {
    if (!loading && user && member) {
      navigate({ to: "/mon-espace" });
    }
  }, [loading, user, member, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const result = await sendMagicLink(email);

    if (result.error) {
      setError(result.error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center">
        <div className="text-text-secondary font-body">Chargement...</div>
      </main>
    );
  }

  if (status === "sent") {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
        <motion.div
          className="max-w-sm w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-accent/20 border border-accent flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-text-primary mb-4">
            check tes mails
          </h1>
          <p className="font-body text-text-secondary mb-6">
            Un lien magique a été envoyé à <span className="text-accent">{email}</span>
          </p>
          <p className="font-body text-xs text-text-secondary">
            Clique sur le lien dans l'email pour te connecter.
            <br />
            <span className="text-text-secondary/60">Pense à regarder tes spams si tu ne vois rien.</span>
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
      <motion.div
        className="max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-accent mb-2">connexion</h1>
        <p className="font-body text-sm text-text-secondary mb-6">
          Entre l'email utilisé lors de ton inscription.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 p-3 mb-4 text-red-400 font-body text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-sm text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full bg-bg-dark border border-text-secondary/30 px-4 py-3 text-text-primary font-body focus:border-accent focus:outline-none"
              required
              disabled={status === "sending"}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={status === "sending"}
          >
            {status === "sending" ? "envoi en cours..." : "envoyer le lien magique"}
          </Button>
        </form>

        <p className="mt-6 font-body text-xs text-text-secondary text-center">
          Pas encore membre ?{" "}
          <a href="/#pricing" className="text-accent hover:underline">
            Rejoins le défi
          </a>
        </p>
      </motion.div>
    </main>
  );
}
