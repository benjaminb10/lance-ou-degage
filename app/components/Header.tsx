import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth, signOut } from "~/lib/auth";
import { supabase, type MemberAchievement } from "~/lib/supabase";
import { AchievementIcon } from "~/components/AchievementIcons";

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

  return (
    <header className="sticky top-0 z-50 bg-bg-darker border-b border-text-secondary/20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-sm md:text-xl text-accent hover:text-text-primary transition-colors">
          LANCE OU DÉGAGE
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-6">
          <Link
            to="/leaderboard"
            className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            to="/feed"
            className="font-body text-sm text-text-secondary hover:text-accent transition-colors"
          >
            Feed
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
                <div className="absolute right-0 mt-2 w-64 bg-bg-dark border border-text-secondary/20 shadow-lg">
                  {/* Member info */}
                  <div className="px-4 py-3 border-b border-text-secondary/20">
                    <div className="font-display text-text-primary">{member.name}</div>
                    <div className="font-body text-xs text-text-secondary">{member.email}</div>
                  </div>

                  {/* Trophies - clickable */}
                  {achievements.length > 0 && (
                    <a
                      href={`/membre/${member.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 border-b border-text-secondary/20 hover:bg-accent/10 transition-colors"
                    >
                      <div className="font-body text-xs text-text-secondary mb-2">Mes trophées</div>
                      <div className="flex items-center gap-1">
                        {displayedAchievements.map((ma) => (
                          <div key={ma.achievement_id} className="w-6 h-6" title={ma.achievement?.name}>
                            <AchievementIcon
                              achievementId={ma.achievement_id}
                              className="w-full h-full"
                              unlocked={true}
                            />
                          </div>
                        ))}
                        {extraCount > 0 && (
                          <div className="w-6 h-6 flex items-center justify-center font-body text-xs text-text-secondary">
                            +{extraCount}
                          </div>
                        )}
                      </div>
                    </a>
                  )}

                  {/* Links */}
                  <div className="py-1">
                    <a
                      href={`/membre/${member.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 font-body text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 font-body text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not connected: Login button */
            <Link
              to="/login"
              className="px-4 py-1.5 border border-accent text-accent font-body text-sm hover:bg-accent hover:text-bg-darker transition-colors"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
