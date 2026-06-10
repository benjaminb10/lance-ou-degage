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
  if (tier >= 8) return 1.1;
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
// tiers[0] = rang 1 = z le plus grand ; le long de +z les zones sont croissantes.
export function computeZoneSegments(
  tiers: number[],
  total: number,
  ghostTiers: number[] = []
): ZoneSegment[] {
  // liste (z croissant) : du dernier membre au leader, puis les fantômes
  const zs: number[] = [];
  const zoneList: TierZone[] = [];
  for (let i = total - 1; i >= 0; i--) {
    zs.push(memberZ(i, total));
    zoneList.push(tierZone(tiers[i]));
  }
  for (let g = 0; g < ghostTiers.length; g++) {
    zs.push(ghostZ(g, total));
    zoneList.push(tierZone(ghostTiers[g]));
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

// Insère une bande de sable centrée sur chaque frontière route → mer
function insertBeaches(segs: ZoneSegment[]): ZoneSegment[] {
  const out: ZoneSegment[] = [];
  for (let i = 0; i < segs.length; i++) {
    const prev = segs[i - 1];
    const next = segs[i + 1];
    const s = { ...segs[i] };
    if (prev && prev.zone === "route" && s.zone === "mer") {
      s.zStart += PLAGE_LEN / 2;
    }
    if (next && s.zone === "route" && next.zone === "mer") {
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
// le leader est le plus loin devant sur la route
export function memberZ(index: number, total: number): number {
  return Z_FIRST_OFFSET + (total - 1 - index) * SPACING;
}

export function laneX(index: number): number {
  return [-0.45, 0.45, 0][index % 3] * (ROAD_WIDTH / 2);
}

// z d'un véhicule fantôme (tiers à débloquer, au-delà du leader)
export function ghostZ(g: number, total: number): number {
  return Z_FIRST_OFFSET + (Math.max(total - 1, 0) + g + 1) * SPACING;
}

export function maxCameraZ(total: number, ghosts = 0): number {
  const lastZ = ghosts > 0 ? ghostZ(ghosts - 1, total) : memberZ(0, total);
  return Math.max(0, lastZ - VIEW_BACK);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
