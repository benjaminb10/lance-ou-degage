// Rendu canvas du décor : ciel, étoiles, soleil, silhouettes, sol par zones
// (asphalte → mer → ciel → espace) en perspective scanline
import {
  BAND_LEN,
  CAM_DEPTH,
  CAM_H,
  FAR,
  HORIZON_RATIO,
  NEAR,
  ROAD_WIDTH,
  SPACING,
  VIEW_BACK,
  type TierZone,
  type ZoneSegment,
} from "./projection";

export interface SceneState {
  w: number;
  h: number;
  cameraZ: number;
  stripePhase: number;
  t: number;
  zones: ZoneSegment[];
}

// --- Palettes par zone ---------------------------------------------------

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ZonePalette {
  groundA: RGB;
  groundB: RGB;
  roadA: RGB;
  roadB: RGB;
  groundAStr: string;
  groundBStr: string;
  roadAStr: string;
  roadBStr: string;
  rumbleAlpha: number; // bandes latérales + ligne centrale
  sparkleAlpha: number; // éclats d'eau
  groundStarAlpha: number; // étoiles au sol (espace)
  skyTop: RGB;
  skyMid: RGB;
  skyBot: RGB;
  sunAlpha: number;
  starBoost: number;
  extraStarAlpha: number;
  silhouetteAlpha: number;
  horizonAlpha: number;
  planetAlpha: number;
}

function hexRGB(hex: string): RGB {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

const rgbStr = (c: RGB) => `rgb(${c.r},${c.g},${c.b})`;

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

function lerpRGBStr(a: RGB, b: RGB, f: number): string {
  return `rgb(${Math.round(lerp(a.r, b.r, f))},${Math.round(
    lerp(a.g, b.g, f)
  )},${Math.round(lerp(a.b, b.b, f))})`;
}

function makePalette(o: {
  ground: [string, string];
  road: [string, string];
  sky: [string, string, string];
  rumbleAlpha: number;
  sparkleAlpha: number;
  groundStarAlpha: number;
  sunAlpha: number;
  starBoost: number;
  extraStarAlpha: number;
  silhouetteAlpha: number;
  horizonAlpha: number;
  planetAlpha: number;
}): ZonePalette {
  const groundA = hexRGB(o.ground[0]);
  const groundB = hexRGB(o.ground[1]);
  const roadA = hexRGB(o.road[0]);
  const roadB = hexRGB(o.road[1]);
  return {
    groundA,
    groundB,
    roadA,
    roadB,
    groundAStr: rgbStr(groundA),
    groundBStr: rgbStr(groundB),
    roadAStr: rgbStr(roadA),
    roadBStr: rgbStr(roadB),
    rumbleAlpha: o.rumbleAlpha,
    sparkleAlpha: o.sparkleAlpha,
    groundStarAlpha: o.groundStarAlpha,
    skyTop: hexRGB(o.sky[0]),
    skyMid: hexRGB(o.sky[1]),
    skyBot: hexRGB(o.sky[2]),
    sunAlpha: o.sunAlpha,
    starBoost: o.starBoost,
    extraStarAlpha: o.extraStarAlpha,
    silhouetteAlpha: o.silhouetteAlpha,
    horizonAlpha: o.horizonAlpha,
    planetAlpha: o.planetAlpha,
  };
}

const PALETTES: Record<TierZone, ZonePalette> = {
  route: makePalette({
    ground: ["#211a15", "#1d1712"],
    road: ["#2a2a2a", "#252525"],
    sky: ["#1a1520", "#2a1a2a", "#3d2520"],
    rumbleAlpha: 1,
    sparkleAlpha: 0,
    groundStarAlpha: 0,
    sunAlpha: 1,
    starBoost: 1,
    extraStarAlpha: 0,
    silhouetteAlpha: 0.85,
    horizonAlpha: 1,
    planetAlpha: 0,
  }),
  plage: makePalette({
    ground: ["#4a3c22", "#443720"],
    road: ["#4a3c22", "#443720"],
    sky: ["#151722", "#202231", "#332f35"],
    rumbleAlpha: 0,
    sparkleAlpha: 0,
    groundStarAlpha: 0,
    sunAlpha: 1,
    starBoost: 1,
    extraStarAlpha: 0,
    silhouetteAlpha: 0.45,
    horizonAlpha: 1,
    planetAlpha: 0,
  }),
  mer: makePalette({
    ground: ["#0c2233", "#0a1c2b"],
    road: ["#0c2233", "#0a1c2b"],
    sky: ["#101826", "#16243a", "#2a3d4a"],
    rumbleAlpha: 0,
    sparkleAlpha: 1,
    groundStarAlpha: 0,
    sunAlpha: 1,
    starBoost: 1,
    extraStarAlpha: 0,
    silhouetteAlpha: 0.25,
    horizonAlpha: 1,
    planetAlpha: 0,
  }),
  ciel: makePalette({
    ground: ["#252338", "#201e30"],
    road: ["#252338", "#201e30"],
    sky: ["#0e1020", "#141a30", "#1c2440"],
    rumbleAlpha: 0,
    sparkleAlpha: 0.3,
    groundStarAlpha: 0,
    sunAlpha: 0.4,
    starBoost: 1.5,
    extraStarAlpha: 0.3,
    silhouetteAlpha: 0,
    horizonAlpha: 0.5,
    planetAlpha: 0,
  }),
  espace: makePalette({
    ground: ["#0a0a12", "#08080e"],
    road: ["#0a0a12", "#08080e"],
    sky: ["#05050a", "#07070e", "#0a0a14"],
    rumbleAlpha: 0,
    sparkleAlpha: 0,
    groundStarAlpha: 1,
    sunAlpha: 0,
    starBoost: 2,
    extraStarAlpha: 1,
    silhouetteAlpha: 0,
    horizonAlpha: 0.25,
    planetAlpha: 1,
  }),
};

// --- Transitions ----------------------------------------------------------

const T_GROUND = 2; // largeur de blend sol (unités monde), assez étroite pour
// qu'aucun véhicule ne repose sur un sol mixé (plage incluse)
const T_GROUND_HALF = T_GROUND / 2;
const T_AMB_HALF = SPACING / 2; // transition d'ambiance plus large

function segIndexAt(zones: ZoneSegment[], z: number): number {
  let i = zones.length - 1;
  while (i > 0 && z < zones[i].zStart) i--;
  return i;
}

function zoneAt(zones: ZoneSegment[], z: number): TierZone {
  return zones[segIndexAt(zones, z)].zone;
}

// Ambiance lerpée par frame (scratch module scope, zéro allocation d'objet)
const amb = {
  skyTop: "",
  skyMid: "",
  skyBot: "",
  fogR: 0,
  fogG: 0,
  fogB: 0,
  sunAlpha: 1,
  starBoost: 1,
  extraStarAlpha: 0,
  silhouetteAlpha: 0.85,
  horizonAlpha: 1,
  planetAlpha: 0,
};

function computeAmbiance(zones: ZoneSegment[], focusZ: number) {
  const i = segIndexAt(zones, focusZ);
  const seg = zones[i];
  const pal = PALETTES[seg.zone];
  let f = 1;
  let other = pal;
  if (i > 0 && focusZ < seg.zStart + T_AMB_HALF) {
    f = (focusZ - seg.zStart + T_AMB_HALF) / (T_AMB_HALF * 2);
    other = PALETTES[zones[i - 1].zone];
  } else if (i < zones.length - 1 && focusZ > seg.zEnd - T_AMB_HALF) {
    f = (seg.zEnd + T_AMB_HALF - focusZ) / (T_AMB_HALF * 2);
    other = PALETTES[zones[i + 1].zone];
  }
  amb.skyTop = lerpRGBStr(other.skyTop, pal.skyTop, f);
  amb.skyMid = lerpRGBStr(other.skyMid, pal.skyMid, f);
  amb.skyBot = lerpRGBStr(other.skyBot, pal.skyBot, f);
  amb.fogR = Math.round(lerp(other.skyTop.r, pal.skyTop.r, f));
  amb.fogG = Math.round(lerp(other.skyTop.g, pal.skyTop.g, f));
  amb.fogB = Math.round(lerp(other.skyTop.b, pal.skyTop.b, f));
  amb.sunAlpha = lerp(other.sunAlpha, pal.sunAlpha, f);
  amb.starBoost = lerp(other.starBoost, pal.starBoost, f);
  amb.extraStarAlpha = lerp(other.extraStarAlpha, pal.extraStarAlpha, f);
  amb.silhouetteAlpha = lerp(other.silhouetteAlpha, pal.silhouetteAlpha, f);
  amb.horizonAlpha = lerp(other.horizonAlpha, pal.horizonAlpha, f);
  amb.planetAlpha = lerp(other.planetAlpha, pal.planetAlpha, f);
}

// --- Planète pixel art (espace) — rangées précalculées ---------------------

const PLANET_R = 12;
const PLANET_ROWS: { dy: number; hw: number }[] = [];
for (let dy = -PLANET_R; dy <= PLANET_R; dy++) {
  PLANET_ROWS.push({
    dy,
    hw: Math.max(1, Math.round(Math.sqrt(PLANET_R * PLANET_R - dy * dy))),
  });
}
const PLANET_R2 = 7;
const PLANET_ROWS2: { dy: number; hw: number }[] = [];
for (let dy = -PLANET_R2; dy <= PLANET_R2; dy++) {
  PLANET_ROWS2.push({
    dy,
    hw: Math.max(1, Math.round(Math.sqrt(PLANET_R2 * PLANET_R2 - dy * dy))),
  });
}

function drawPlanet(
  ctx: CanvasRenderingContext2D,
  w: number,
  horizonY: number,
  alpha: number
) {
  const px = Math.max(2, Math.round(w / 320));
  const pcx = w * 0.2;
  const pcy = horizonY * 0.4;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#5a3a7a";
  for (const r of PLANET_ROWS) {
    ctx.fillRect(pcx - r.hw * px, pcy + r.dy * px, r.hw * 2 * px, px);
  }
  // reflet violet clair décalé haut-gauche
  ctx.fillStyle = "#7a4a9a";
  for (const r of PLANET_ROWS2) {
    ctx.fillRect(pcx + (-2 - r.hw) * px, pcy + (r.dy - 2) * px, r.hw * 2 * px, px);
  }
  // liseré orange côté droit
  ctx.fillStyle = "#ff6b35";
  for (const r of PLANET_ROWS) {
    ctx.fillRect(pcx + (r.hw - 1) * px, pcy + r.dy * px, px, px);
  }
  ctx.globalAlpha = 1;
}

// --- Scène ------------------------------------------------------------------

export function drawScene(ctx: CanvasRenderingContext2D, s: SceneState) {
  const { w, h, cameraZ, stripePhase, t, zones } = s;
  if (w === 0 || h === 0 || zones.length === 0) return;
  const horizonY = Math.floor(h * HORIZON_RATIO);
  const cx = w / 2;

  // Ambiance selon la zone au point de focus (caméra déjà lissée)
  computeAmbiance(zones, cameraZ + VIEW_BACK);

  // --- Ciel ---
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, amb.skyTop);
  sky.addColorStop(0.5, amb.skyMid);
  sky.addColorStop(1, amb.skyBot);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // --- Étoiles scintillantes ---
  for (let i = 0; i < 40; i++) {
    const x = (((i * 137.5) % 100) / 100) * w;
    const y = (((i * 73.3) % 80) / 100) * horizonY;
    const a = Math.min(
      1,
      (0.15 + 0.5 * Math.abs(Math.sin(t / 900 + i * 1.3))) * amb.starBoost
    );
    ctx.fillStyle = `rgba(245, 240, 230, ${a.toFixed(2)})`;
    ctx.fillRect(x, y, 2, 2);
  }
  // étoiles supplémentaires (ciel / espace)
  if (amb.extraStarAlpha > 0.02) {
    for (let i = 40; i < 80; i++) {
      const x = (((i * 137.5) % 100) / 100) * w;
      const y = (((i * 73.3) % 97) / 100) * horizonY;
      const a =
        amb.extraStarAlpha *
        (0.2 + 0.6 * Math.abs(Math.sin(t / 700 + i * 0.7)));
      ctx.fillStyle = `rgba(245, 240, 230, ${a.toFixed(2)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // --- Planète (espace) ---
  if (amb.planetAlpha > 0.02) {
    drawPlanet(ctx, w, horizonY, amb.planetAlpha);
  }

  // --- Soleil couchant pulsant ---
  if (amb.sunAlpha > 0.02) {
    const pulse = 1 + 0.08 * Math.sin(t / 1500);
    const sunX = w * 0.75;
    const sunY = horizonY * 0.5;
    const sunR = Math.min(w, h) * 0.06 * pulse;
    const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 2.5);
    sun.addColorStop(0, "rgba(255,107,53,0.9)");
    sun.addColorStop(0.4, "rgba(255,107,53,0.35)");
    sun.addColorStop(1, "rgba(255,107,53,0)");
    if (amb.sunAlpha < 1) ctx.globalAlpha = amb.sunAlpha;
    ctx.fillStyle = sun;
    ctx.fillRect(sunX - sunR * 2.5, sunY - sunR * 2.5, sunR * 5, sunR * 5);
    ctx.globalAlpha = 1;
  }

  // --- Silhouettes à l'horizon (parallax lent) — bâtiments ou îles ---
  if (amb.silhouetteAlpha > 0.02) {
    const period = 140;
    const par = cameraZ * 4;
    const j0 = Math.floor(par / period) - 1;
    ctx.fillStyle = `rgba(15,13,11,${amb.silhouetteAlpha.toFixed(2)})`;
    for (let j = j0; (j - j0) * period < w + 2 * period; j++) {
      const x = j * period - par;
      const bw = 30 + ((((j * 17) % 50) + 50) % 50);
      const bh = 14 + ((((j * 29) % 36) + 36) % 36);
      ctx.fillRect(x, horizonY - bh, bw, bh);
    }
  }

  // --- Ligne d'horizon ---
  if (amb.horizonAlpha > 0.02) {
    ctx.fillStyle = `rgba(255,107,53,${(0.25 * amb.horizonAlpha).toFixed(2)})`;
    ctx.fillRect(0, horizonY, w, 2);
  }

  // --- Sol + route, rendu ligne par ligne (zones blendées) ---
  // worldZ strictement décroissant quand y croît → curseur de segment monotone
  let segIdx = zones.length - 1;
  for (let y = horizonY + 2; y <= h; y++) {
    const dz = (CAM_DEPTH * CAM_H * (h / 2)) / (y - horizonY);
    const worldZ = cameraZ + dz;
    const scale = CAM_DEPTH / dz;
    const half = scale * (ROAD_WIDTH / 2) * (w / 2);
    const p = worldZ + stripePhase;
    const band = ((Math.floor(p / BAND_LEN) % 2) + 2) % 2 === 0;

    while (segIdx > 0 && worldZ < zones[segIdx].zStart) segIdx--;
    const seg = zones[segIdx];
    const pal = PALETTES[seg.zone];

    // facteur de mix vers la palette du segment courant (quantifié, pixel art)
    let f = 1;
    let other = pal;
    if (segIdx > 0 && worldZ < seg.zStart + T_GROUND_HALF) {
      f = (worldZ - seg.zStart + T_GROUND_HALF) / T_GROUND;
      other = PALETTES[zones[segIdx - 1].zone];
    } else if (
      segIdx < zones.length - 1 &&
      worldZ > seg.zEnd - T_GROUND_HALF
    ) {
      f = (seg.zEnd + T_GROUND_HALF - worldZ) / T_GROUND;
      other = PALETTES[zones[segIdx + 1].zone];
    }
    f = Math.round(Math.min(1, Math.max(0, f)) * 3) / 3;

    let groundStyle: string;
    let roadStyle: string;
    let rumbleA: number;
    let sparkleA: number;
    let groundStarA: number;
    if (f === 1 || other === pal) {
      groundStyle = band ? pal.groundAStr : pal.groundBStr;
      roadStyle = band ? pal.roadAStr : pal.roadBStr;
      rumbleA = pal.rumbleAlpha;
      sparkleA = pal.sparkleAlpha;
      groundStarA = pal.groundStarAlpha;
    } else if (f === 0) {
      groundStyle = band ? other.groundAStr : other.groundBStr;
      roadStyle = band ? other.roadAStr : other.roadBStr;
      rumbleA = other.rumbleAlpha;
      sparkleA = other.sparkleAlpha;
      groundStarA = other.groundStarAlpha;
    } else {
      groundStyle = band
        ? lerpRGBStr(other.groundA, pal.groundA, f)
        : lerpRGBStr(other.groundB, pal.groundB, f);
      roadStyle = band
        ? lerpRGBStr(other.roadA, pal.roadA, f)
        : lerpRGBStr(other.roadB, pal.roadB, f);
      rumbleA = lerp(other.rumbleAlpha, pal.rumbleAlpha, f);
      sparkleA = lerp(other.sparkleAlpha, pal.sparkleAlpha, f);
      groundStarA = lerp(other.groundStarAlpha, pal.groundStarAlpha, f);
    }

    // sol
    ctx.fillStyle = groundStyle;
    ctx.fillRect(0, y, w, 1);
    // route / chenal
    ctx.fillStyle = roadStyle;
    ctx.fillRect(cx - half, y, half * 2, 1);
    // bandes rugueuses + ligne centrale (asphalte uniquement)
    if (rumbleA > 0.02) {
      if (rumbleA < 1) ctx.globalAlpha = rumbleA;
      const rumble = Math.max(1, half * 0.09);
      ctx.fillStyle = band ? "#f5f0e6" : "#ff6b35";
      ctx.fillRect(cx - half - rumble, y, rumble, 1);
      ctx.fillRect(cx + half, y, rumble, 1);
      if (((Math.floor(p / (BAND_LEN / 2)) % 2) + 2) % 2 === 0) {
        const lw = Math.max(1, half * 0.05);
        ctx.fillStyle = "rgba(245,240,230,0.6)";
        ctx.fillRect(cx - lw / 2, y, lw, 1);
      }
      if (rumbleA < 1) ctx.globalAlpha = 1;
    }
    // scintillement de l'eau (défile avec la route)
    if (sparkleA > 0.02) {
      const q = Math.floor(p * 4);
      let hsh = (q * 2654435761) >>> 0;
      hsh = (hsh ^ (hsh >>> 13)) >>> 0;
      if ((hsh & 7) < 2) {
        const fx = 0.04 + 0.92 * (((hsh >>> 8) & 1023) / 1023);
        const sx = fx * w;
        const a = sparkleA * (0.25 + 0.5 * (((hsh >>> 18) & 255) / 255));
        const nearSun = Math.abs(sx - w * 0.75) < w * 0.07;
        ctx.fillStyle = nearSun
          ? `rgba(255,160,90,${a.toFixed(2)})`
          : `rgba(120,200,255,${a.toFixed(2)})`;
        ctx.fillRect(sx, y, Math.min(4, Math.max(1, half * 0.03)), 1);
      }
    }
    // étoiles au sol (espace, fixes dans le monde)
    if (groundStarA > 0.02) {
      const q = Math.floor(worldZ * 4);
      let hsh = (q * 2246822519) >>> 0;
      hsh = (hsh ^ (hsh >>> 15)) >>> 0;
      if ((hsh & 7) < 2) {
        const fx = ((hsh >>> 8) & 1023) / 1023;
        const a = groundStarA * (0.25 + 0.55 * (((hsh >>> 18) & 255) / 255));
        ctx.fillStyle = `rgba(230,230,245,${a.toFixed(2)})`;
        ctx.fillRect(fx * w, y, 2, 1);
      }
    }
  }

  // --- Décor latéral : poteaux (route) ou bouées (mer) ---
  const DECOR_STEP = 4;
  const first = Math.ceil((cameraZ + stripePhase + NEAR) / DECOR_STEP);
  for (let k = first; k * DECOR_STEP - stripePhase < cameraZ + FAR; k++) {
    const worldZ = k * DECOR_STEP - stripePhase;
    const dz = worldZ - cameraZ;
    if (dz <= NEAR) continue;
    const zone = zoneAt(zones, worldZ);
    if (zone !== "route" && zone !== "mer") continue;
    const scale = CAM_DEPTH / dz;
    const side = k % 2 === 0 ? -1 : 1;
    const x = cx + scale * side * (ROAD_WIDTH / 2 + 0.5) * (w / 2);
    const yGround = horizonY + scale * CAM_H * (h / 2);
    if (zone === "route") {
      const ph = scale * 0.5 * (h / 2);
      const pw = Math.max(1, scale * 14);
      ctx.fillStyle = "#3a322a";
      ctx.fillRect(x - pw / 2, yGround - ph, pw, ph);
      ctx.fillStyle = "#ff6b35";
      ctx.fillRect(x - pw / 2, yGround - ph, pw, Math.max(1, ph * 0.15));
    } else {
      // bouée : corps + sommet orange clignotant, léger tangage
      const bob = Math.sin(t / 500 + k) * scale * 4;
      const bw = Math.max(2, scale * 16);
      const bh = scale * 0.18 * (h / 2);
      const yB = yGround + bob;
      ctx.fillStyle = "#6b2a2a";
      ctx.fillRect(x - bw / 2, yB - bh, bw, bh);
      const blink = 0.4 + 0.6 * Math.abs(Math.sin(t / 400 + k));
      ctx.fillStyle = `rgba(255,107,53,${blink.toFixed(2)})`;
      ctx.fillRect(x - bw / 4, yB - bh - bw / 2, bw / 2, bw / 2);
    }
  }

  // --- Brume près de l'horizon (assortie au ciel de la zone) ---
  const fogH = h * 0.1;
  const fog = ctx.createLinearGradient(0, horizonY, 0, horizonY + fogH);
  fog.addColorStop(0, `rgba(${amb.fogR},${amb.fogG},${amb.fogB},0.85)`);
  fog.addColorStop(1, `rgba(${amb.fogR},${amb.fogG},${amb.fogB},0)`);
  ctx.fillStyle = fog;
  ctx.fillRect(0, horizonY, w, fogH);
}
