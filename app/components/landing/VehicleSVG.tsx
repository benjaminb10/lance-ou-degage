// Véhicules en pixel art 16-bit amélioré
// Ordre: trottinette, vélo, moto, voiture, voiture luxe, jet privé, yacht, fusée

interface VehicleProps {
  className?: string;
}

// Tier 0 - Trottinette
export function Trottinette({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Guidon */}
      <rect x="9" y="5" width="2" height="2" fill="#8899aa" />
      <rect x="7" y="3" width="6" height="2" fill="#aabbcc" />
      {/* Tige */}
      <rect x="9" y="7" width="2" height="12" fill="#778899" />
      {/* Plateau avec accent */}
      <rect x="6" y="19" width="16" height="3" fill="#334455" />
      <rect x="6" y="19" width="16" height="1" fill="#ff6b35" />
      {/* Roue arrière */}
      <rect x="4" y="22" width="8" height="8" fill="#222" />
      <rect x="5" y="23" width="6" height="6" fill="#333" />
      <rect x="7" y="25" width="2" height="2" fill="#555" />
      {/* Roue avant */}
      <rect x="18" y="22" width="8" height="8" fill="#222" />
      <rect x="19" y="23" width="6" height="6" fill="#333" />
      <rect x="21" y="25" width="2" height="2" fill="#555" />
      {/* Phare */}
      <rect x="20" y="17" width="3" height="2" fill="#ff6b35" />
      <rect x="21" y="17" width="1" height="1" fill="#ffaa77" />
    </svg>
  );
}

// Tier 1 - Vélo
export function Velo({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Cadre */}
      <rect x="8" y="10" width="2" height="10" fill="#ff6b35" />
      <rect x="8" y="10" width="12" height="2" fill="#ff6b35" />
      <rect x="18" y="10" width="2" height="8" fill="#ff6b35" />
      <rect x="10" y="12" width="8" height="2" fill="#cc5522" />
      <rect x="10" y="16" width="8" height="2" fill="#cc5522" />
      {/* Guidon */}
      <rect x="4" y="8" width="8" height="2" fill="#8899aa" />
      <rect x="8" y="6" width="2" height="4" fill="#778899" />
      {/* Selle */}
      <rect x="16" y="8" width="6" height="2" fill="#222" />
      {/* Roue arrière */}
      <rect x="1" y="18" width="10" height="10" fill="#222" />
      <rect x="2" y="19" width="8" height="8" fill="#333" />
      <rect x="4" y="21" width="4" height="4" fill="#111" />
      <rect x="5" y="22" width="2" height="2" fill="#555" />
      {/* Roue avant */}
      <rect x="21" y="18" width="10" height="10" fill="#222" />
      <rect x="22" y="19" width="8" height="8" fill="#333" />
      <rect x="24" y="21" width="4" height="4" fill="#111" />
      <rect x="25" y="22" width="2" height="2" fill="#555" />
      {/* Phare */}
      <rect x="28" y="14" width="2" height="3" fill="#ff6b35" />
    </svg>
  );
}

// Tier 2 - Moto
export function Moto({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Corps */}
      <rect x="7" y="12" width="18" height="8" fill="#222" />
      <rect x="9" y="10" width="14" height="4" fill="#ff6b35" />
      <rect x="5" y="14" width="4" height="4" fill="#333" />
      {/* Réservoir highlight */}
      <rect x="11" y="11" width="4" height="1" fill="#ff8855" />
      {/* Guidon */}
      <rect x="3" y="10" width="5" height="2" fill="#8899aa" />
      <rect x="5" y="8" width="2" height="4" fill="#778899" />
      {/* Phare */}
      <rect x="3" y="12" width="2" height="3" fill="#ffdd44" />
      <rect x="3" y="13" width="1" height="1" fill="#fff" />
      {/* Selle */}
      <rect x="18" y="8" width="6" height="4" fill="#222" />
      {/* Pot échappement */}
      <rect x="23" y="16" width="6" height="2" fill="#667" />
      <rect x="28" y="16" width="2" height="2" fill="#ff6b35" opacity="0.6" />
      {/* Roue arrière */}
      <rect x="20" y="18" width="10" height="10" fill="#222" />
      <rect x="21" y="19" width="8" height="8" fill="#333" />
      <rect x="23" y="21" width="4" height="4" fill="#111" />
      <rect x="24" y="22" width="2" height="2" fill="#555" />
      {/* Roue avant */}
      <rect x="2" y="18" width="10" height="10" fill="#222" />
      <rect x="3" y="19" width="8" height="8" fill="#333" />
      <rect x="5" y="21" width="4" height="4" fill="#111" />
      <rect x="6" y="22" width="2" height="2" fill="#555" />
    </svg>
  );
}

// Tier 3 - Voiture
export function Voiture({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Carrosserie */}
      <rect x="3" y="12" width="26" height="10" fill="#3366aa" />
      <rect x="7" y="8" width="18" height="6" fill="#2255aa" />
      {/* Vitres */}
      <rect x="9" y="9" width="6" height="4" fill="#88ccff" />
      <rect x="17" y="9" width="6" height="4" fill="#88ccff" />
      {/* Reflet vitre */}
      <rect x="9" y="9" width="2" height="1" fill="#aaddff" />
      <rect x="17" y="9" width="2" height="1" fill="#aaddff" />
      {/* Ligne accent */}
      <rect x="3" y="16" width="26" height="1" fill="#ff6b35" />
      {/* Phares */}
      <rect x="1" y="14" width="2" height="4" fill="#ffdd44" />
      <rect x="29" y="14" width="2" height="4" fill="#ff4444" />
      {/* Roue avant */}
      <rect x="5" y="20" width="8" height="8" fill="#222" />
      <rect x="6" y="21" width="6" height="6" fill="#333" />
      <rect x="8" y="23" width="2" height="2" fill="#555" />
      {/* Roue arrière */}
      <rect x="19" y="20" width="8" height="8" fill="#222" />
      <rect x="20" y="21" width="6" height="6" fill="#333" />
      <rect x="22" y="23" width="2" height="2" fill="#555" />
    </svg>
  );
}

// Tier 4 - Voiture de Luxe
export function VoitureLuxe({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Carrosserie basse sportive */}
      <rect x="1" y="13" width="30" height="9" fill="#1a1a2e" />
      <rect x="5" y="9" width="22" height="6" fill="#16162a" />
      {/* Vitres teintées */}
      <rect x="7" y="10" width="7" height="4" fill="#222244" />
      <rect x="16" y="10" width="9" height="4" fill="#222244" />
      {/* Reflet */}
      <rect x="7" y="10" width="3" height="1" fill="#333366" />
      {/* Lignes chromées */}
      <rect x="1" y="15" width="30" height="1" fill="#aabbcc" />
      <rect x="1" y="18" width="30" height="1" fill="#ff6b35" />
      {/* Phares LED */}
      <rect x="0" y="14" width="1" height="4" fill="#ffdd44" />
      <rect x="31" y="14" width="1" height="4" fill="#ff3333" />
      {/* Roues sport */}
      <rect x="3" y="20" width="10" height="10" fill="#111" />
      <rect x="4" y="21" width="8" height="8" fill="#222" />
      <rect x="6" y="23" width="4" height="4" fill="#333" />
      <rect x="7" y="24" width="2" height="2" fill="#ffcc00" />
      <rect x="19" y="20" width="10" height="10" fill="#111" />
      <rect x="20" y="21" width="8" height="8" fill="#222" />
      <rect x="22" y="23" width="4" height="4" fill="#333" />
      <rect x="23" y="24" width="2" height="2" fill="#ffcc00" />
    </svg>
  );
}

// Tier 5 - Jet Privé
export function JetPrive({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Fuselage */}
      <rect x="4" y="12" width="24" height="8" fill="#dde" />
      <rect x="2" y="14" width="4" height="4" fill="#ccd" />
      {/* Nez */}
      <rect x="0" y="15" width="2" height="2" fill="#aab" />
      {/* Cockpit */}
      <rect x="4" y="14" width="4" height="4" fill="#224" />
      <rect x="5" y="15" width="2" height="2" fill="#446688" />
      {/* Hublots */}
      <rect x="10" y="14" width="2" height="2" fill="#446688" />
      <rect x="14" y="14" width="2" height="2" fill="#446688" />
      <rect x="18" y="14" width="2" height="2" fill="#446688" />
      {/* Ligne accent */}
      <rect x="4" y="16" width="24" height="1" fill="#ff6b35" />
      {/* Aile sup */}
      <rect x="12" y="8" width="10" height="4" fill="#bbc" />
      <rect x="14" y="6" width="6" height="2" fill="#aab" />
      {/* Aile inf */}
      <rect x="12" y="20" width="10" height="4" fill="#bbc" />
      <rect x="14" y="24" width="6" height="2" fill="#aab" />
      {/* Queue verticale */}
      <rect x="26" y="8" width="4" height="6" fill="#dde" />
      <rect x="28" y="6" width="4" height="4" fill="#ff6b35" />
      {/* Réacteur */}
      <rect x="28" y="14" width="4" height="4" fill="#667" />
      <rect x="30" y="15" width="2" height="2" fill="#ff8844" />
    </svg>
  );
}

// Tier 5 - JetSki
export function JetSki({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Corps */}
      <rect x="6" y="14" width="20" height="8" fill="#ff6b35" />
      <rect x="8" y="12" width="16" height="4" fill="#ff8855" />
      {/* Selle */}
      <rect x="12" y="10" width="8" height="4" fill="#222" />
      <rect x="14" y="9" width="4" height="2" fill="#333" />
      {/* Guidon */}
      <rect x="6" y="12" width="4" height="2" fill="#667" />
      <rect x="4" y="10" width="4" height="3" fill="#778" />
      {/* Highlight */}
      <rect x="10" y="13" width="6" height="1" fill="#ffaa77" />
      {/* Arrière */}
      <rect x="24" y="16" width="4" height="4" fill="#cc5522" />
      {/* Jet d'eau */}
      <rect x="26" y="20" width="4" height="2" fill="#88ccff" />
      <rect x="28" y="18" width="2" height="4" fill="#aaddff" />
      {/* Vagues */}
      <rect x="0" y="22" width="6" height="2" fill="#3388bb" />
      <rect x="4" y="24" width="8" height="2" fill="#3388bb" />
      <rect x="10" y="26" width="6" height="2" fill="#3388bb" />
      <rect x="18" y="24" width="6" height="2" fill="#3388bb" />
      <rect x="24" y="22" width="6" height="2" fill="#3388bb" />
    </svg>
  );
}

// Tier 6 - Yacht
export function Yacht({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Coque */}
      <rect x="2" y="18" width="28" height="8" fill="#223344" />
      <rect x="4" y="16" width="24" height="4" fill="#2a3a4a" />
      {/* Ligne déco */}
      <rect x="2" y="20" width="28" height="1" fill="#ff6b35" />
      {/* Cabine */}
      <rect x="6" y="10" width="16" height="8" fill="#dde" />
      <rect x="8" y="8" width="12" height="4" fill="#ccd" />
      {/* Vitres */}
      <rect x="8" y="12" width="4" height="4" fill="#446688" />
      <rect x="14" y="12" width="6" height="4" fill="#446688" />
      {/* Pont supérieur */}
      <rect x="10" y="6" width="8" height="2" fill="#aab" />
      {/* Antenne */}
      <rect x="13" y="2" width="2" height="4" fill="#667" />
      <rect x="12" y="2" width="4" height="1" fill="#ff6b35" />
      {/* Vagues */}
      <rect x="0" y="26" width="4" height="2" fill="#3388bb" />
      <rect x="8" y="28" width="4" height="2" fill="#3388bb" />
      <rect x="20" y="26" width="4" height="2" fill="#3388bb" />
      <rect x="28" y="28" width="4" height="2" fill="#3388bb" />
    </svg>
  );
}

// Tier 7 - Fusée
export function Fusee({ className = "" }: VehicleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated" }}>
      {/* Corps principal */}
      <rect x="12" y="4" width="8" height="18" fill="#dde" />
      <rect x="13" y="2" width="6" height="4" fill="#ff6b35" />
      {/* Pointe */}
      <rect x="14" y="0" width="4" height="2" fill="#cc4422" />
      <rect x="15" y="0" width="2" height="1" fill="#ff6644" />
      {/* Hublot */}
      <rect x="14" y="8" width="4" height="4" fill="#224" />
      <rect x="15" y="9" width="2" height="2" fill="#446688" />
      <rect x="15" y="9" width="1" height="1" fill="#88aacc" />
      {/* Bandes */}
      <rect x="12" y="14" width="8" height="2" fill="#ff6b35" />
      {/* Ailerons */}
      <rect x="6" y="18" width="6" height="6" fill="#bbc" />
      <rect x="8" y="16" width="4" height="4" fill="#aab" />
      <rect x="20" y="18" width="6" height="6" fill="#bbc" />
      <rect x="20" y="16" width="4" height="4" fill="#aab" />
      {/* Réacteur */}
      <rect x="14" y="22" width="4" height="4" fill="#667" />
      {/* Flammes */}
      <rect x="13" y="26" width="6" height="2" fill="#ff8844" />
      <rect x="14" y="28" width="4" height="2" fill="#ff6b35" />
      <rect x="15" y="30" width="2" height="2" fill="#ffcc44" />
      <rect x="11" y="27" width="2" height="3" fill="#ff6633" opacity="0.7" />
      <rect x="19" y="27" width="2" height="3" fill="#ff6633" opacity="0.7" />
    </svg>
  );
}

// Composant qui sélectionne le véhicule selon le tier (0-8)
export function Vehicle({
  tier,
  className = "",
}: {
  tier: number;
  className?: string;
}) {
  const vehicles = [
    Trottinette,  // 0 - route
    Velo,         // 1 - route
    Moto,         // 2 - route
    Voiture,      // 3 - route
    VoitureLuxe,  // 4 - route
    JetSki,       // 5 - mer
    Yacht,        // 6 - mer
    JetPrive,     // 7 - ciel
    Fusee,        // 8 - espace
  ];
  const VehicleComponent = vehicles[Math.min(tier, 8)] || Trottinette;
  return <VehicleComponent className={className} />;
}
