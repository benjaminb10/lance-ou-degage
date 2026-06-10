// Projection pseudo-3D pour la page /la-route
// Caméra à hauteur fixe au-dessus d'une route droite le long de +z

export const NEAR = 0.5; // distance min de rendu
export const FAR = 70; // distance max de rendu
export const CAM_H = 1; // hauteur caméra (unités monde)
export const CAM_DEPTH = 2.2; // focale
export const ROAD_WIDTH = 2.4; // largeur route (unités monde)
export const HORIZON_RATIO = 0.35; // proportion du ciel
export const SPACING = 6; // espacement entre membres
export const Z_FIRST_OFFSET = 5; // distance du dernier membre depuis z=0
export const VIEW_BACK = 5; // recul caméra par rapport au membre focus
export const VEHICLE_SCALE = 3.8; // facteur d'échelle des véhicules DOM
export const BAND_LEN = 1.5; // longueur d'une bande de route

// "plage" est une zone de décor uniquement (transition route → mer)
export type TierZone = "route" | "plage" | "mer" | "ciel" | "espace";

export function tierZone(tier: number): TierZone {
  if (tier >= 8) return "espace";
  if (tier === 7) return "ciel";
  if (tier >= 5) return "mer";
  return "route";
}

// Hauteur monde au-dessus de la route (jet/fusée flottent)
export function tierAltitude(tier: number): number {
  if (tier >= 8) return 0.75;
  if (tier === 7) return 0.6;
  return 0;
}

// Segment contigu de décor le long de la route (z croissant)
export interface ZoneSegment {
  zone: TierZone;
  zStart: number; // -Infinity pour le premier segment
  zEnd: number; // +Infinity pour le dernier
}

export const PLAGE_LEN = 4; // largeur de la bande de sable route → mer

// Découpe la route en zones d'après les tiers des membres + véhicules fantômes.
// Fantômes puis leader proches caméra : les zones décroissent le long de +z
// (espace au premier plan → route au fond).
export function computeZoneSegments(
  tiers: number[],
  total: number,
  ghostTiers: number[] = []
): ZoneSegment[] {
  // liste des véhicules en z croissant
  const gc = ghostTiers.length;
  const zs: number[] = [];
  const zoneList: TierZone[] = [];
  for (let g = gc - 1; g >= 0; g--) {
    zs.push(ghostZ(g, gc));
    zoneList.push(tierZone(ghostTiers[g]));
  }
  for (let i = 0; i < total; i++) {
    zs.push(memberZ(i, gc));
    zoneList.push(tierZone(tiers[i]));
  }
  if (zs.length === 0) {
    return [{ zone: "route", zStart: -Infinity, zEnd: Infinity }];
  }
  const segs: ZoneSegment[] = [];
  let cur = zoneList[0];
  let start = -Infinity;
  for (let i = 1; i < zs.length; i++) {
    if (zoneList[i] !== cur) {
      // frontière au milieu entre les deux véhicules
      const boundary = (zs[i - 1] + zs[i]) / 2;
      segs.push({ zone: cur, zStart: start, zEnd: boundary });
      cur = zoneList[i];
      start = boundary;
    }
  }
  segs.push({ zone: cur, zStart: start, zEnd: Infinity });
  return insertBeaches(segs);
}

// Insère une bande de sable centrée sur chaque frontière route ↔ mer
function isBeachBoundary(a: TierZone, b: TierZone): boolean {
  return (a === "route" && b === "mer") || (a === "mer" && b === "route");
}

function insertBeaches(segs: ZoneSegment[]): ZoneSegment[] {
  const out: ZoneSegment[] = [];
  for (let i = 0; i < segs.length; i++) {
    const prev = segs[i - 1];
    const next = segs[i + 1];
    const s = { ...segs[i] };
    if (prev && isBeachBoundary(prev.zone, s.zone)) {
      s.zStart += PLAGE_LEN / 2;
    }
    if (next && isBeachBoundary(s.zone, next.zone)) {
      s.zEnd -= PLAGE_LEN / 2;
      out.push(s, { zone: "plage", zStart: s.zEnd, zEnd: s.zEnd + PLAGE_LEN });
    } else {
      out.push(s);
    }
  }
  return out;
}

export interface Projected {
  x: number;
  y: number;
  scale: number;
  dz: number;
  visible: boolean;
}

export function project(
  worldX: number,
  worldY: number,
  worldZ: number,
  cameraZ: number,
  w: number,
  h: number
): Projected {
  const dz = worldZ - cameraZ;
  if (dz <= NEAR) return { x: 0, y: 0, scale: 0, dz, visible: false };
  const scale = CAM_DEPTH / dz;
  return {
    x: w / 2 + scale * worldX * (w / 2),
    y: h * HORIZON_RATIO + scale * (CAM_H - worldY) * (h / 2),
    scale,
    dz,
    visible: dz < FAR,
  };
}

// index 0 = rang 1 (le tableau est trié tier DESC, mrr DESC)
// le leader est le plus proche de la caméra, juste derrière les fantômes
export function memberZ(index: number, ghosts: number): number {
  return Z_FIRST_OFFSET + (ghosts + index) * SPACING;
}

export function laneX(index: number): number {
  return [-0.45, 0.45, 0][index % 3] * (ROAD_WIDTH / 2);
}

// z d'un véhicule fantôme (tiers à débloquer, devant le leader)
// la fusée (dernier de ghostTiers) est la plus proche de la caméra
export function ghostZ(g: number, ghosts: number): number {
  return Z_FIRST_OFFSET + (ghosts - 1 - g) * SPACING;
}

export function maxCameraZ(total: number, ghosts = 0): number {
  const lastSlot = Math.max(total + ghosts - 1, 0);
  return Math.max(0, Z_FIRST_OFFSET + lastSlot * SPACING - VIEW_BACK);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
