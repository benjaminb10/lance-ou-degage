import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, type Member } from "~/lib/supabase";
import { Vehicle } from "~/components/landing/VehicleSVG";

export const Route = createFileRoute("/membre/$id")({
  component: MemberProfile,
});

function MemberProfile() {
  const { id } = Route.useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchMember();
  }, [id]);

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
          className="bg-bg-dark border border-text-secondary/20 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent bg-bg-darker flex-shrink-0">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent font-display text-3xl">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl text-text-primary">{member.name}</h1>
                {member.is_founder && (
                  <span className="px-2 py-0.5 bg-accent/20 border border-accent text-accent text-xs font-body">
                    fondateur
                  </span>
                )}
              </div>

              {member.bio && (
                <p className="font-body text-text-secondary mt-2">{member.bio}</p>
              )}

              {/* Social links */}
              <div className="flex items-center gap-4 mt-4">
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
            <div className="flex-shrink-0">
              <Vehicle tier={member.tier} className="w-16 h-16" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-text-secondary/20">
            <div className="text-center">
              <div className="font-display text-2xl text-accent">{member.tier}</div>
              <div className="font-body text-xs text-text-secondary uppercase">tier</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl text-text-primary">{member.mrr}€</div>
              <div className="font-body text-xs text-text-secondary uppercase">MRR</div>
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        {member.countdown_started_at && (
          <motion.div
            className={`mt-6 p-8 border text-center ${
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
            ) : (
              <>
                <h2 className="font-display text-lg text-accent mb-4">TEMPS RESTANT</h2>
                <div className="flex justify-center items-center gap-4">
                  <div className="text-center">
                    <div className="font-display text-5xl md:text-6xl text-text-primary">{countdown.days}</div>
                    <div className="font-body text-xs text-text-secondary uppercase mt-1">jours</div>
                  </div>
                  <span className="font-display text-3xl text-accent">:</span>
                  <div className="text-center">
                    <div className="font-display text-5xl md:text-6xl text-text-primary">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="font-body text-xs text-text-secondary uppercase mt-1">heures</div>
                  </div>
                  <span className="font-display text-3xl text-accent">:</span>
                  <div className="text-center">
                    <div className="font-display text-5xl md:text-6xl text-text-primary">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="font-body text-xs text-text-secondary uppercase mt-1">min</div>
                  </div>
                  <span className="font-display text-3xl text-accent animate-pulse">:</span>
                  <div className="text-center">
                    <div className="font-display text-5xl md:text-6xl text-accent">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="font-body text-xs text-text-secondary uppercase mt-1">sec</div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Projects */}
        {member.projects && member.projects.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl text-text-primary mb-4">Projets</h2>
            <div className="space-y-3">
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
          </motion.div>
        )}
      </div>
    </main>
  );
}
