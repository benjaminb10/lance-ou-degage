import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase, type Member, type Achievement, type MemberAchievement, type Project, type Update } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import { Vehicle } from "~/components/landing/VehicleSVG";
import { AchievementIcon } from "~/components/AchievementIcons";
import { Button } from "~/components/ui/Button";
import { postUpdate, getMemberUpdates, hasPostedToday } from "~/lib/streak";
import { getTier, VEHICLE_NAMES } from "~/lib/tier";

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins === 0) return "à l'instant";
      return `il y a ${diffMins}m`;
    }
    return `il y a ${diffHours}h`;
  }
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

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
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editTwitter, setEditTwitter] = useState("");
  const [editTiktok, setEditTiktok] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editYoutube, setEditYoutube] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editObjective, setEditObjective] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [memberAchievements, setMemberAchievements] = useState<MemberAchievement[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newUpdateContent, setNewUpdateContent] = useState("");
  const [alreadyPostedToday, setAlreadyPostedToday] = useState(false);
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState<"projets" | "journal" | "trophees">("projets");
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);
  const [editingUpdateContent, setEditingUpdateContent] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Check if current user is the owner of this profile
  const isOwner = user && member?.auth_id === user.id;

  // Set default tab based on URL param or owner status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");

    if (tabParam === "trophees" || tabParam === "journal" || tabParam === "projets") {
      setActiveTab(tabParam);
    } else if (isOwner) {
      setActiveTab("journal");
    }
  }, [isOwner]);

  useEffect(() => {
    fetchMember();
    fetchAchievements();
    fetchUpdates();
  }, [id]);

  useEffect(() => {
    if (isOwner && member) {
      checkIfPostedToday();
    }
  }, [isOwner, member]);

  async function fetchUpdates() {
    const data = await getMemberUpdates(id, 10);
    setUpdates(data);
  }

  async function checkIfPostedToday() {
    if (!member) return;
    const posted = await hasPostedToday(member.id);
    setAlreadyPostedToday(posted);
  }

  async function handlePostUpdate() {
    if (!member || !newUpdateContent.trim() || postingUpdate) return;

    setPostingUpdate(true);
    const result = await postUpdate(member.id, newUpdateContent);

    if (result.success) {
      setNewUpdateContent("");
      setAlreadyPostedToday(true);
      setMember((prev) => prev ? { ...prev, streak_count: result.newStreak } : null);
      await fetchUpdates();
      await fetchAchievements();

      // Fire confetti for new achievements
      if (result.unlockedAchievements.length > 0) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#FF6B35", "#FFD700", "#FF8C00", "#FFA500"],
        });
        // Refresh member achievements
        const { data: newAchievements } = await supabase
          .from("member_achievements")
          .select("*")
          .eq("member_id", member.id);
        setMemberAchievements(newAchievements || []);
      }
    }
    setPostingUpdate(false);
  }

  function startEditingUpdate(update: Update) {
    setEditingUpdateId(update.id);
    setEditingUpdateContent(update.content);
  }

  async function saveUpdateEdit() {
    if (!editingUpdateId || !editingUpdateContent.trim() || !member) return;

    const { error } = await supabase
      .from("updates")
      .update({ content: editingUpdateContent.trim() })
      .eq("id", editingUpdateId)
      .eq("member_id", member.id);

    if (error) {
      console.error("Error updating:", error);
      return;
    }

    setUpdates((prev) =>
      prev.map((u) =>
        u.id === editingUpdateId ? { ...u, content: editingUpdateContent.trim() } : u
      )
    );
    setEditingUpdateId(null);
    setEditingUpdateContent("");
  }

  function cancelEditingUpdate() {
    setEditingUpdateId(null);
    setEditingUpdateContent("");
  }

  useEffect(() => {
    if (member) {
      setEditMrr(member.mrr);
      setEditProjects(member.projects || []);
      setEditLinkedin(member.linkedin_url || "");
      setEditTwitter(member.twitter_url || "");
      setEditTiktok(member.tiktok_url || "");
      setEditInstagram(member.instagram_url || "");
      setEditYoutube(member.youtube_url || "");
      setEditBio(member.bio || "");
      setEditObjective(member.objective || "");
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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!member || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${member.id}-${Date.now()}.${fileExt}`;

    setUploadingAvatar(true);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      setUploadingAvatar(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update member avatar_url
    const { error: updateError } = await supabase
      .from('members')
      .update({ avatar_url: publicUrl })
      .eq('id', member.id);

    if (updateError) {
      console.error('Error updating avatar URL:', updateError);
    } else {
      setMember((prev) => prev ? { ...prev, avatar_url: publicUrl } : null);
    }

    setUploadingAvatar(false);
  }

  async function saveProfileInfo() {
    if (!member || !isOwner) return;

    const { error } = await supabase
      .from("members")
      .update({
        linkedin_url: editLinkedin.trim() || null,
        twitter_url: editTwitter.trim() || null,
        tiktok_url: editTiktok.trim() || null,
        instagram_url: editInstagram.trim() || null,
        youtube_url: editYoutube.trim() || null,
        bio: editBio.trim() || null,
        objective: editObjective.trim() || null,
      })
      .eq("id", member.id);

    if (!error) {
      setMember((prev) => prev ? {
        ...prev,
        linkedin_url: editLinkedin.trim() || null,
        twitter_url: editTwitter.trim() || null,
        tiktok_url: editTiktok.trim() || null,
        instagram_url: editInstagram.trim() || null,
        youtube_url: editYoutube.trim() || null,
        bio: editBio.trim() || null,
        objective: editObjective.trim() || null,
      } : null);
    }
  }

  async function handleFinishEditing() {
    await saveMrr();
    await saveProjects();
    await saveProfileInfo();
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

  const tier = getTier(memberAchievements.length, member?.mrr || 0);
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
          {/* Hidden file input for avatar */}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          {/* Mobile layout */}
          <div className="md:hidden">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent bg-bg-darker flex-shrink-0 ${isOwner && isEditing ? 'cursor-pointer' : ''}`}
                onClick={() => isOwner && isEditing && avatarInputRef.current?.click()}
              >
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent font-display text-xl">
                    {member.name.charAt(0)}
                  </div>
                )}
                {/* Edit overlay */}
                {isOwner && isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    {uploadingAvatar ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {/* Name + Badge */}
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-lg text-text-primary">
                  {member.name}
                  {member.streak_count > 0 && (
                    <span className="ml-2 text-sm text-orange-400">🔥{member.streak_count}</span>
                  )}
                </h1>
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
                  {VEHICLE_NAMES[tier]}
                </div>
              </div>
            </div>
            {member.bio && (
              <p className="font-body text-sm text-text-secondary">{member.bio}</p>
            )}
            {member.objective && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-accent">🎯</span>
                <span className="font-body text-sm text-text-primary">{member.objective}</span>
              </div>
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
              {member.tiktok_url && (
                <a href={member.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              )}
              {member.instagram_url && (
                <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {member.youtube_url && (
                <a href={member.youtube_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-start gap-4">
            {/* Avatar */}
            <div
              className={`relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent bg-bg-darker flex-shrink-0 ${isOwner && isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => isOwner && isEditing && avatarInputRef.current?.click()}
            >
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
              {/* Edit overlay */}
              {isOwner && isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  {uploadingAvatar ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl text-text-primary">
                  {member.name}
                  {member.streak_count > 0 && (
                    <span className="ml-2 text-base text-orange-400">🔥{member.streak_count}</span>
                  )}
                </h1>
                {member.is_founder && (
                  <span className="px-2 py-0.5 bg-accent/20 border border-accent text-accent text-xs font-body whitespace-nowrap">
                    fondateur
                  </span>
                )}
              </div>
              {member.bio && (
                <p className="font-body text-sm text-text-secondary mt-2">{member.bio}</p>
              )}
              {member.objective && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-accent">🎯</span>
                  <span className="font-body text-sm text-text-primary">{member.objective}</span>
                </div>
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
                {member.tiktok_url && (
                  <a
                    href={member.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                )}
                {member.instagram_url && (
                  <a
                    href={member.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {member.youtube_url && (
                  <a
                    href={member.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex-shrink-0 text-center">
              <Vehicle tier={tier} className="w-14 h-14" />
              <div className="font-body text-xs text-text-secondary mt-1">
                {VEHICLE_NAMES[tier]}
              </div>
            </div>
          </div>

          {/* Profile edit (bio + social links) - hidden on trophees tab */}
          {isOwner && isEditing && activeTab !== "trophees" && (
            <div className="mt-6 pt-6 border-t border-text-secondary/20 space-y-3">
              <div>
                <label className="font-body text-xs text-text-secondary mb-1 block">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 160))}
                  placeholder="Décris-toi en quelques mots..."
                  className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none resize-none"
                  rows={2}
                />
                <span className="font-body text-xs text-text-secondary">{editBio.length}/160</span>
              </div>
              <div>
                <label className="font-body text-xs text-text-secondary mb-1 block">🎯 Objectif</label>
                <input
                  type="text"
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value.slice(0, 100))}
                  placeholder="Ex: Lancer le MVP, Avoir 10 clients, Atteindre 1k€ MRR..."
                  className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                />
                <span className="font-body text-xs text-text-secondary">{editObjective.length}/100</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <input
                  type="url"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  placeholder="URL LinkedIn (https://linkedin.com/in/...)"
                  className="flex-1 bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <input
                  type="url"
                  value={editTwitter}
                  onChange={(e) => setEditTwitter(e.target.value)}
                  placeholder="URL X/Twitter (https://x.com/...)"
                  className="flex-1 bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <input
                  type="url"
                  value={editTiktok}
                  onChange={(e) => setEditTiktok(e.target.value)}
                  placeholder="URL TikTok (https://tiktok.com/@...)"
                  className="flex-1 bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <input
                  type="url"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  placeholder="URL Instagram (https://instagram.com/...)"
                  className="flex-1 bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <input
                  type="url"
                  value={editYoutube}
                  onChange={(e) => setEditYoutube(e.target.value)}
                  placeholder="URL YouTube (https://youtube.com/@...)"
                  className="flex-1 bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Stats + Edit button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 pt-6 border-t border-text-secondary/20">
            <div className="flex gap-4 md:gap-6 justify-between md:justify-start">
              <div className="text-center">
                <div className="font-display text-xl text-accent">{tier}</div>
                <div className="font-body text-xs text-text-secondary">tier</div>
              </div>
              <div className="text-center">
                <div className="font-display text-xl text-text-primary">{memberAchievements.length}</div>
                <div className="font-body text-xs text-text-secondary">trophées</div>
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
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveTab("projets");
                      setIsEditing(true);
                    }}
                  >
                    modifier
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveTab("trophees");
                      setIsEditing(true);
                    }}
                  >
                    <svg className="w-4 h-4 mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12v4a6 6 0 11-12 0V4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8H4a2 2 0 010-4h2M18 8h2a2 2 0 000-4h-2M9 20h6M12 14v6" />
                    </svg>
                    débloquer
                  </Button>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* Countdown - hidden when editing trophees */}
        {member.countdown_started_at && !(isEditing && activeTab === "trophees") && (
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

        {/* Tabs Navigation */}
        <div className="mt-6 flex border-b border-text-secondary/20">
          <button
            onClick={() => setActiveTab("projets")}
            className={`px-4 py-3 font-body text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === "projets"
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            Projets
            {member.projects && member.projects.length > 0 && (
              <span className="ml-1.5 text-xs opacity-60">({member.projects.length})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`px-4 py-3 font-body text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === "journal"
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            Journal
            {member.streak_count > 0 && (
              <span className="ml-1.5 text-orange-400">🔥{member.streak_count}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("trophees")}
            className={`px-4 py-3 font-body text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === "trophees"
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            Trophées
            <span className="ml-1.5 text-xs opacity-60">({memberAchievements.length}/{achievements.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PROJETS TAB */}
          {activeTab === "projets" && (
            <>
              {isOwner && isEditing ? (
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
              ) : member.projects && member.projects.length > 0 ? (
                <div className="space-y-2">
                  {member.projects.map((project) => (
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
              ) : (
                <div className="bg-bg-dark border border-text-secondary/20 p-8 text-center">
                  <p className="font-body text-sm text-text-secondary">
                    {isOwner ? "Clique sur \"modifier\" pour ajouter tes projets" : "Aucun projet pour l'instant"}
                  </p>
                </div>
              )}

              {/* Bouton Modifier en bas */}
              {isOwner && !isEditing && (
                <div className="mt-4 text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    modifier
                  </Button>
                </div>
              )}
            </>
          )}

          {/* JOURNAL TAB */}
          {activeTab === "journal" && (
            <>
              {/* Post form (owner only) */}
              {isOwner && (
                <div className="bg-bg-dark border border-text-secondary/20 p-4 mb-4">
                  <textarea
                    value={newUpdateContent}
                    onChange={(e) => setNewUpdateContent(e.target.value.slice(0, 280))}
                    placeholder={alreadyPostedToday ? "Tu as déjà posté aujourd'hui ! Reviens demain 💪" : "Qu'as-tu fait aujourd'hui ?"}
                    disabled={alreadyPostedToday}
                    className="w-full bg-bg-darker border border-text-secondary/30 px-3 py-2 text-text-primary font-body text-sm focus:border-accent focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-body text-xs text-text-secondary">
                      {newUpdateContent.length}/280
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handlePostUpdate}
                      disabled={alreadyPostedToday || !newUpdateContent.trim() || postingUpdate}
                    >
                      {postingUpdate ? "..." : "poster"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Updates list */}
              {updates.length > 0 ? (
                <div className="space-y-3">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className="bg-bg-dark border border-text-secondary/20 p-4"
                    >
                      {editingUpdateId === update.id ? (
                        // Edit mode
                        <>
                          <textarea
                            value={editingUpdateContent}
                            onChange={(e) => setEditingUpdateContent(e.target.value.slice(0, 280))}
                            className="w-full bg-bg-darker border border-accent px-3 py-2 text-text-primary font-body text-sm focus:outline-none resize-none"
                            rows={4}
                            autoFocus
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-body text-xs text-text-secondary">
                              {editingUpdateContent.length}/280
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={cancelEditingUpdate}
                                className="px-3 py-1 font-body text-xs text-text-secondary hover:text-text-primary transition-colors"
                              >
                                annuler
                              </button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={saveUpdateEdit}
                                disabled={!editingUpdateContent.trim()}
                              >
                                sauvegarder
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        // View mode
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-body text-xs text-text-secondary">
                              {formatRelativeDate(update.created_at)}
                            </span>
                            {isOwner && (
                              <button
                                onClick={() => startEditingUpdate(update)}
                                className="text-text-secondary hover:text-accent transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <p className="font-body text-sm text-text-primary whitespace-pre-wrap">{update.content}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-bg-dark border border-text-secondary/20 p-8 text-center">
                  <p className="font-body text-sm text-text-secondary">
                    {isOwner ? "Poste ta première update pour commencer ton streak ! 🔥" : "Aucune update pour l'instant."}
                  </p>
                </div>
              )}
            </>
          )}

          {/* TROPHEES TAB */}
          {activeTab === "trophees" && (
            <>
              {isOwner && isEditing ? (
                // Edit mode: list with checkboxes
                <>
                  <p className="font-body text-sm text-text-secondary mb-4">
                    Coche les étapes que tu as accomplies. Ton tier monte avec chaque trophée !
                  </p>
                  <div className="space-y-2">
                    {achievements
                      .filter((a) => !a.id.startsWith("streak_"))
                      .map((achievement) => {
                        const isUnlocked = memberAchievements.some((ma) => ma.achievement_id === achievement.id);
                        return (
                          <button
                            key={achievement.id}
                            onClick={() => toggleAchievement(achievement.id)}
                            className={`w-full flex items-center gap-4 p-3 border transition-all ${
                              isUnlocked
                                ? "bg-accent/10 border-accent"
                                : "bg-bg-dark border-text-secondary/20 hover:border-text-secondary/40"
                            }`}
                          >
                            <div className="w-8 h-8 flex-shrink-0">
                              <AchievementIcon
                                achievementId={achievement.id}
                                className="w-full h-full"
                                unlocked={isUnlocked}
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div className={`font-display text-sm ${isUnlocked ? "text-accent" : "text-text-primary"}`}>
                                {achievement.name}
                              </div>
                              <div className="font-body text-xs text-text-secondary">
                                {achievement.description}
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${
                                isUnlocked ? "bg-accent border-accent" : "border-text-secondary/50"
                              }`}
                            >
                              {isUnlocked && (
                                <svg className="w-3 h-3 text-bg-darker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>

                  {/* Streak achievements (automatic) */}
                  {achievements.some((a) => a.id.startsWith("streak_")) && (
                    <div className="mt-6 pt-4 border-t border-text-secondary/20">
                      <p className="font-body text-xs text-text-secondary mb-3">
                        Trophées automatiques (basés sur ton streak)
                      </p>
                      <div className="space-y-2">
                        {achievements
                          .filter((a) => a.id.startsWith("streak_"))
                          .map((achievement) => {
                            const isUnlocked = memberAchievements.some((ma) => ma.achievement_id === achievement.id);
                            return (
                              <div
                                key={achievement.id}
                                className={`w-full flex items-center gap-4 p-3 border ${
                                  isUnlocked
                                    ? "bg-orange-400/10 border-orange-400/50"
                                    : "bg-bg-dark border-text-secondary/10 opacity-50"
                                }`}
                              >
                                <div className="w-8 h-8 flex-shrink-0">
                                  <AchievementIcon
                                    achievementId={achievement.id}
                                    className="w-full h-full"
                                    unlocked={isUnlocked}
                                  />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className={`font-display text-sm ${isUnlocked ? "text-orange-400" : "text-text-secondary"}`}>
                                    {achievement.name}
                                  </div>
                                  <div className="font-body text-xs text-text-secondary">
                                    {achievement.description}
                                  </div>
                                </div>
                                {isUnlocked ? (
                                  <span className="text-orange-400 text-lg">🔥</span>
                                ) : (
                                  <svg className="w-5 h-5 text-text-secondary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // View mode: compact grid
                <>
                  {/* Unlocked trophies */}
                  {memberAchievements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-body text-xs text-text-secondary uppercase tracking-wider mb-3">
                        Débloqués ({memberAchievements.length})
                      </h3>
                      <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                        {achievements
                          .filter((a) => memberAchievements.some((ma) => ma.achievement_id === a.id))
                          .map((achievement) => (
                            <div
                              key={achievement.id}
                              className="relative group"
                            >
                              <div className="w-full aspect-square bg-bg-dark border border-accent/30 p-2 flex items-center justify-center">
                                <AchievementIcon
                                  achievementId={achievement.id}
                                  className="w-full h-full"
                                  unlocked={true}
                                />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-darker border border-text-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                <div className="font-display text-xs text-accent">{achievement.name}</div>
                                <div className="font-body text-[10px] text-text-secondary">{achievement.description}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Locked trophies */}
                  {achievements.length > memberAchievements.length && (
                    <div>
                      <h3 className="font-body text-xs text-text-secondary uppercase tracking-wider mb-3">
                        À débloquer ({achievements.length - memberAchievements.length})
                      </h3>
                      <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                        {achievements
                          .filter((a) => !memberAchievements.some((ma) => ma.achievement_id === a.id))
                          .map((achievement) => (
                            <div
                              key={achievement.id}
                              className="relative group"
                            >
                              <div className="w-full aspect-square bg-bg-dark border border-text-secondary/10 p-2 flex items-center justify-center opacity-30">
                                <AchievementIcon
                                  achievementId={achievement.id}
                                  className="w-full h-full"
                                  unlocked={false}
                                />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-darker border border-text-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                <div className="font-display text-xs text-text-primary">{achievement.name}</div>
                                <div className="font-body text-[10px] text-text-secondary">{achievement.description}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Bouton Modifier en bas */}
                  {isOwner && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        modifier
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
