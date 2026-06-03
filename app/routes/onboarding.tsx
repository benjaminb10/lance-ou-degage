import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/Button";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || undefined,
  }),
});

const DISCORD_INVITE_LINK = "https://discord.gg/k273Mu6qN";

function OnboardingPage() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "discord">("form");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    linkedin_url: "",
    twitter_url: "",
    bio: "",
    project_name: "",
    project_url: "",
    project_mrr: "",
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Check for valid session
  useEffect(() => {
    if (!session_id) {
      setError(
        "Session invalide. Assure-toi d'avoir payé via le lien de paiement."
      );
    }
  }, [session_id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload avatar if provided
      let avatarUrl: string | null = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${session_id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
          avatarUrl = publicUrl;
        }
      }

      // Insert member
      const { data: member, error: memberError } = await supabase
        .from("members")
        .insert({
          stripe_session_id: session_id,
          email: formData.email,
          name: formData.name,
          whatsapp: formData.whatsapp || null,
          linkedin_url: formData.linkedin_url || null,
          twitter_url: formData.twitter_url || null,
          avatar_url: avatarUrl,
          bio: formData.bio || null,
          tier: 0, // Start at trottinette
          mrr: parseInt(formData.project_mrr) || 0,
          onboarding_completed: true,
          is_founder: true, // Early adopters are founders
        })
        .select()
        .single();

      if (memberError) {
        if (memberError.code === "23505") {
          // Unique constraint violation
          setError("Cette session a déjà été utilisée. Contacte-nous si c'est une erreur.");
          return;
        }
        throw memberError;
      }

      // Insert project if provided
      if (formData.project_name && member) {
        await supabase.from("projects").insert({
          member_id: member.id,
          name: formData.project_name,
          url: formData.project_url || null,
          mrr: parseInt(formData.project_mrr) || 0,
        });
      }

      setStep("discord");
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err.message || "Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "discord") {
    return <DiscordInviteStep />;
  }

  return (
    <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
      <motion.div
        className="max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl md:text-3xl text-accent mb-2">
          merci et bienvenue dans le crew !
        </h1>
        <p className="font-body text-text-secondary mb-8">
          remplis ces informations avant de pouvoir accéder au discord.
        </p>

        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-500 p-4 mb-6 text-red-400 font-body text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar upload */}
          <div>
            <label className="block font-body text-sm text-text-secondary mb-2 uppercase tracking-wider">
              photo de profil (optionnel)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-text-secondary/30 bg-bg-dark flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-text-secondary text-2xl">👤</span>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="font-body text-sm text-accent hover:text-accent-bright transition-colors">
                  {avatarPreview ? "changer" : "ajouter une photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Input
            label="nom"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) =>
              setFormData((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            label="email"
            type="email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((f) => ({ ...f, email: e.target.value }))
            }
          />
          <Input
            label="whatsapp"
            type="tel"
            required
            placeholder="+33 6 12 34 56 78"
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData((f) => ({ ...f, whatsapp: e.target.value }))
            }
          />
          <Input
            label="linkedin (optionnel)"
            placeholder="https://linkedin.com/in/..."
            value={formData.linkedin_url}
            onChange={(e) =>
              setFormData((f) => ({ ...f, linkedin_url: e.target.value }))
            }
          />
          <Input
            label="twitter / x (optionnel)"
            placeholder="https://x.com/..."
            value={formData.twitter_url}
            onChange={(e) =>
              setFormData((f) => ({ ...f, twitter_url: e.target.value }))
            }
          />
          <Textarea
            label="bio courte (optionnel)"
            placeholder="Ce que tu fais en 1 phrase"
            value={formData.bio}
            onChange={(e) =>
              setFormData((f) => ({ ...f, bio: e.target.value }))
            }
          />

          <div className="border-t border-text-secondary/20 pt-6">
            <p className="font-body text-sm text-accent mb-1 uppercase tracking-wider">
              ton projet principal
            </p>
            <p className="font-body text-xs text-text-secondary mb-4">
              celui sur lequel tu vas bosser les 30 prochains jours
            </p>
            <div className="space-y-4">
              <Input
                label="nom du projet (optionnel)"
                placeholder="MonSaaS"
                value={formData.project_name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, project_name: e.target.value }))
                }
              />
              <Input
                label="url (si en ligne)"
                placeholder="https://monsaas.com"
                value={formData.project_url}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, project_url: e.target.value }))
                }
              />
              <Input
                label="mrr actuel (en €)"
                type="number"
                placeholder="0"
                value={formData.project_mrr}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, project_mrr: e.target.value }))
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || !session_id}
          >
            {loading ? "..." : "continuer"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}

function DiscordInviteStep() {
  return (
    <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          🎉
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
          t'es dedans.
        </h1>
        <p className="font-body text-text-secondary mb-8">
          rejoins le Discord pour commencer ton premier challenge.
        </p>

        <a
          href={DISCORD_INVITE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="primary" size="lg" className="w-full">
            rejoindre le discord
          </Button>
        </a>

        <a
          href="/leaderboard"
          className="block mt-6 text-accent hover:text-accent-bright font-body transition-colors"
        >
          voir le leaderboard →
        </a>
      </motion.div>
    </main>
  );
}

// Reusable form components
function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block font-body text-sm text-text-secondary mb-2 uppercase tracking-wider">
        {label}
      </label>
      <input
        className="w-full bg-bg-dark border border-text-secondary/30 px-4 py-3 text-text-primary font-body focus:border-accent focus:outline-none transition-colors placeholder:text-text-secondary/50"
        {...props}
      />
    </div>
  );
}

function Textarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block font-body text-sm text-text-secondary mb-2 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        className="w-full bg-bg-dark border border-text-secondary/30 px-4 py-3 text-text-primary font-body focus:border-accent focus:outline-none resize-none transition-colors placeholder:text-text-secondary/50"
        rows={3}
        {...props}
      />
    </div>
  );
}
