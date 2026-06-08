import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, type Member } from "~/lib/supabase";
import { MemberCard } from "~/components/MemberCard";
import { StatsGrid } from "~/components/StatsGrid";

// Fallback data for when Supabase is not configured
const fallbackFounders: Member[] = [
  {
    id: "1",
    stripe_session_id: null,
    email: "",
    name: "Benjamin Benoudis",
    linkedin_url: null,
    twitter_url: null,
    avatar_url: "/founders/benjamin-benoudis.png",
    bio: null,
    tier: 2,
    mrr: 3500,
    joined_at: "",
    onboarding_completed: true,
    discord_invited: true,
    is_founder: true,
    visible: true,
    whatsapp: null,
    countdown_started_at: null,
    auth_id: null,
    projects: [
      { id: "1", member_id: "1", name: "BeReach.ai", url: "https://bereach.ai", description: null, mrr: 0 },
      { id: "2", member_id: "1", name: "Viewlify.app", url: "https://www.viewlify.app", description: null, mrr: 0 },
      { id: "3", member_id: "1", name: "lance-ou-degage.fr", url: "https://www.lance-ou-degage.fr", description: null, mrr: 0 },
    ],
  },
  {
    id: "2",
    stripe_session_id: null,
    email: "",
    name: "Alexandre Sarfati",
    linkedin_url: null,
    twitter_url: null,
    avatar_url: "/founders/alexandre-sarfati.png",
    bio: null,
    tier: 2,
    mrr: 3500,
    joined_at: "",
    onboarding_completed: true,
    discord_invited: true,
    is_founder: true,
    visible: true,
    whatsapp: null,
    countdown_started_at: null,
    auth_id: null,
    projects: [
      { id: "4", member_id: "2", name: "PIMMS.io", url: "https://pimms.io", description: null, mrr: 0 },
      { id: "5", member_id: "2", name: "BeReach.ai", url: "https://bereach.ai", description: null, mrr: 0 },
    ],
  },
  {
    id: "3",
    stripe_session_id: null,
    email: "",
    name: "Axel Briche",
    linkedin_url: null,
    twitter_url: null,
    avatar_url: "/founders/axel-briche.png",
    bio: null,
    tier: 0,
    mrr: 0,
    joined_at: "",
    onboarding_completed: true,
    discord_invited: true,
    is_founder: true,
    visible: true,
    whatsapp: null,
    countdown_started_at: null,
    auth_id: null,
    projects: [
      { id: "6", member_id: "3", name: "Tailwind2Landing", url: "https://tailwind2landing.com", description: null, mrr: 0 },
    ],
  },
];

export function SocialProof() {
  const [members, setMembers] = useState<Member[]>(fallbackFounders);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(fallbackFounders.length);
  const [totalMRR, setTotalMRR] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTrophies, setTotalTrophies] = useState(0);

  useEffect(() => {
    async function fetchMembers() {
      try {
        // Fetch top 5 members for display
        const { data, error, count } = await supabase
          .from("members")
          .select(
            `
            *,
            projects(*)
          `,
            { count: "exact" }
          )
          .eq("onboarding_completed", true)
          .eq("visible", true)
          .order("tier", { ascending: false })
          .order("mrr", { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          setMembers(data);
          setTotalCount(count || data.length);
        }

        // Fetch all members for total stats
        const { data: allMembers } = await supabase
          .from("members")
          .select("mrr, projects(id), member_achievements(achievement_id)")
          .eq("onboarding_completed", true)
          .eq("visible", true);

        if (allMembers) {
          const mrr = allMembers.reduce((acc, m) => acc + (m.mrr || 0), 0);
          const projects = allMembers.reduce((acc, m) => acc + (m.projects?.length || 0), 0);
          const trophies = allMembers.reduce((acc, m) => acc + (m.member_achievements?.length || 0), 0);
          setTotalMRR(mrr);
          setTotalProjects(projects);
          setTotalTrophies(trophies);
        }
      } catch (err) {
        // Use fallback data if Supabase fetch fails
        console.warn("Using fallback founder data");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  return (
    <section id="founders" className="relative py-32 px-4 bg-bg-dark overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
        style={{ background: "var(--color-accent-glow)", opacity: 0.2 }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-accent text-sm tracking-widest uppercase">
            La communauté
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-text-primary mt-2">
            ils livrent.
          </h2>
        </motion.div>

        {/* Stats globales */}
        <div className="mb-12">
          <StatsGrid
            members={totalCount}
            mrr={totalMRR}
            projects={totalProjects}
            trophies={totalTrophies}
            delay={0.1}
          />
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-bg-darker/80 border border-text-secondary/20 p-6 h-24 animate-pulse"
              />
            ))
          ) : (
            members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                rank={index + 1}
                delay={index * 0.1}
              />
            ))
          )}
        </div>

        {/* Link to full leaderboard */}
        {totalCount > 5 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a
              href="/leaderboard"
              className="font-body text-accent hover:text-text-primary transition-colors"
            >
              voir les {totalCount} lanceurs →
            </a>
          </motion.div>
        )}

        {/* CTA subtil */}
        <motion.p
          className="text-center font-body text-text-secondary mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          ta place est ici.{" "}
          <a href="#pricing" className="text-accent hover:underline">
            rejoins-nous.
          </a>
        </motion.p>
      </div>
    </section>
  );
}
