import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth, signOut } from "~/lib/auth";
import { supabase, type MemberAchievement } from "~/lib/supabase";
import { AchievementIcon } from "~/components/AchievementIcons";
import { Vehicle } from "~/components/landing/VehicleSVG";

export function Header() {
  const { user, member, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [achievements, setAchievements] = useState<MemberAchievement[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch member achievements
  useEffect(() => {
    if (member) {
      fetchAchievements();
    }
  }, [member]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchAchievements() {
    if (!member) return;
    const { data } = await supabase
      .from("member_achievements")
      .select("*, achievement:achievements(*)")
      .eq("member_id", member.id)
      .order("unlocked_at", { ascending: false });
    if (data) {
      setAchievements(data);
    }
  }

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
    navigate({ to: "/" });
  }

  const displayedAchievements = achievements.slice(0, 5);
  const extraCount = achievements.length - 5;

  // Calculate tier from trophies and MRR
  function getTier(trophyCount: number, mrr: number): number {
    // Fusée = 10k MRR
    if (mrr >= 10000) return 8;
    // Other tiers based on trophies
    if (trophyCount >= 17) return 7;
    if (trophyCount >= 14) return 6;
    if (trophyCount >= 11) return 5;
    if (trophyCount >= 8) return 4;
    if (trophyCount >= 5) return 3;
    if (trophyCount >= 3) return 2;
    if (trophyCount >= 1) return 1;
    return 0;
  }
  const tier = getTier(achievements.length, member?.mrr || 0);

  return (
    <header className="sticky top-0 z-50 bg-bg-darker border-b border-text-secondary/20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-accent hover:text-text-primary transition-colors">
          <span className="md:hidden text-base">LOD</span>
          <span className="hidden md:inline text-xl">LANCE OU DÉGAGE</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-6">
          <Link
            to="/leaderboard"
            className="flex items-center gap-1.5 font-body text-sm text-text-secondary hover:text-accent transition-colors"
            title="Leaderboard"
          >
            <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden md:inline">Leaderboard</span>
          </Link>
          <Link
            to="/feed"
            className="flex items-center gap-1.5 font-body text-sm text-text-secondary hover:text-accent transition-colors"
            title="Feed"
          >
            <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="hidden md:inline">Feed</span>
          </Link>
          <Link
            to="/trophees"
            className="flex items-center gap-1.5 font-body text-sm text-text-secondary hover:text-accent transition-colors"
            title="Trophées"
          >
            <svg className="w-5 h-5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12v4a6 6 0 11-12 0V4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8H4a2 2 0 010-4h2M18 8h2a2 2 0 000-4h-2M9 20h6M12 14v6" />
            </svg>
            <span className="hidden md:inline">Trophées</span>
          </Link>

          {/* Auth section */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-text-secondary/20 animate-pulse" />
          ) : member ? (
            /* Connected: Avatar + Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent bg-bg-dark">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent font-display text-sm">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-text-secondary transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-bg-dark border border-text-secondary/20 shadow-lg overflow-hidden">
                  {/* Profile card - clickable */}
                  <a
                    href={`/membre/${member.id}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 border-b border-text-secondary/20 hover:bg-accent/10 transition-colors group"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent bg-bg-darker flex-shrink-0 group-hover:border-text-primary transition-colors">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-accent font-display text-sm">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-sm text-text-primary group-hover:text-accent transition-colors truncate">
                          {member.name}
                        </span>
                        {member.streak_count > 0 && (
                          <span className="text-xs text-orange-400 flex-shrink-0">🔥{member.streak_count}</span>
                        )}
                      </div>
                      <div className="font-body text-xs text-text-secondary truncate">{member.email}</div>
                    </div>
                    {/* Vehicle */}
                    <div className="flex-shrink-0 text-center">
                      <Vehicle tier={tier} className="w-9 h-9" />
                      <div className="font-body text-[9px] text-text-secondary mt-0.5">
                        {["trottinette", "vélo", "moto", "voiture", "sport", "jetski", "yacht", "jet", "fusée"][tier]}
                      </div>
                    </div>
                  </a>

                  {/* Trophies - clickable */}
                  {achievements.length > 0 && (
                    <a
                      href={`/membre/${member.id}?tab=trophees`}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 border-b border-text-secondary/20 hover:bg-accent/10 transition-colors"
                    >
                      <div className="font-body text-xs text-text-secondary mb-2">Mes trophées</div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 flex-1">
                          {displayedAchievements.map((ma) => (
                            <div key={ma.achievement_id} className="w-7 h-7" title={ma.achievement?.name}>
                              <AchievementIcon
                                achievementId={ma.achievement_id}
                                className="w-full h-full"
                                unlocked={true}
                              />
                            </div>
                          ))}
                          {extraCount > 0 && (
                            <div className="flex items-center justify-center font-body text-xs text-text-secondary ml-1">
                              +{extraCount}
                            </div>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  )}

                  {/* Actions */}
                  <div className="py-2">
                    <a
                      href={`/membre/${member.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon profil
                    </a>
                    <a
                      href="/feed"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      Feed
                    </a>
                    <div className="border-t border-text-secondary/20 my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not connected: CTA + Login */
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/login"
                className="px-3 md:px-4 py-1.5 border border-text-secondary/30 text-text-secondary font-body text-xs md:text-sm hover:border-accent hover:text-accent transition-colors"
              >
                Connexion
              </Link>
              <a
                href="#pricing"
                className="px-3 md:px-4 py-1.5 bg-accent text-bg-darker font-body text-xs md:text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                Rejoindre
              </a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
