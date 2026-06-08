import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase, type Member, type Achievement, type MemberAchievement, type Project } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import { Vehicle } from "~/components/landing/VehicleSVG";
import { AchievementIcon } from "~/components/AchievementIcons";
import { Button } from "~/components/ui/Button";

export const Route = createFileRoute("/membre/$id")({
  component: MemberProfile,
});

function MemberProfile() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editMrr, setEditMrr] = useState(0);
  const [editProjects, setEditProjects] = useState<Project[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [memberAchievements, setMemberAchievements] = useState<MemberAchievement[]>([]);

  // Check if current user is the owner of this profile
  const isOwner = user && member?.auth_id === user.id;

  useEffect(() => {
    fetchMember();
    fetchAchievements();
  }, [id]);

  useEffect(() => {
    if (member) {
      setEditMrr(member.mrr);
      setEditProjects(member.projects || []);
    }
  }, [member]);

  useEffect(() => {
    if (!member?.countdown_started_at) return;

    const updateCountdown = () => {
      const start = new Date(member.countdown_started_at!);
      const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = Math.max(0, end.getTime() - now.getTime());

      setCountdown({
        days: Math.floor(diff / (24 * 60 * 60 * 1000)),
        hours: Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
        minutes: Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)),
        seconds: Math.floor((diff % (60 * 1000)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [member?.countdown_started_at]);

  async function fetchMember() {
    const { data, error } = await supabase
      .from("members")
      .select("*, projects(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching member:", error);
    } else {
      setMember(data);
    }
    setLoading(false);
  }

  async function fetchAchievements() {
    // Fetch all achievements
    const { data: allAchievements } = await supabase
      .from("achievements")
      .select("*")
      .order("position");

    // Fetch member's achievements
    const { data: myAchievements } = await supabase
      .from("member_achievements")
      .select("*")
      .eq("member_id", id);

    setAchievements(allAchievements || []);
    setMemberAchievements(myAchievements || []);
  }

  async function toggleAchievement(achievementId: string) {
    if (!member || !isOwner) return;

    const isUnlocked = memberAchievements.some((ma) => ma.achievement_id === achievementId);

    if (isUnlocked) {
      const { error } = await supabase
        .from("member_achievements")
        .delete()
        .eq("member_id", member.id)
        .eq("achievement_id", achievementId);

      if (!error) {
        setMemberAchievements((prev) => prev.filter((ma) => ma.achievement_id !== achievementId));
      }
    } else {
      const { data, error } = await supabase
        .from("member_achievements")
        .insert({ member_id: member.id, achievement_id: achievementId })
        .select()
        .single();

      if (!error && data) {
        setMemberAchievements((prev) => [...prev, data]);

        // Fire confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF6B35", "#FFD700", "#FF8C00", "#FFA500"],
        });
      }
    }
  }

  async function saveMrr() {
    if (!member || !isOwner) return;

    const { error } = await supabase
      .from("members")
      .update({ mrr: editMrr })
      .eq("id", member.id);

    if (!error) {
      setMember((prev) => prev ? { ...prev, mrr: editMrr } : null);
    }
  }

  async function saveProjects() {
    if (!member || !isOwner) return;

    // Get original project IDs
    const originalIds = (member.projects || []).map((p) => p.id);
    const editIds = editProjects.filter((p) => p.id).map((p) => p.id);

    // Delete removed projects
    const toDelete = originalIds.filter((id) => !editIds.includes(id));
    for (const id of toDelete) {
      await supabase.from("projects").delete().eq("id", id);
    }

    // Update existing and insert new projects
    for (const project of editProjects) {
      if (project.id && originalIds.includes(project.id)) {
        // Update existing
        const { error } = await supabase
          .from("projects")
          .update({
            name: project.name,
            url: project.url || null,
            description: project.description || null,
            mrr: project.mrr || 0,
          })
          .eq("id", project.id);
        if (error) {
          console.error("Error updating project:", error);
        }
      } else if (project.name.trim()) {
        // Insert new (only if has a name)
        await supabase.from("projects").insert({
          member_id: member.id,
          name: project.name,
          url: project.url || null,
          description: project.description || null,
          mrr: project.mrr || 0,
        });
      }
    }

    // Refresh member data
    await fetchMember();
  }

  function updateProject(index: number, field: keyof Project, value: string | number) {
    setEditProjects((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addProject() {
    setEditProjects((prev) => [
      ...prev,
      { id: "", member_id: member?.id || "", name: "", url: null, description: null, mrr: 0 },
    ]);
  }

  function removeProject(index: number) {
    setEditProjects((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFinishEditing() {
    await saveMrr();
    await saveProjects();
    setIsEditing(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center">
        <div className="text-text-secondary font-body">Chargement...</div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-bg-darker flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-text-primary mb-4">404</h1>
          <p className="text-text-secondary font-body">Membre non trouvé</p>
          <a href="/" className="text-accent font-body hover:underline mt-4 inline-block">
            retour
          </a>
        </div>
      </main>
    );
  }

  // Calcul du tier basé sur le nombre de trophées
  function getTier(trophyCount: number): number {
    if (trophyCount >= 20) return 8;  // Fusée
    if (trophyCount >= 17) return 7;  // Hélicoptère
    if (trophyCount >= 14) return 6;  // Jet privé
    if (trophyCount >= 11) return 5;  // Avion
    if (trophyCount >= 8) return 4;   // Voiture sport
    if (trophyCount >= 5) return 3;   // Voiture
    if (trophyCount >= 3) return 2;   // Moto
    if (trophyCount >= 1) return 1;   // Vélo
    return 0;                          // Trottinette
  }
  const tier = getTier(memberAchievements.length);
  const isCountdownActive = member.countdown_started_at && countdown.days + countdown.hours + countdown.minutes + countdown.seconds > 0;
  const isCountdownExpired = member.countdown_started_at && countdown.days + countdown.hours + countdown.minutes + countdown.seconds === 0;

  return (
    <main className="min-h-screen bg-bg-darker py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <a
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body text-sm mb-8 transition-colors"
        >
          ← retour au leaderboard
        </a>

        {/* Profile card */}
        <motion.div
          className="bg-bg-dark border border-text-secondary/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mobile layout */}
          <div className="md:hidden">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent bg-bg-darker flex-shrink-0">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent font-display text-xl">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Name + Badge */}
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-lg text-text-primary">{member.name}</h1>
                {member.is_founder && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-accent/20 border border-accent text-accent text-xs font-body">
                    fondateur
                  </span>
                )}
              </div>
              {/* Vehicle */}
              <div className="flex-shrink-0 text-center">
                <Vehicle tier={tier} className="w-12 h-12" />
                <div className="font-body text-[10px] text-text-secondary mt-0.5">
                  {["trottinette", "vélo", "moto", "voiture", "sports car", "jetski", "yacht", "jet privé", "fusée"][tier]}
                </div>
              </div>
            </div>
            {member.bio && (
              <p className="font-body text-sm text-text-secondary">{member.bio}</p>
            )}
            {/* Social links */}
            <div className="flex items-center gap-4 mt-3">
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {member.twitter_url && (
                <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent bg-bg-darker flex-shrink-0">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent font-display text-2xl">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl text-text-primary">{member.name}</h1>
                {member.is_founder && (
                  <span className="px-2 py-0.5 bg-accent/20 border border-accent text-accent text-xs font-body whitespace-nowrap">
                    fondateur
                  </span>
                )}
              </div>
              {member.bio && (
                <p className="font-body text-sm text-text-secondary mt-2">{member.bio}</p>
              )}

              {/* Social links */}
              <div className="flex items-center gap-4 mt-3">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {member.twitter_url && (
                  <a
                    href={member.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex-shrink-0 text-center">
              <Vehicle tier={tier} className="w-14 h-14" />
              <div className="font-body text-xs text-text-secondary mt-1">
                {["trottinette", "vélo", "moto", "voiture", "sports car", "jetski", "yacht", "jet privé", "fusée"][tier]}
              </div>
            </div>
          </div>

          {/* Stats + Edit button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 pt-6 border-t border-text-secondary/20">
            <div className="flex gap-4 md:gap-6 justify-between md:justify-start">
              <div className="text-center">
                <div className="font-display text-xl text-accent">{tier}</div>
                <div className="font-body text-xs text-text-secondary">tier</div>
              </div>
              <div className="text-center">
                <div className="font-display text-xl text-text-primary">{memberAchievements.length}</div>
                <div className="font-body text-xs text-text-secondary">trophees</div>
              </div>
              <div className="text-center">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editMrr}
                      onChange={(e) => setEditMrr(parseInt(e.target.value) || 0)}
                      className="w-32 bg-bg-darker border border-accent px-3 py-2 text-center font-display text-xl text-text-primary focus:outline-none"
                      min="0"
                    />
                    <span className="font-display text-xl text-text-primary">€</span>
                  </div>
                ) : (
                  <div className="font-display text-xl text-text-primary">{member.mrr}€</div>
                )}
                <div className="font-body text-xs text-text-secondary">MRR</div>
              </div>
            </div>
            {isOwner && (
              isEditing ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFinishEditing}
                >
                  terminer
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  modifier
                </Button>
              )
            )}
          </div>
        </motion.div>

        {/* Countdown */}
        {member.countdown_started_at && (
          <motion.div
            className={`mt-6 p-6 border text-center ${
              isCountdownExpired
                ? "bg-red-500/10 border-red-500/50"
                : "bg-bg-dark border-accent/50"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {isCountdownExpired ? (
              <>
                <h2 className="font-display text-2xl text-red-400 mb-2">TEMPS ÉCOULÉ</h2>
                <p className="font-body text-text-secondary">Le défi de 30 jours est terminé</p>
              </>
            ) : isCountdownActive && (
              <>
                <h2 className="font-display text-xs md:text-sm text-accent mb-2 md:mb-3">TEMPS RESTANT</h2>
                <div className="flex justify-center items-center gap-1 md:gap-3">
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-5xl text-text-primary">{countdown.days}</div>
                    <div className="font-body text-[8px] md:text-xs text-text-secondary uppercase">j</div>
                  </div>
                  <span className="font-display text-base md:text-3xl text-accent">:</span>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-5xl text-text-primary">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="font-body text-[8px] md:text-xs text-text-secondary uppercase">h</div>
                  </div>
                  <span className="font-display text-base md:text-3xl text-accent">:</span>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-5xl text-text-primary">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="font-body text-[8px] md:text-xs text-text-secondary uppercase">m</div>
                  </div>
                  <span className="font-display text-base md:text-3xl text-accent animate-pulse">:</span>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-5xl text-accent">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="font-body text-[8px] md:text-xs text-text-secondary uppercase">s</div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Projects - BEFORE Trophies */}
        {(isOwner && isEditing) || (member.projects && member.projects.length > 0) ? (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl text-text-primary mb-4">Projets</h2>

            {isOwner && isEditing ? (
              // Edit mode: editable project cards
              <div className="space-y-4">
                {editProjects.map((project, index) => (
                  <div
                    key={project.id || `new-${index}`}
                    className="bg-bg-dark border border-text-secondary/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => updateProject(index, "name", e.target.value)}
                          placeholder="Nom du projet"
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-display focus:border-accent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={project.url || ""}
                          onChange={(e) => updateProject(index, "url", e.target.value)}
                          placeholder="URL (https://...)"
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={project.description || ""}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          placeholder="Description courte"
                          className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={project.mrr}
                            onChange={(e) => updateProject(index, "mrr", parseInt(e.target.value) || 0)}
                            placeholder="MRR"
                            className="w-24 bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-display focus:border-accent focus:outline-none"
                            min="0"
                          />
                          <span className="text-text-secondary font-body text-sm">€/mois</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeProject(index)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full border border-dashed border-text-secondary/30 p-4 text-text-secondary hover:border-accent hover:text-accent transition-colors font-body text-sm"
                >
                  + Ajouter un projet
                </button>
              </div>
            ) : (
              // View mode: display project cards
              <div className="space-y-2">
                {member.projects?.map((project) => (
                  <div
                    key={project.id}
                    className="bg-bg-dark border border-text-secondary/20 p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-display text-text-primary">{project.name}</h3>
                      {project.description && (
                        <p className="font-body text-sm text-text-secondary mt-1">{project.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {project.mrr > 0 && (
                        <span className="font-display text-accent">{project.mrr}€/mois</span>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-secondary hover:text-accent transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : null}

        {/* Trophies */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-xl text-text-primary mb-4">Trophées</h2>

          {isOwner && isEditing ? (
            // Edit mode: show all achievements with checkboxes
            <>
              <p className="font-body text-sm text-text-secondary mb-4">
                Coche les étapes que tu as accomplies. Ton tier monte avec chaque trophée !
              </p>
              <div className="space-y-2">
                {achievements.map((achievement) => {
                  const isUnlocked = memberAchievements.some((ma) => ma.achievement_id === achievement.id);
                  return (
                    <button
                      key={achievement.id}
                      onClick={() => toggleAchievement(achievement.id)}
                      className={`w-full flex items-center gap-4 p-4 border transition-all ${
                        isUnlocked
                          ? "bg-accent/10 border-accent"
                          : "bg-bg-dark border-text-secondary/20 hover:border-text-secondary/40"
                      }`}
                    >
                      <div className="w-10 h-10 flex-shrink-0">
                        <AchievementIcon
                          achievementId={achievement.id}
                          className="w-full h-full"
                          unlocked={isUnlocked}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-display ${isUnlocked ? "text-accent" : "text-text-primary"}`}>
                          {achievement.name}
                        </div>
                        <div className="font-body text-xs text-text-secondary">
                          {achievement.description}
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 ${
                          isUnlocked ? "bg-accent border-accent" : "border-text-secondary/50"
                        }`}
                      >
                        {isUnlocked && (
                          <svg className="w-4 h-4 text-bg-darker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            // View mode: show all achievements (unlocked = normal, locked = grayed)
            <div className="space-y-2">
              {achievements.map((achievement) => {
                const isUnlocked = memberAchievements.some((ma) => ma.achievement_id === achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`w-full flex items-center gap-4 p-4 border bg-bg-dark border-text-secondary/20 ${
                      !isUnlocked ? "opacity-40" : ""
                    }`}
                  >
                    <div className="w-10 h-10 flex-shrink-0">
                      <AchievementIcon
                        achievementId={achievement.id}
                        className="w-full h-full"
                        unlocked={isUnlocked}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-display text-text-primary">
                        {achievement.name}
                      </div>
                      <div className="font-body text-xs text-text-secondary">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
