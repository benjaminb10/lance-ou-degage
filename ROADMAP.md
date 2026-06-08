# Roadmap Lance ou Dégage

> Dernière mise à jour : 8 juin 2026
> Utilisateurs actuels : 10

## Philosophie

Avec 10 utilisateurs, la priorité est :
1. **Rétention** - Garder les membres actifs et engagés
2. **FOMO** - Donner envie aux visiteurs de rejoindre
3. **Quick wins** - Features rapides à implémenter, fort impact

---

## Phase 1 : Fondations (Fait)

### Authentification & Profils
- [x] Landing page avec pricing
- [x] Paiement Stripe
- [x] Onboarding post-paiement
- [x] Profils publics des membres
- [x] Connexion magic link (Resend SMTP)
- [x] Espace membre `/mon-espace`

### Gamification de base
- [x] Système de tiers (véhicules : barque → yacht)
- [x] Leaderboard classé par MRR
- [x] Trophées/achievements (14 disponibles)
- [x] Notifications live des trophées débloqués (homepage)
- [x] Feed des derniers trophées

### Technique
- [x] Responsive mobile
- [x] Countdown 30 jours par membre
- [x] Édition profil (MRR, projets, bio, liens)

---

## Phase 2 : Engagement (En cours)

### Accountability & Shame
- [ ] **Badge "Dégagé"** - Affiché sur le profil si deadline ratée
  - Ajouter colonne `failed_at` dans members
  - Cron job quotidien pour checker les deadlines expirées
  - Afficher badge rouge sur profil + leaderboard
  - Priorité : HAUTE (core concept du produit)

- [ ] **Compteur de "survivants"** - "X membres ont survécu ce mois"
  - Stats sur la homepage
  - Priorité : MOYENNE

### Journal de bord / Updates
- [ ] **Posts d'updates** - Les membres partagent leur avancement
  - Nouvelle table `updates` (member_id, content, created_at)
  - Feed des updates sur `/feed` (remplacer ou compléter le feed trophées)
  - Limiter à 1 update/jour pour éviter le spam
  - Priorité : HAUTE (crée de l'engagement quotidien)

### Quêtes & Milestones
- [ ] **Nouveaux trophées orientés action** :
  - [ ] "Premier Euro" - Premier € de MRR
  - [ ] "Centurion" - 100€ MRR
  - [ ] "Len lansen" - 1000€ MRR (existe déjà ?)
  - [ ] "Landing Live" - URL de projet renseignée
  - [ ] "Networker" - Profil LinkedIn ajouté
  - [ ] "Social Proof" - 1er avis client (champ à ajouter)
  - Priorité : MOYENNE (enrichit la gamification existante)

---

## Phase 3 : Croissance

### FOMO & Social Proof
- [ ] **Page publique "La Route"** - Visualisation de tous les membres sur la route
  - Version animée/interactive de la progression
  - Visible sans connexion
  - Priorité : HAUTE (acquisition)

- [x] **Compteurs homepage** - Stats live
  - Nombre de membres actifs
  - MRR total de la communauté
  - Projets lancés
  - Priorité : MOYENNE
  - ✅ Fait le 8 juin 2026

- [x] **Stats leaderboard améliorées**
  - Ajout compteur trophées
  - Grid 2x2 mobile, 4 colonnes desktop
  - ✅ Fait le 8 juin 2026

- [ ] **Témoignages** - Section avec quotes des membres
  - Priorité : BASSE (besoin de plus de membres d'abord)

### Viralité
- [ ] **Partage de profil** - Bouton "Partager mon profil" avec OG image custom
  - Générer une image dynamique avec stats du membre
  - Priorité : MOYENNE

- [ ] **Referral** - "Parraine un ami"
  - Code promo unique par membre
  - Badge "Recruteur" si 1+ filleul
  - Réduction pour le filleul ?
  - Priorité : BASSE (attendre plus de traction)

---

## Phase 4 : Communauté (Futur)

### Interactions
- [ ] **Votes hebdo** - Élire le "Projet de la semaine"
  - Les membres votent
  - Gagnant affiché sur homepage
  - Priorité : BASSE

- [ ] **Peer review** - Donner du feedback sur les projets des autres
  - Priorité : BASSE

- [ ] **Challenges** - Défis hebdomadaires
  - "Ship une feature", "Cold email 10 prospects"
  - Priorité : BASSE

### Intégrations
- [ ] **Sync Stripe MRR** - Connexion OAuth Stripe pour MRR automatique
  - Complexe à implémenter
  - Priorité : BASSE

- [ ] **Notifications Discord** - Bot qui poste les nouveaux trophées
  - Priorité : MOYENNE

---

## Backlog (Idées à explorer)

- [ ] Mode "spectateur" - Preview de la communauté sans payer
- [ ] Streak counter - Jours consécutifs d'activité
- [ ] Leaderboard par période (semaine, mois, all-time)
- [ ] Comparaison de progression entre membres
- [ ] Export des stats en image pour Twitter
- [ ] Podcast/interviews des membres qui réussissent
- [ ] Événements live (coworking sessions)
- [ ] Prix par tranches croissantes (comme Ship or Die)

---

## Prochaines actions immédiates

1. **Badge "Dégagé"** - C'est le coeur du concept, sans ça pas de pression réelle
2. **Posts d'updates** - Créer de l'engagement quotidien
3. **Compteurs homepage** - Social proof pour les visiteurs

---

## Notes techniques

### Stack actuelle
- Frontend : React + TanStack Router + Vite
- Styling : Tailwind CSS
- Backend : Supabase (auth + database)
- Payments : Stripe Payment Links
- Hosting : Vercel
- Emails : Resend

### Tables Supabase
- `members` - Profils des membres
- `projects` - Projets des membres
- `achievements` - Liste des trophées
- `member_achievements` - Trophées débloqués

### Tables à créer
- `updates` - Journal de bord des membres
- `votes` - Votes pour projet de la semaine (futur)
