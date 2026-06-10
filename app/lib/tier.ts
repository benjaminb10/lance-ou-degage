import type { Member } from "~/lib/supabase";

// Noms des véhicules par tier (0 → 8)
export const VEHICLE_NAMES = [
  "trottinette",
  "vélo",
  "moto",
  "voiture",
  "sport",
  "jetski",
  "yacht",
  "jet privé",
  "fusée",
] as const;

// Source de vérité unique : tier calculé depuis trophées + MRR
export function getTier(trophyCount: number, mrr: number): number {
  // Hauts tiers débloqués au MRR uniquement
  if (mrr >= 20000) return 8; // fusée
  if (mrr >= 10000) return 7; // jet privé
  if (mrr >= 5000) return 6; // yacht
  // Tiers basés sur les trophées (plafond : jetski)
  if (trophyCount >= 11) return 5;
  if (trophyCount >= 8) return 4;
  if (trophyCount >= 5) return 3;
  if (trophyCount >= 3) return 2;
  if (trophyCount >= 1) return 1;
  return 0;
}

// Tier d'un membre dont les member_achievements ont été joints
export function memberTier(
  member: Pick<Member, "mrr" | "member_achievements">
): number {
  return getTier(member.member_achievements?.length || 0, member.mrr);
}
