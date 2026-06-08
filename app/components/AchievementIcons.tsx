// Icônes trophées en pixel art 16-bit
// Style identique aux véhicules (VehicleSVG.tsx)

interface IconProps {
  className?: string;
  unlocked?: boolean;
}

// Trophée 1 - Nom de domaine (Globe terrestre)
export function DomainIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Globe */}
      <rect x="10" y="4" width="12" height="2" fill="#3388bb" />
      <rect x="8" y="6" width="16" height="2" fill="#3388bb" />
      <rect x="6" y="8" width="20" height="2" fill="#44aacc" />
      <rect x="5" y="10" width="22" height="2" fill="#44aacc" />
      <rect x="4" y="12" width="24" height="2" fill="#55bbdd" />
      <rect x="4" y="14" width="24" height="2" fill="#55bbdd" />
      <rect x="4" y="16" width="24" height="2" fill="#44aacc" />
      <rect x="5" y="18" width="22" height="2" fill="#44aacc" />
      <rect x="6" y="20" width="20" height="2" fill="#3388bb" />
      <rect x="8" y="22" width="16" height="2" fill="#3388bb" />
      <rect x="10" y="24" width="12" height="2" fill="#3388bb" />
      {/* Continents */}
      <rect x="8" y="8" width="4" height="4" fill="#4CAF50" />
      <rect x="12" y="10" width="3" height="6" fill="#4CAF50" />
      <rect x="18" y="8" width="6" height="3" fill="#4CAF50" />
      <rect x="20" y="12" width="4" height="4" fill="#4CAF50" />
      <rect x="8" y="18" width="5" height="3" fill="#4CAF50" />
      {/* Méridien */}
      <rect x="15" y="4" width="2" height="22" fill="#2277aa" />
      {/* Équateur */}
      <rect x="4" y="15" width="24" height="1" fill="#2277aa" />
    </svg>
  );
}

// Trophée 2 - Landing page (Page web)
export function LandingIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Fenêtre navigateur */}
      <rect x="4" y="4" width="24" height="24" fill="#2a2a3e" />
      {/* Barre titre */}
      <rect x="4" y="4" width="24" height="4" fill="#444466" />
      {/* Boutons fenêtre */}
      <rect x="6" y="5" width="2" height="2" fill="#ff5f56" />
      <rect x="10" y="5" width="2" height="2" fill="#ffbd2e" />
      <rect x="14" y="5" width="2" height="2" fill="#27ca40" />
      {/* Contenu - Header */}
      <rect x="6" y="10" width="12" height="2" fill="#ff6b35" />
      {/* Contenu - Texte */}
      <rect x="6" y="14" width="20" height="1" fill="#667" />
      <rect x="6" y="16" width="18" height="1" fill="#667" />
      <rect x="6" y="18" width="16" height="1" fill="#667" />
      {/* Bouton CTA */}
      <rect x="6" y="22" width="10" height="4" fill="#ff6b35" />
      <rect x="8" y="23" width="6" height="2" fill="#ffaa77" />
    </svg>
  );
}

// Trophée 3 - MVP prêt (Clé à molette)
export function MvpIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Manche */}
      <rect x="6" y="20" width="4" height="10" fill="#8B4513" />
      <rect x="7" y="21" width="2" height="8" fill="#A0522D" />
      {/* Tête de la clé */}
      <rect x="4" y="10" width="8" height="12" fill="#778899" />
      <rect x="5" y="11" width="6" height="10" fill="#8899aa" />
      {/* Mâchoire fixe */}
      <rect x="2" y="6" width="4" height="6" fill="#667788" />
      <rect x="3" y="7" width="2" height="4" fill="#778899" />
      {/* Mâchoire mobile */}
      <rect x="10" y="6" width="4" height="6" fill="#667788" />
      <rect x="11" y="7" width="2" height="4" fill="#778899" />
      {/* Écrou */}
      <rect x="4" y="4" width="8" height="4" fill="#ff6b35" />
      <rect x="5" y="5" width="6" height="2" fill="#ffaa77" />
      {/* Vis de réglage */}
      <rect x="7" y="14" width="2" height="2" fill="#556677" />
    </svg>
  );
}

// Trophée 4 - Paiement câblé (Carte bancaire)
export function PaymentIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Carte */}
      <rect x="2" y="8" width="28" height="18" fill="#1a1a2e" />
      {/* Bande magnétique */}
      <rect x="2" y="12" width="28" height="4" fill="#333355" />
      {/* Puce */}
      <rect x="5" y="17" width="6" height="4" fill="#ffcc00" />
      <rect x="6" y="18" width="4" height="2" fill="#ffdd44" />
      <rect x="7" y="18" width="1" height="2" fill="#cc9900" />
      <rect x="9" y="18" width="1" height="2" fill="#cc9900" />
      {/* Numéros (points) */}
      <rect x="5" y="22" width="2" height="1" fill="#667" />
      <rect x="9" y="22" width="2" height="1" fill="#667" />
      <rect x="13" y="22" width="2" height="1" fill="#667" />
      <rect x="17" y="22" width="2" height="1" fill="#667" />
      {/* Logo */}
      <rect x="22" y="17" width="6" height="4" fill="#ff6b35" />
      <rect x="23" y="18" width="4" height="2" fill="#ffaa77" />
    </svg>
  );
}

// Trophée 5 - Premier post (Mégaphone)
export function FirstPostIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Corps du mégaphone */}
      <rect x="8" y="12" width="4" height="8" fill="#ff6b35" />
      <rect x="12" y="10" width="4" height="12" fill="#ff6b35" />
      <rect x="16" y="8" width="4" height="16" fill="#ff8855" />
      <rect x="20" y="6" width="4" height="20" fill="#ffaa77" />
      {/* Pavillon */}
      <rect x="24" y="4" width="6" height="24" fill="#ffcc99" />
      <rect x="26" y="6" width="4" height="20" fill="#ffeedd" />
      {/* Poignée */}
      <rect x="4" y="14" width="4" height="4" fill="#667788" />
      <rect x="5" y="15" width="2" height="2" fill="#778899" />
      {/* Ondes sonores */}
      <rect x="30" y="10" width="2" height="2" fill="#ff6b35" opacity="0.6" />
      <rect x="30" y="14" width="2" height="2" fill="#ff6b35" opacity="0.6" />
      <rect x="30" y="18" width="2" height="2" fill="#ff6b35" opacity="0.6" />
    </svg>
  );
}

// Trophée 6 - Premier utilisateur (Silhouette)
export function FirstUserIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Tête */}
      <rect x="12" y="4" width="8" height="8" fill="#ffcc99" />
      <rect x="13" y="5" width="6" height="6" fill="#ffeedd" />
      {/* Cheveux */}
      <rect x="11" y="3" width="10" height="3" fill="#4a3728" />
      <rect x="12" y="2" width="8" height="2" fill="#5a4738" />
      {/* Yeux */}
      <rect x="13" y="7" width="2" height="2" fill="#333" />
      <rect x="17" y="7" width="2" height="2" fill="#333" />
      {/* Corps */}
      <rect x="10" y="14" width="12" height="10" fill="#ff6b35" />
      <rect x="11" y="15" width="10" height="8" fill="#ff8855" />
      {/* Bras */}
      <rect x="6" y="14" width="4" height="8" fill="#ff6b35" />
      <rect x="22" y="14" width="4" height="8" fill="#ff6b35" />
      {/* Jambes */}
      <rect x="11" y="24" width="4" height="6" fill="#334455" />
      <rect x="17" y="24" width="4" height="6" fill="#334455" />
    </svg>
  );
}

// Trophée 7 - Premier euro (Pièce €)
export function FirstEuroIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Pièce - cercle externe */}
      <rect x="8" y="4" width="16" height="2" fill="#cc9900" />
      <rect x="6" y="6" width="20" height="2" fill="#cc9900" />
      <rect x="4" y="8" width="24" height="2" fill="#ffcc00" />
      <rect x="4" y="10" width="24" height="2" fill="#ffdd44" />
      <rect x="4" y="12" width="24" height="2" fill="#ffdd44" />
      <rect x="4" y="14" width="24" height="2" fill="#ffcc00" />
      <rect x="4" y="16" width="24" height="2" fill="#ffcc00" />
      <rect x="4" y="18" width="24" height="2" fill="#ffdd44" />
      <rect x="4" y="20" width="24" height="2" fill="#cc9900" />
      <rect x="6" y="22" width="20" height="2" fill="#cc9900" />
      <rect x="8" y="24" width="16" height="2" fill="#aa7700" />
      {/* Symbole € */}
      <rect x="12" y="10" width="8" height="2" fill="#886600" />
      <rect x="10" y="12" width="4" height="2" fill="#886600" />
      <rect x="10" y="14" width="8" height="2" fill="#886600" />
      <rect x="10" y="16" width="4" height="2" fill="#886600" />
      <rect x="12" y="18" width="8" height="2" fill="#886600" />
      {/* Reflet */}
      <rect x="6" y="8" width="4" height="2" fill="#ffeedd" />
    </svg>
  );
}

// Trophée 8 - 10 clients (Groupe)
export function TenCustomersIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Personne centrale */}
      <rect x="13" y="8" width="6" height="6" fill="#ffcc99" />
      <rect x="12" y="16" width="8" height="8" fill="#ff6b35" />
      {/* Personne gauche */}
      <rect x="4" y="10" width="5" height="5" fill="#ffeedd" />
      <rect x="3" y="17" width="7" height="7" fill="#3388bb" />
      {/* Personne droite */}
      <rect x="23" y="10" width="5" height="5" fill="#ffeedd" />
      <rect x="22" y="17" width="7" height="7" fill="#44aa55" />
      {/* Personnes arrière gauche */}
      <rect x="7" y="4" width="4" height="4" fill="#ddd" />
      <rect x="6" y="9" width="6" height="5" fill="#667788" />
      {/* Personnes arrière droite */}
      <rect x="21" y="4" width="4" height="4" fill="#ddd" />
      <rect x="20" y="9" width="6" height="5" fill="#886677" />
      {/* Badge "10" */}
      <rect x="22" y="24" width="8" height="6" fill="#ff6b35" />
      <rect x="23" y="25" width="2" height="4" fill="#fff" />
      <rect x="26" y="25" width="3" height="4" fill="#fff" />
      <rect x="27" y="26" width="1" height="2" fill="#ff6b35" />
    </svg>
  );
}

// Trophée 9 - 100€ MRR (Graphique montant)
export function HundredMrrIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Axes */}
      <rect x="4" y="4" width="2" height="24" fill="#667788" />
      <rect x="4" y="26" width="24" height="2" fill="#667788" />
      {/* Barres du graphique (croissantes) */}
      <rect x="8" y="20" width="4" height="6" fill="#3388bb" />
      <rect x="14" y="16" width="4" height="10" fill="#44aacc" />
      <rect x="20" y="10" width="4" height="16" fill="#55bbdd" />
      {/* Flèche montante */}
      <rect x="24" y="6" width="2" height="8" fill="#ff6b35" />
      <rect x="22" y="8" width="2" height="2" fill="#ff6b35" />
      <rect x="26" y="8" width="2" height="2" fill="#ff6b35" />
      <rect x="24" y="4" width="2" height="2" fill="#ff6b35" />
      {/* Points de données */}
      <rect x="9" y="18" width="2" height="2" fill="#ffcc00" />
      <rect x="15" y="14" width="2" height="2" fill="#ffcc00" />
      <rect x="21" y="8" width="2" height="2" fill="#ffcc00" />
      {/* Ligne de tendance */}
      <rect x="10" y="19" width="2" height="1" fill="#ff6b35" opacity="0.5" />
      <rect x="12" y="17" width="2" height="1" fill="#ff6b35" opacity="0.5" />
      <rect x="14" y="15" width="2" height="1" fill="#ff6b35" opacity="0.5" />
      <rect x="16" y="13" width="2" height="1" fill="#ff6b35" opacity="0.5" />
      <rect x="18" y="11" width="2" height="1" fill="#ff6b35" opacity="0.5" />
      <rect x="20" y="9" width="2" height="1" fill="#ff6b35" opacity="0.5" />
    </svg>
  );
}

// Trophée 10 - Premier témoignage (Étoile avec bulle)
export function FirstReviewIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Bulle */}
      <rect x="4" y="4" width="20" height="16" fill="#2a2a3e" />
      <rect x="6" y="6" width="16" height="12" fill="#3a3a4e" />
      <rect x="8" y="20" width="4" height="4" fill="#2a2a3e" />
      {/* Étoile */}
      <rect x="12" y="8" width="4" height="2" fill="#ffcc00" />
      <rect x="10" y="10" width="8" height="2" fill="#ffcc00" />
      <rect x="8" y="12" width="12" height="2" fill="#ffdd44" />
      <rect x="10" y="14" width="3" height="2" fill="#ffcc00" />
      <rect x="15" y="14" width="3" height="2" fill="#ffcc00" />
      {/* Pouce levé */}
      <rect x="22" y="18" width="6" height="8" fill="#ffcc99" />
      <rect x="24" y="14" width="4" height="4" fill="#ffcc99" />
      <rect x="22" y="26" width="8" height="4" fill="#ff6b35" />
    </svg>
  );
}

// Trophée 11 - 50 clients (Groupe plus grand)
export function FiftyCustomersIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Rangée arrière */}
      <rect x="2" y="4" width="4" height="4" fill="#aaa" />
      <rect x="8" y="4" width="4" height="4" fill="#bbb" />
      <rect x="14" y="4" width="4" height="4" fill="#aaa" />
      <rect x="20" y="4" width="4" height="4" fill="#bbb" />
      <rect x="26" y="4" width="4" height="4" fill="#aaa" />
      {/* Rangée milieu */}
      <rect x="4" y="10" width="5" height="5" fill="#ffeedd" />
      <rect x="3" y="16" width="7" height="6" fill="#3388bb" />
      <rect x="13" y="10" width="6" height="6" fill="#ffcc99" />
      <rect x="12" y="17" width="8" height="7" fill="#ff6b35" />
      <rect x="23" y="10" width="5" height="5" fill="#ffeedd" />
      <rect x="22" y="16" width="7" height="6" fill="#44aa55" />
      {/* Badge "50" */}
      <rect x="22" y="24" width="8" height="6" fill="#ff6b35" />
      <rect x="23" y="25" width="3" height="4" fill="#fff" />
      <rect x="24" y="26" width="1" height="2" fill="#ff6b35" />
      <rect x="26" y="25" width="3" height="4" fill="#fff" />
      <rect x="27" y="26" width="1" height="2" fill="#ff6b35" />
    </svg>
  );
}

// Trophée 12 - 500€ MRR (Graphique avec 500)
export function FiveHundredMrrIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Axes */}
      <rect x="4" y="4" width="2" height="24" fill="#667788" />
      <rect x="4" y="26" width="24" height="2" fill="#667788" />
      {/* Barres croissantes */}
      <rect x="8" y="18" width="4" height="8" fill="#44aa55" />
      <rect x="14" y="14" width="4" height="12" fill="#55bb66" />
      <rect x="20" y="8" width="4" height="18" fill="#66cc77" />
      {/* Badge 500 */}
      <rect x="20" y="2" width="10" height="6" fill="#ff6b35" />
      <rect x="21" y="3" width="2" height="4" fill="#fff" />
      <rect x="24" y="3" width="2" height="4" fill="#fff" />
      <rect x="27" y="3" width="2" height="4" fill="#fff" />
    </svg>
  );
}

// Trophée 13 - Newsletter (Enveloppe)
export function NewsletterIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Enveloppe */}
      <rect x="2" y="8" width="28" height="18" fill="#e0d4c8" />
      <rect x="4" y="10" width="24" height="14" fill="#f5efe8" />
      {/* Rabat */}
      <rect x="4" y="8" width="2" height="2" fill="#d4c4b4" />
      <rect x="6" y="10" width="2" height="2" fill="#d4c4b4" />
      <rect x="8" y="12" width="2" height="2" fill="#d4c4b4" />
      <rect x="10" y="14" width="2" height="2" fill="#d4c4b4" />
      <rect x="12" y="16" width="2" height="2" fill="#d4c4b4" />
      <rect x="14" y="18" width="4" height="2" fill="#d4c4b4" />
      <rect x="18" y="16" width="2" height="2" fill="#d4c4b4" />
      <rect x="20" y="14" width="2" height="2" fill="#d4c4b4" />
      <rect x="22" y="12" width="2" height="2" fill="#d4c4b4" />
      <rect x="24" y="10" width="2" height="2" fill="#d4c4b4" />
      <rect x="26" y="8" width="2" height="2" fill="#d4c4b4" />
      {/* @ symbole */}
      <rect x="13" y="12" width="6" height="2" fill="#ff6b35" />
      <rect x="12" y="14" width="2" height="4" fill="#ff6b35" />
      <rect x="18" y="14" width="2" height="4" fill="#ff6b35" />
      <rect x="14" y="14" width="4" height="2" fill="#ff6b35" />
    </svg>
  );
}

// Trophée 14 - Premier refund (Flèche retour)
export function FirstRefundIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Pièce */}
      <rect x="12" y="8" width="12" height="2" fill="#cc9900" />
      <rect x="10" y="10" width="16" height="2" fill="#ffcc00" />
      <rect x="8" y="12" width="20" height="8" fill="#ffdd44" />
      <rect x="10" y="20" width="16" height="2" fill="#ffcc00" />
      <rect x="12" y="22" width="12" height="2" fill="#cc9900" />
      {/* Symbole € */}
      <rect x="15" y="13" width="6" height="1" fill="#886600" />
      <rect x="14" y="14" width="2" height="4" fill="#886600" />
      <rect x="15" y="16" width="4" height="1" fill="#886600" />
      <rect x="15" y="18" width="6" height="1" fill="#886600" />
      {/* Flèche retour */}
      <rect x="2" y="14" width="8" height="4" fill="#ff6b35" />
      <rect x="4" y="10" width="2" height="4" fill="#ff6b35" />
      <rect x="2" y="12" width="2" height="2" fill="#ff6b35" />
      <rect x="4" y="18" width="2" height="4" fill="#ff6b35" />
      <rect x="2" y="18" width="2" height="2" fill="#ff6b35" />
    </svg>
  );
}

// Trophée 15 - 100 clients (Foule)
export function HundredCustomersIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Rangée 1 (arrière) */}
      <rect x="2" y="2" width="3" height="3" fill="#999" />
      <rect x="6" y="2" width="3" height="3" fill="#aaa" />
      <rect x="10" y="2" width="3" height="3" fill="#999" />
      <rect x="14" y="2" width="3" height="3" fill="#aaa" />
      <rect x="18" y="2" width="3" height="3" fill="#999" />
      <rect x="22" y="2" width="3" height="3" fill="#aaa" />
      <rect x="26" y="2" width="3" height="3" fill="#999" />
      {/* Rangée 2 */}
      <rect x="4" y="7" width="4" height="4" fill="#ddd" />
      <rect x="10" y="7" width="4" height="4" fill="#ccc" />
      <rect x="16" y="7" width="4" height="4" fill="#ddd" />
      <rect x="22" y="7" width="4" height="4" fill="#ccc" />
      {/* Rangée 3 (avant) */}
      <rect x="2" y="13" width="5" height="5" fill="#ffeedd" />
      <rect x="1" y="19" width="7" height="5" fill="#3388bb" />
      <rect x="12" y="13" width="6" height="6" fill="#ffcc99" />
      <rect x="11" y="20" width="8" height="5" fill="#ff6b35" />
      <rect x="23" y="13" width="5" height="5" fill="#ffeedd" />
      <rect x="22" y="19" width="7" height="5" fill="#44aa55" />
      {/* Badge "100" */}
      <rect x="20" y="25" width="11" height="5" fill="#ff6b35" />
      <rect x="21" y="26" width="2" height="3" fill="#fff" />
      <rect x="24" y="26" width="3" height="3" fill="#fff" />
      <rect x="25" y="27" width="1" height="1" fill="#ff6b35" />
      <rect x="28" y="26" width="2" height="3" fill="#fff" />
      <rect x="28" y="27" width="1" height="1" fill="#ff6b35" />
    </svg>
  );
}

// Trophée 16 - 1000€ MRR (Graphique avec 1K)
export function ThousandMrrIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Axes */}
      <rect x="4" y="4" width="2" height="24" fill="#667788" />
      <rect x="4" y="26" width="24" height="2" fill="#667788" />
      {/* Barres très hautes */}
      <rect x="8" y="16" width="4" height="10" fill="#3388bb" />
      <rect x="14" y="10" width="4" height="16" fill="#44aacc" />
      <rect x="20" y="4" width="4" height="22" fill="#55bbdd" />
      {/* Badge 1K */}
      <rect x="22" y="2" width="8" height="5" fill="#ff6b35" />
      <rect x="23" y="3" width="2" height="3" fill="#fff" />
      <rect x="26" y="3" width="1" height="3" fill="#fff" />
      <rect x="27" y="4" width="2" height="1" fill="#fff" />
      <rect x="28" y="3" width="1" height="1" fill="#fff" />
      <rect x="28" y="5" width="1" height="1" fill="#fff" />
    </svg>
  );
}

// Trophée 17 - Product Hunt (Chat PH)
export function ProductHuntIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Cercle orange PH */}
      <rect x="8" y="4" width="16" height="2" fill="#da552f" />
      <rect x="6" y="6" width="20" height="2" fill="#da552f" />
      <rect x="4" y="8" width="24" height="16" fill="#da552f" />
      <rect x="6" y="24" width="20" height="2" fill="#da552f" />
      <rect x="8" y="26" width="16" height="2" fill="#da552f" />
      {/* Lettre P */}
      <rect x="10" y="10" width="4" height="12" fill="#fff" />
      <rect x="14" y="10" width="6" height="2" fill="#fff" />
      <rect x="18" y="12" width="4" height="4" fill="#fff" />
      <rect x="14" y="16" width="6" height="2" fill="#fff" />
      {/* Oreilles chat */}
      <rect x="6" y="2" width="4" height="4" fill="#da552f" />
      <rect x="22" y="2" width="4" height="4" fill="#da552f" />
      {/* Yeux chat (sous le P) */}
      <rect x="8" y="18" width="2" height="2" fill="#fff" />
      <rect x="22" y="18" width="2" height="2" fill="#fff" />
    </svg>
  );
}

// Trophée 18 - Premier affilié (Deux personnes connectées)
export function FirstAffiliateIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Personne gauche */}
      <rect x="4" y="6" width="6" height="6" fill="#ffcc99" />
      <rect x="3" y="14" width="8" height="10" fill="#ff6b35" />
      {/* Personne droite */}
      <rect x="22" y="6" width="6" height="6" fill="#ffcc99" />
      <rect x="21" y="14" width="8" height="10" fill="#3388bb" />
      {/* Lien entre eux */}
      <rect x="11" y="14" width="10" height="2" fill="#44aa55" />
      <rect x="11" y="16" width="2" height="2" fill="#44aa55" />
      <rect x="19" y="16" width="2" height="2" fill="#44aa55" />
      {/* Flèches */}
      <rect x="13" y="12" width="2" height="2" fill="#44aa55" />
      <rect x="17" y="12" width="2" height="2" fill="#44aa55" />
      {/* Étoiles/étincelles */}
      <rect x="14" y="8" width="4" height="2" fill="#ffcc00" />
      <rect x="15" y="6" width="2" height="2" fill="#ffcc00" />
      <rect x="15" y="10" width="2" height="2" fill="#ffcc00" />
      {/* Badge € */}
      <rect x="13" y="22" width="6" height="6" fill="#ffcc00" />
      <rect x="14" y="24" width="4" height="2" fill="#886600" />
    </svg>
  );
}

// Trophée 19 - 5000€ MRR (Graphique 5K)
export function FiveKMrrIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Axes */}
      <rect x="4" y="4" width="2" height="24" fill="#667788" />
      <rect x="4" y="26" width="24" height="2" fill="#667788" />
      {/* Ligne de tendance explosive */}
      <rect x="8" y="22" width="2" height="4" fill="#ffcc00" />
      <rect x="11" y="18" width="2" height="8" fill="#ffcc00" />
      <rect x="14" y="14" width="2" height="12" fill="#ffdd44" />
      <rect x="17" y="10" width="2" height="16" fill="#ffdd44" />
      <rect x="20" y="6" width="2" height="20" fill="#ffee66" />
      <rect x="23" y="4" width="2" height="22" fill="#ffee66" />
      {/* Étoiles */}
      <rect x="24" y="2" width="2" height="2" fill="#ff6b35" />
      <rect x="26" y="4" width="2" height="2" fill="#ff6b35" />
      <rect x="28" y="2" width="2" height="2" fill="#ff6b35" />
      {/* Badge 5K */}
      <rect x="2" y="2" width="8" height="5" fill="#ff6b35" />
      <rect x="3" y="3" width="3" height="3" fill="#fff" />
      <rect x="4" y="4" width="1" height="1" fill="#ff6b35" />
      <rect x="7" y="3" width="2" height="3" fill="#fff" />
    </svg>
  );
}

// Trophée 20 - 10000€ MRR (Trophée doré)
export function TenKMrrIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Coupe */}
      <rect x="8" y="4" width="16" height="2" fill="#ffcc00" />
      <rect x="6" y="6" width="20" height="4" fill="#ffdd44" />
      <rect x="8" y="10" width="16" height="4" fill="#ffcc00" />
      <rect x="10" y="14" width="12" height="2" fill="#cc9900" />
      {/* Anses */}
      <rect x="4" y="6" width="2" height="6" fill="#cc9900" />
      <rect x="2" y="8" width="2" height="4" fill="#cc9900" />
      <rect x="26" y="6" width="2" height="6" fill="#cc9900" />
      <rect x="28" y="8" width="2" height="4" fill="#cc9900" />
      {/* Pied */}
      <rect x="14" y="16" width="4" height="4" fill="#aa8800" />
      <rect x="10" y="20" width="12" height="2" fill="#cc9900" />
      <rect x="8" y="22" width="16" height="2" fill="#aa8800" />
      {/* Étoile sur la coupe */}
      <rect x="14" y="8" width="4" height="2" fill="#fff" />
      <rect x="15" y="7" width="2" height="1" fill="#fff" />
      <rect x="15" y="10" width="2" height="1" fill="#fff" />
      {/* Badge 10K */}
      <rect x="10" y="26" width="12" height="4" fill="#ff6b35" />
      <rect x="11" y="27" width="2" height="2" fill="#fff" />
      <rect x="14" y="27" width="3" height="2" fill="#fff" />
      <rect x="15" y="28" width="1" height="1" fill="#ff6b35" />
      <rect x="18" y="27" width="3" height="2" fill="#fff" />
    </svg>
  );
}

// Streak Icons (Flames)
export function Streak3Icon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Petite flamme - 3 jours */}
      <rect x="14" y="22" width="4" height="4" fill="#ff6b35" />
      <rect x="13" y="18" width="6" height="4" fill="#ff6b35" />
      <rect x="12" y="14" width="8" height="4" fill="#ff8c00" />
      <rect x="13" y="10" width="6" height="4" fill="#ffa500" />
      <rect x="14" y="6" width="4" height="4" fill="#ffd700" />
      <rect x="15" y="4" width="2" height="2" fill="#fff4cc" />
      {/* Inner glow */}
      <rect x="15" y="16" width="2" height="4" fill="#ffd700" />
      {/* Base */}
      <rect x="10" y="26" width="12" height="2" fill="#8b4513" />
    </svg>
  );
}

export function Streak7Icon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Flamme moyenne - 7 jours */}
      <rect x="14" y="24" width="4" height="2" fill="#ff6b35" />
      <rect x="12" y="20" width="8" height="4" fill="#ff6b35" />
      <rect x="10" y="14" width="12" height="6" fill="#ff8c00" />
      <rect x="11" y="8" width="10" height="6" fill="#ffa500" />
      <rect x="12" y="4" width="8" height="4" fill="#ffd700" />
      <rect x="14" y="2" width="4" height="2" fill="#fff4cc" />
      {/* Inner glow */}
      <rect x="14" y="12" width="4" height="8" fill="#ffd700" />
      <rect x="15" y="10" width="2" height="2" fill="#fff4cc" />
      {/* Sparks */}
      <rect x="8" y="10" width="2" height="2" fill="#ffa500" />
      <rect x="22" y="12" width="2" height="2" fill="#ffa500" />
      {/* Base */}
      <rect x="8" y="26" width="16" height="2" fill="#8b4513" />
    </svg>
  );
}

export function Streak14Icon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Grande flamme - 14 jours */}
      <rect x="14" y="26" width="4" height="2" fill="#ff6b35" />
      <rect x="11" y="22" width="10" height="4" fill="#ff6b35" />
      <rect x="9" y="16" width="14" height="6" fill="#ff8c00" />
      <rect x="8" y="10" width="16" height="6" fill="#ffa500" />
      <rect x="10" y="4" width="12" height="6" fill="#ffd700" />
      <rect x="12" y="2" width="8" height="2" fill="#fff4cc" />
      {/* Inner glow */}
      <rect x="13" y="12" width="6" height="10" fill="#ffd700" />
      <rect x="14" y="8" width="4" height="4" fill="#fff4cc" />
      {/* Multiple sparks */}
      <rect x="6" y="8" width="2" height="2" fill="#ffa500" />
      <rect x="24" y="10" width="2" height="2" fill="#ffa500" />
      <rect x="5" y="14" width="2" height="2" fill="#ff8c00" />
      <rect x="25" y="16" width="2" height="2" fill="#ff8c00" />
      {/* Base */}
      <rect x="6" y="28" width="20" height="2" fill="#8b4513" />
    </svg>
  );
}

export function Streak30Icon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Flamme épique dorée - 30 jours */}
      <rect x="14" y="28" width="4" height="2" fill="#ff6b35" />
      <rect x="11" y="24" width="10" height="4" fill="#ff6b35" />
      <rect x="8" y="18" width="16" height="6" fill="#ff8c00" />
      <rect x="6" y="12" width="20" height="6" fill="#ffa500" />
      <rect x="8" y="6" width="16" height="6" fill="#ffd700" />
      <rect x="10" y="2" width="12" height="4" fill="#fff4cc" />
      <rect x="12" y="0" width="8" height="2" fill="#ffffff" />
      {/* Inner core - white hot */}
      <rect x="12" y="14" width="8" height="10" fill="#ffd700" />
      <rect x="13" y="10" width="6" height="4" fill="#fff4cc" />
      <rect x="14" y="6" width="4" height="4" fill="#ffffff" />
      {/* Many sparks */}
      <rect x="4" y="6" width="2" height="2" fill="#ffd700" />
      <rect x="26" y="8" width="2" height="2" fill="#ffd700" />
      <rect x="2" y="12" width="2" height="2" fill="#ffa500" />
      <rect x="28" y="14" width="2" height="2" fill="#ffa500" />
      <rect x="4" y="18" width="2" height="2" fill="#ff8c00" />
      <rect x="26" y="20" width="2" height="2" fill="#ff8c00" />
      {/* Crown on top */}
      <rect x="11" y="0" width="2" height="2" fill="#ffd700" />
      <rect x="19" y="0" width="2" height="2" fill="#ffd700" />
      {/* Base */}
      <rect x="4" y="30" width="24" height="2" fill="#8b4513" />
    </svg>
  );
}

// Trophée Marketing - TikTok
export function TikTokIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Note de musique stylisée TikTok */}
      <rect x="10" y="4" width="4" height="20" fill="#ffffff" />
      <rect x="14" y="4" width="8" height="4" fill="#25f4ee" />
      <rect x="18" y="8" width="4" height="6" fill="#25f4ee" />
      <rect x="14" y="4" width="4" height="2" fill="#fe2c55" style={{ transform: "translate(-2px, -2px)" }} />
      <rect x="8" y="2" width="4" height="4" fill="#fe2c55" />
      {/* Cercle bas */}
      <rect x="4" y="20" width="10" height="8" fill="#ffffff" />
      <rect x="6" y="22" width="6" height="4" fill="#1a1a2e" />
      {/* Reflet cyan */}
      <rect x="12" y="6" width="2" height="16" fill="#25f4ee" />
    </svg>
  );
}

// Trophée Marketing - X (Twitter)
export function TwitterIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* X logo */}
      <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
      <rect x="22" y="6" width="4" height="4" fill="#ffffff" />
      <rect x="8" y="10" width="4" height="4" fill="#ffffff" />
      <rect x="20" y="10" width="4" height="4" fill="#ffffff" />
      <rect x="10" y="14" width="4" height="4" fill="#ffffff" />
      <rect x="18" y="14" width="4" height="4" fill="#ffffff" />
      <rect x="14" y="14" width="4" height="4" fill="#ffffff" />
      <rect x="10" y="18" width="4" height="4" fill="#ffffff" />
      <rect x="18" y="18" width="4" height="4" fill="#ffffff" />
      <rect x="8" y="22" width="4" height="4" fill="#ffffff" />
      <rect x="20" y="22" width="4" height="4" fill="#ffffff" />
      <rect x="6" y="26" width="4" height="2" fill="#ffffff" />
      <rect x="22" y="26" width="4" height="2" fill="#ffffff" />
    </svg>
  );
}

// Trophée Marketing - Reddit
export function RedditIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Tête orange */}
      <rect x="8" y="8" width="16" height="16" fill="#ff4500" />
      <rect x="6" y="10" width="2" height="12" fill="#ff4500" />
      <rect x="24" y="10" width="2" height="12" fill="#ff4500" />
      <rect x="10" y="6" width="12" height="2" fill="#ff4500" />
      <rect x="10" y="24" width="12" height="2" fill="#ff4500" />
      {/* Yeux blancs */}
      <rect x="10" y="12" width="4" height="4" fill="#ffffff" />
      <rect x="18" y="12" width="4" height="4" fill="#ffffff" />
      {/* Pupilles */}
      <rect x="12" y="14" width="2" height="2" fill="#1a1a2e" />
      <rect x="20" y="14" width="2" height="2" fill="#1a1a2e" />
      {/* Sourire */}
      <rect x="12" y="20" width="8" height="2" fill="#1a1a2e" />
      {/* Antenne */}
      <rect x="22" y="4" width="4" height="4" fill="#ff4500" />
      <rect x="20" y="6" width="2" height="4" fill="#ff4500" />
      {/* Oreilles */}
      <rect x="4" y="10" width="4" height="4" fill="#ff4500" />
      <rect x="24" y="10" width="4" height="4" fill="#ff4500" />
    </svg>
  );
}

// Trophée Marketing - YouTube
export function YouTubeIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Rectangle rouge */}
      <rect x="2" y="6" width="28" height="20" fill="#ff0000" />
      <rect x="4" y="8" width="24" height="16" fill="#cc0000" />
      {/* Bouton play blanc */}
      <rect x="12" y="10" width="2" height="12" fill="#ffffff" />
      <rect x="14" y="11" width="2" height="10" fill="#ffffff" />
      <rect x="16" y="12" width="2" height="8" fill="#ffffff" />
      <rect x="18" y="13" width="2" height="6" fill="#ffffff" />
      <rect x="20" y="14" width="2" height="4" fill="#ffffff" />
      {/* Coins arrondis */}
      <rect x="2" y="6" width="2" height="2" fill="#1a1a2e" />
      <rect x="28" y="6" width="2" height="2" fill="#1a1a2e" />
      <rect x="2" y="24" width="2" height="2" fill="#1a1a2e" />
      <rect x="28" y="24" width="2" height="2" fill="#1a1a2e" />
    </svg>
  );
}

// Trophée Marketing - LinkedIn
export function LinkedInIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Fond bleu */}
      <rect x="4" y="4" width="24" height="24" fill="#0077b5" />
      {/* Lettre "in" */}
      {/* i */}
      <rect x="8" y="12" width="4" height="12" fill="#ffffff" />
      <rect x="8" y="8" width="4" height="3" fill="#ffffff" />
      {/* n */}
      <rect x="14" y="12" width="4" height="12" fill="#ffffff" />
      <rect x="18" y="14" width="2" height="10" fill="#ffffff" />
      <rect x="20" y="12" width="4" height="12" fill="#ffffff" />
      <rect x="16" y="12" width="6" height="3" fill="#ffffff" />
    </svg>
  );
}

// Trophée Viral - Premier Hater (visage en colère)
export function FirstHaterIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Fond rouge */}
      <rect x="8" y="4" width="16" height="2" fill="#e74c3c" />
      <rect x="6" y="6" width="20" height="2" fill="#e74c3c" />
      <rect x="4" y="8" width="24" height="16" fill="#e74c3c" />
      <rect x="6" y="24" width="20" height="2" fill="#e74c3c" />
      <rect x="8" y="26" width="16" height="2" fill="#e74c3c" />
      {/* Sourcils en colère */}
      <rect x="6" y="10" width="6" height="2" fill="#2c2c2c" style={{ transform: "rotate(-15deg)", transformOrigin: "9px 11px" }} />
      <rect x="20" y="10" width="6" height="2" fill="#2c2c2c" style={{ transform: "rotate(15deg)", transformOrigin: "23px 11px" }} />
      {/* Yeux */}
      <rect x="8" y="14" width="4" height="4" fill="#2c2c2c" />
      <rect x="20" y="14" width="4" height="4" fill="#2c2c2c" />
      {/* Bouche en colère */}
      <rect x="10" y="22" width="12" height="2" fill="#2c2c2c" />
      <rect x="8" y="20" width="2" height="2" fill="#2c2c2c" />
      <rect x="22" y="20" width="2" height="2" fill="#2c2c2c" />
    </svg>
  );
}

// Trophée Viral - Nuit Blanche (lune et café)
export function NuitBlancheIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Fond nuit */}
      <rect x="0" y="0" width="32" height="32" fill="#1a1a2e" />
      {/* Lune */}
      <rect x="4" y="4" width="12" height="2" fill="#f1c40f" />
      <rect x="2" y="6" width="14" height="2" fill="#f1c40f" />
      <rect x="2" y="8" width="12" height="6" fill="#f1c40f" />
      <rect x="4" y="14" width="10" height="2" fill="#f1c40f" />
      {/* Étoiles */}
      <rect x="22" y="4" width="2" height="2" fill="#ffffff" />
      <rect x="26" y="10" width="2" height="2" fill="#ffffff" />
      <rect x="20" y="8" width="2" height="2" fill="#ffffff" />
      {/* Tasse de café */}
      <rect x="10" y="20" width="12" height="2" fill="#8B4513" />
      <rect x="8" y="22" width="16" height="6" fill="#8B4513" />
      <rect x="10" y="28" width="12" height="2" fill="#8B4513" />
      {/* Anse */}
      <rect x="24" y="22" width="2" height="4" fill="#8B4513" />
      <rect x="26" y="24" width="2" height="2" fill="#8B4513" />
      {/* Vapeur */}
      <rect x="12" y="16" width="2" height="2" fill="#cccccc" />
      <rect x="16" y="18" width="2" height="2" fill="#cccccc" />
    </svg>
  );
}

// Trophée Viral - Bug en Prod (insecte)
export function BugProdIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Corps du bug */}
      <rect x="12" y="8" width="8" height="4" fill="#e74c3c" />
      <rect x="10" y="12" width="12" height="8" fill="#e74c3c" />
      <rect x="12" y="20" width="8" height="4" fill="#e74c3c" />
      {/* Tête */}
      <rect x="13" y="4" width="6" height="4" fill="#2c2c2c" />
      {/* Antennes */}
      <rect x="11" y="2" width="2" height="4" fill="#2c2c2c" />
      <rect x="19" y="2" width="2" height="4" fill="#2c2c2c" />
      {/* Pattes */}
      <rect x="6" y="12" width="4" height="2" fill="#2c2c2c" />
      <rect x="22" y="12" width="4" height="2" fill="#2c2c2c" />
      <rect x="6" y="16" width="4" height="2" fill="#2c2c2c" />
      <rect x="22" y="16" width="4" height="2" fill="#2c2c2c" />
      <rect x="8" y="20" width="2" height="2" fill="#2c2c2c" />
      <rect x="22" y="20" width="2" height="2" fill="#2c2c2c" />
      {/* Point d'exclamation */}
      <rect x="15" y="12" width="2" height="4" fill="#ffffff" />
      <rect x="15" y="18" width="2" height="2" fill="#ffffff" />
    </svg>
  );
}

// Trophée Viral - Pivot (flèches circulaires)
export function PivotIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Flèche haut-droite */}
      <rect x="18" y="4" width="8" height="2" fill="#3498db" />
      <rect x="24" y="6" width="2" height="8" fill="#3498db" />
      <rect x="22" y="4" width="2" height="2" fill="#3498db" />
      <rect x="26" y="6" width="2" height="2" fill="#3498db" />
      {/* Arc haut */}
      <rect x="14" y="6" width="4" height="2" fill="#3498db" />
      <rect x="18" y="8" width="4" height="2" fill="#3498db" />
      <rect x="20" y="10" width="2" height="2" fill="#3498db" />
      {/* Flèche bas-gauche */}
      <rect x="6" y="26" width="8" height="2" fill="#e74c3c" />
      <rect x="6" y="18" width="2" height="8" fill="#e74c3c" />
      <rect x="8" y="26" width="2" height="2" fill="#e74c3c" />
      <rect x="4" y="24" width="2" height="2" fill="#e74c3c" />
      {/* Arc bas */}
      <rect x="14" y="24" width="4" height="2" fill="#e74c3c" />
      <rect x="10" y="22" width="4" height="2" fill="#e74c3c" />
      <rect x="10" y="20" width="2" height="2" fill="#e74c3c" />
    </svg>
  );
}

// Trophée Viral - 100 Cold Emails (pile d'enveloppes)
export function ColdEmailsIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Enveloppe 1 (arrière) */}
      <rect x="4" y="6" width="20" height="12" fill="#bdc3c7" />
      <rect x="4" y="6" width="2" height="2" fill="#95a5a6" />
      <rect x="22" y="6" width="2" height="2" fill="#95a5a6" />
      {/* Enveloppe 2 (milieu) */}
      <rect x="6" y="10" width="20" height="12" fill="#ecf0f1" />
      <rect x="6" y="10" width="2" height="2" fill="#bdc3c7" />
      <rect x="24" y="10" width="2" height="2" fill="#bdc3c7" />
      {/* Enveloppe 3 (avant) */}
      <rect x="8" y="14" width="20" height="12" fill="#ffffff" />
      {/* Rabat */}
      <rect x="8" y="14" width="10" height="2" fill="#3498db" />
      <rect x="10" y="16" width="8" height="2" fill="#3498db" />
      <rect x="12" y="18" width="6" height="2" fill="#3498db" />
      <rect x="18" y="14" width="10" height="2" fill="#3498db" />
      <rect x="20" y="16" width="6" height="2" fill="#3498db" />
      <rect x="22" y="18" width="4" height="2" fill="#3498db" />
      {/* "100" */}
      <rect x="12" y="22" width="2" height="4" fill="#e74c3c" />
      <rect x="16" y="22" width="4" height="4" fill="#e74c3c" />
      <rect x="17" y="23" width="2" height="2" fill="#ffffff" />
      <rect x="22" y="22" width="4" height="4" fill="#e74c3c" />
      <rect x="23" y="23" width="2" height="2" fill="#ffffff" />
    </svg>
  );
}

// Trophée Viral - DM Warrior (bulle de chat avec épée)
export function DmWarriorIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Bulle de chat */}
      <rect x="4" y="4" width="20" height="16" fill="#9b59b6" />
      <rect x="6" y="20" width="4" height="4" fill="#9b59b6" />
      {/* Points de texte */}
      <rect x="8" y="10" width="4" height="2" fill="#ffffff" />
      <rect x="14" y="10" width="6" height="2" fill="#ffffff" />
      <rect x="8" y="14" width="8" height="2" fill="#ffffff" />
      {/* Épée */}
      <rect x="22" y="2" width="2" height="12" fill="#bdc3c7" />
      <rect x="20" y="14" width="6" height="2" fill="#f1c40f" />
      <rect x="22" y="16" width="2" height="6" fill="#8B4513" />
      <rect x="20" y="22" width="6" height="2" fill="#8B4513" />
      {/* Éclat */}
      <rect x="26" y="4" width="2" height="2" fill="#f1c40f" />
      <rect x="28" y="6" width="2" height="2" fill="#f1c40f" />
    </svg>
  );
}

// Trophée Viral - Rejeté par PH (chat Product Hunt avec X)
export function RejectedPhIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Fond orange PH */}
      <rect x="6" y="6" width="20" height="20" fill="#da552f" />
      {/* Chat simplifié */}
      <rect x="10" y="10" width="4" height="2" fill="#ffffff" />
      <rect x="18" y="10" width="4" height="2" fill="#ffffff" />
      <rect x="8" y="12" width="6" height="4" fill="#ffffff" />
      <rect x="18" y="12" width="6" height="4" fill="#ffffff" />
      {/* Nez */}
      <rect x="14" y="14" width="4" height="2" fill="#ffcccc" />
      {/* X rouge */}
      <rect x="10" y="18" width="2" height="2" fill="#c0392b" />
      <rect x="12" y="20" width="2" height="2" fill="#c0392b" />
      <rect x="14" y="22" width="4" height="2" fill="#c0392b" />
      <rect x="18" y="20" width="2" height="2" fill="#c0392b" />
      <rect x="20" y="18" width="2" height="2" fill="#c0392b" />
      <rect x="14" y="18" width="4" height="2" fill="#c0392b" />
    </svg>
  );
}

// Trophée Viral - Zéro Like (coeur brisé avec 0)
export function ZeroLikeIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Coeur gauche */}
      <rect x="4" y="8" width="6" height="2" fill="#95a5a6" />
      <rect x="2" y="10" width="10" height="6" fill="#95a5a6" />
      <rect x="4" y="16" width="6" height="2" fill="#95a5a6" />
      <rect x="6" y="18" width="4" height="2" fill="#95a5a6" />
      <rect x="8" y="20" width="2" height="2" fill="#95a5a6" />
      {/* Coeur droit */}
      <rect x="18" y="8" width="6" height="2" fill="#95a5a6" />
      <rect x="16" y="10" width="10" height="6" fill="#95a5a6" />
      <rect x="18" y="16" width="6" height="2" fill="#95a5a6" />
      <rect x="18" y="18" width="4" height="2" fill="#95a5a6" />
      <rect x="18" y="20" width="2" height="2" fill="#95a5a6" />
      {/* Fissure */}
      <rect x="14" y="10" width="2" height="4" fill="#2c2c2c" />
      <rect x="12" y="14" width="2" height="4" fill="#2c2c2c" />
      <rect x="14" y="18" width="2" height="4" fill="#2c2c2c" />
      {/* 0 */}
      <rect x="12" y="24" width="8" height="6" fill="#e74c3c" />
      <rect x="14" y="26" width="4" height="2" fill="#1a1a2e" />
    </svg>
  );
}

// Trophée Viral - Copié (deux documents)
export function CopiedIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Document arrière */}
      <rect x="8" y="4" width="16" height="20" fill="#3498db" />
      <rect x="10" y="8" width="10" height="2" fill="#ffffff" />
      <rect x="10" y="12" width="12" height="2" fill="#ffffff" />
      <rect x="10" y="16" width="8" height="2" fill="#ffffff" />
      {/* Document avant (copie) */}
      <rect x="12" y="8" width="16" height="20" fill="#2ecc71" />
      <rect x="14" y="12" width="10" height="2" fill="#ffffff" />
      <rect x="14" y="16" width="12" height="2" fill="#ffffff" />
      <rect x="14" y="20" width="8" height="2" fill="#ffffff" />
      {/* Badge check */}
      <rect x="22" y="4" width="6" height="6" fill="#27ae60" />
      <rect x="24" y="6" width="2" height="2" fill="#ffffff" />
    </svg>
  );
}

// Trophée Viral - Viral par accident (explosion/fusée)
export function ViralIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Explosion rayons */}
      <rect x="14" y="2" width="4" height="4" fill="#f1c40f" />
      <rect x="4" y="14" width="4" height="4" fill="#f1c40f" />
      <rect x="24" y="14" width="4" height="4" fill="#f1c40f" />
      <rect x="6" y="6" width="4" height="4" fill="#f39c12" />
      <rect x="22" y="6" width="4" height="4" fill="#f39c12" />
      <rect x="6" y="22" width="4" height="4" fill="#f39c12" />
      <rect x="22" y="22" width="4" height="4" fill="#f39c12" />
      {/* Centre */}
      <rect x="10" y="10" width="12" height="12" fill="#e74c3c" />
      <rect x="12" y="12" width="8" height="8" fill="#c0392b" />
      {/* Graph qui monte */}
      <rect x="13" y="18" width="2" height="2" fill="#2ecc71" />
      <rect x="15" y="16" width="2" height="4" fill="#2ecc71" />
      <rect x="17" y="12" width="2" height="8" fill="#2ecc71" />
    </svg>
  );
}

// Trophée Viral - Mention Presse (journal)
export function PressIcon({ className = "", unlocked = true }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ imageRendering: "pixelated", opacity: unlocked ? 1 : 0.3 }}>
      {/* Journal */}
      <rect x="4" y="4" width="24" height="24" fill="#ecf0f1" />
      {/* Header */}
      <rect x="6" y="6" width="20" height="4" fill="#2c2c2c" />
      <rect x="8" y="7" width="16" height="2" fill="#ecf0f1" />
      {/* Lignes de texte */}
      <rect x="6" y="12" width="8" height="2" fill="#bdc3c7" />
      <rect x="6" y="16" width="10" height="1" fill="#bdc3c7" />
      <rect x="6" y="18" width="8" height="1" fill="#bdc3c7" />
      <rect x="6" y="20" width="10" height="1" fill="#bdc3c7" />
      <rect x="6" y="22" width="6" height="1" fill="#bdc3c7" />
      {/* Image placeholder */}
      <rect x="18" y="12" width="8" height="8" fill="#3498db" />
      <rect x="20" y="14" width="4" height="4" fill="#2980b9" />
      {/* Étoile (featured) */}
      <rect x="22" y="22" width="4" height="4" fill="#f1c40f" />
    </svg>
  );
}

// Mapping des icônes par ID d'achievement
export const achievementIcons: Record<string, React.ComponentType<IconProps>> = {
  domain: DomainIcon,
  landing: LandingIcon,
  mvp: MvpIcon,
  payment: PaymentIcon,
  first_post: FirstPostIcon,
  first_user: FirstUserIcon,
  first_euro: FirstEuroIcon,
  ten_customers: TenCustomersIcon,
  hundred_mrr: HundredMrrIcon,
  first_review: FirstReviewIcon,
  fifty_customers: FiftyCustomersIcon,
  five_hundred_mrr: FiveHundredMrrIcon,
  newsletter: NewsletterIcon,
  first_refund: FirstRefundIcon,
  hundred_customers: HundredCustomersIcon,
  thousand_mrr: ThousandMrrIcon,
  product_hunt: ProductHuntIcon,
  first_affiliate: FirstAffiliateIcon,
  five_k_mrr: FiveKMrrIcon,
  ten_k_mrr: TenKMrrIcon,
  // Streak trophies
  streak_3: Streak3Icon,
  streak_7: Streak7Icon,
  streak_14: Streak14Icon,
  streak_30: Streak30Icon,
  // Marketing trophies
  tiktok: TikTokIcon,
  twitter: TwitterIcon,
  reddit: RedditIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  // Viral trophies
  first_hater: FirstHaterIcon,
  nuit_blanche: NuitBlancheIcon,
  bug_prod: BugProdIcon,
  pivot: PivotIcon,
  cold_emails: ColdEmailsIcon,
  dm_warrior: DmWarriorIcon,
  rejected_ph: RejectedPhIcon,
  zero_like: ZeroLikeIcon,
  copied: CopiedIcon,
  viral: ViralIcon,
  press: PressIcon,
};

// Composant générique pour afficher une icône d'achievement
export function AchievementIcon({
  achievementId,
  className = "",
  unlocked = true,
}: {
  achievementId: string;
  className?: string;
  unlocked?: boolean;
}) {
  const IconComponent = achievementIcons[achievementId];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent className={className} unlocked={unlocked} />;
}
