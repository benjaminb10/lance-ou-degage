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

// Métadonnées d'affichage par tier — garder synchro avec getTier
export interface TierInfo {
  name: (typeof VEHICLE_NAMES)[number];
  requirement: string;
  description: string;
}

export const TIER_INFO: TierInfo[] = [
  { name: "trottinette", requirement: "départ", description: "tout le monde commence ici. pousse." },
  { name: "vélo", requirement: "1 trophée", description: "premier trophée, premier coup de pédale." },
  { name: "moto", requirement: "3 trophées", description: "ça accélère. tu prends le rythme." },
  { name: "voiture", requirement: "5 trophées", description: "tu roules sérieux maintenant." },
  { name: "sport", requirement: "8 trophées", description: "tu shippes plus vite que les autres." },
  { name: "jetski", requirement: "11 trophées", description: "presque tous les trophées. t'as quitté la route." },
  { name: "yacht", requirement: "5 000 € mrr", description: "ici c'est ton mrr qui parle." },
  { name: "jet privé", requirement: "10 000 € mrr", description: "tu survoles le game." },
  { name: "fusée", requirement: "20 000 € mrr", description: "ça scale. direction l'espace." },
];

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
