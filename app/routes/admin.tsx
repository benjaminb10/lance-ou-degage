import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, type Member } from "~/lib/supabase";
import { Button } from "~/components/ui/Button";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_EMAIL = "benoudis.benjamin@gmail.com";

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center">
        <div className="text-text-secondary font-body">Chargement...</div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  }} />;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects");
      setLoading(false);
    } else {
      onLogin();
    }
  }

  return (
    <main className="min-h-screen bg-bg-darker flex items-center justify-center p-4">
      <motion.div
        className="max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-accent mb-6">admin</h1>

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
              className="w-full bg-bg-dark border border-text-secondary/30 px-4 py-3 text-text-primary font-body focus:border-accent focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-body text-sm text-text-secondary mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-dark border border-text-secondary/30 px-4 py-3 text-text-primary font-body focus:border-accent focus:outline-none"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "..." : "connexion"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyOnboardingLink(member: Member) {
    if (!member.stripe_session_id) return;
    const link = `https://lance-ou-degage.fr/onboarding?session_id=${member.stripe_session_id}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    // Debug: check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Admin session:", session?.user?.email);

    const { data, error } = await supabase
      .from("members")
      .select("*, projects(*)")
      .order("created_at", { ascending: false });

    console.log("Fetch members result:", { data, error });

    if (error) {
      console.error("Error fetching members:", error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  async function toggleVisible(member: Member) {
    const { error } = await supabase
      .from("members")
      .update({ visible: !member.visible })
      .eq("id", member.id);

    if (error) {
      console.error("Error updating visibility:", error);
    } else {
      setMembers(members.map(m =>
        m.id === member.id ? { ...m, visible: !m.visible } : m
      ));
    }
  }

  async function deleteMember(member: Member) {
    if (!confirm(`Supprimer ${member.name} ? Cette action est irréversible.`)) {
      return;
    }

    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", member.id);

    if (error) {
      console.error("Error deleting member:", error);
      alert("Erreur lors de la suppression");
    } else {
      setMembers(members.filter(m => m.id !== member.id));
    }
  }

  function startEdit(member: Member) {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      whatsapp: member.whatsapp || "",
      bio: member.bio || "",
      tier: member.tier,
      mrr: member.mrr,
      linkedin_url: member.linkedin_url || "",
      twitter_url: member.twitter_url || "",
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);

    const { error } = await supabase
      .from("members")
      .update(editForm)
      .eq("id", editingId);

    if (error) {
      console.error("Error updating member:", error);
      alert("Erreur lors de la sauvegarde");
    } else {
      setMembers(members.map(m =>
        m.id === editingId ? { ...m, ...editForm } : m
      ));
      setEditingId(null);
      setEditForm({});
    }
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-bg-darker p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-accent">admin</h1>
          <button
            onClick={onLogout}
            className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
          >
            déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-dark border border-text-secondary/20 p-4">
            <div className="font-display text-2xl text-text-primary">{members.length}</div>
            <div className="font-body text-xs text-text-secondary uppercase">total</div>
          </div>
          <div className="bg-bg-dark border border-text-secondary/20 p-4">
            <div className="font-display text-2xl text-accent">{members.filter(m => m.visible).length}</div>
            <div className="font-body text-xs text-text-secondary uppercase">visibles</div>
          </div>
          <div className="bg-bg-dark border border-text-secondary/20 p-4">
            <div className="font-display text-2xl text-text-secondary">{members.filter(m => !m.visible).length}</div>
            <div className="font-body text-xs text-text-secondary uppercase">masqués</div>
          </div>
        </div>

        {/* Members list */}
        {loading ? (
          <div className="text-text-secondary font-body">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className={`bg-bg-dark border p-4 ${
                  member.visible
                    ? "border-text-secondary/20"
                    : "border-red-500/30 opacity-60"
                }`}
              >
                {editingId === member.id ? (
                  /* Edit mode */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">Nom</label>
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">WhatsApp</label>
                        <input
                          type="text"
                          value={editForm.whatsapp || ""}
                          onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">Bio</label>
                        <input
                          type="text"
                          value={editForm.bio || ""}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">Tier (0-8)</label>
                        <input
                          type="number"
                          value={editForm.tier || 0}
                          onChange={(e) => setEditForm({ ...editForm, tier: parseInt(e.target.value) })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">MRR (€)</label>
                        <input
                          type="number"
                          value={editForm.mrr || 0}
                          onChange={(e) => setEditForm({ ...editForm, mrr: parseInt(e.target.value) })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={editForm.linkedin_url || ""}
                          onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs text-text-secondary mb-1">Twitter URL</label>
                        <input
                          type="text"
                          value={editForm.twitter_url || ""}
                          onChange={(e) => setEditForm({ ...editForm, twitter_url: e.target.value })}
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={saveEdit}
                        disabled={saving}
                      >
                        {saving ? "..." : "sauvegarder"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm({});
                        }}
                      >
                        annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-text-secondary/30 bg-bg-darker flex-shrink-0">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-text-primary">{member.name}</span>
                        {!member.visible && (
                          <span className="text-xs text-red-400 font-body">(masqué)</span>
                        )}
                      </div>
                      <div className="font-body text-xs text-text-secondary">
                        {member.email} · Tier {member.tier} · {member.mrr}€ MRR
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {member.stripe_session_id && (
                        <button
                          onClick={() => copyOnboardingLink(member)}
                          className="px-3 py-1 text-xs font-body border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          {copiedId === member.id ? "copié!" : "renvoyer l'onboarding"}
                        </button>
                      )}
                      <button
                        onClick={() => toggleVisible(member)}
                        className={`px-3 py-1 text-xs font-body border transition-colors ${
                          member.visible
                            ? "border-accent text-accent hover:bg-accent hover:text-bg-darker"
                            : "border-text-secondary text-text-secondary hover:border-accent hover:text-accent"
                        }`}
                      >
                        {member.visible ? "masquer" : "afficher"}
                      </button>
                      <button
                        onClick={() => startEdit(member)}
                        className="px-3 py-1 text-xs font-body border border-text-secondary text-text-secondary hover:border-accent hover:text-accent transition-colors"
                      >
                        modifier
                      </button>
                      <button
                        onClick={() => deleteMember(member)}
                        className="px-3 py-1 text-xs font-body border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
