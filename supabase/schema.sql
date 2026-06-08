-- Lance ou Dégage - Database Schema
-- Run this in Supabase SQL Editor

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  linkedin_url TEXT,
  twitter_url TEXT,
  avatar_url TEXT,
  bio TEXT,
  tier INTEGER DEFAULT 0 CHECK (tier >= 0 AND tier <= 8),
  mrr INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  discord_invited BOOLEAN DEFAULT FALSE,
  is_founder BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  mrr INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read for leaderboard (only completed onboarding)
CREATE POLICY "Public members are viewable by everyone"
  ON members FOR SELECT
  USING (onboarding_completed = true);

-- Allow anyone to insert (for onboarding)
CREATE POLICY "Anyone can create a member"
  ON members FOR INSERT
  WITH CHECK (true);

-- Projects are viewable if member is public
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM members WHERE onboarding_completed = true
    )
  );

-- Allow insert for projects
CREATE POLICY "Anyone can create a project"
  ON projects FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_members_tier ON members(tier DESC);
CREATE INDEX idx_members_mrr ON members(mrr DESC);
CREATE INDEX idx_members_onboarding ON members(onboarding_completed);
CREATE INDEX idx_projects_member ON projects(member_id);

-- =====================================================
-- MIGRATION: Add existing founders
-- =====================================================

INSERT INTO members (name, avatar_url, tier, mrr, onboarding_completed, is_founder, email)
VALUES
  ('Benjamin Benoudis', '/founders/benjamin-benoudis.png', 2, 3500, true, true, 'benjamin@lance-ou-degage.fr'),
  ('Alexandre Sarfati', '/founders/alexandre-sarfati.png', 2, 3500, true, true, 'alexandre@lance-ou-degage.fr'),
  ('Axel Briche', '/founders/axel-briche.png', 0, 0, true, true, 'axel@lance-ou-degage.fr');

-- Add projects for Benjamin
INSERT INTO projects (member_id, name, url)
SELECT id, 'BeReach.ai', 'https://bereach.ai'
FROM members WHERE name = 'Benjamin Benoudis';

INSERT INTO projects (member_id, name, url)
SELECT id, 'Viewlify.app', 'https://www.viewlify.app'
FROM members WHERE name = 'Benjamin Benoudis';

INSERT INTO projects (member_id, name, url)
SELECT id, 'lance-ou-degage.fr', 'https://www.lance-ou-degage.fr'
FROM members WHERE name = 'Benjamin Benoudis';

-- Add project for Alexandre
INSERT INTO projects (member_id, name, url)
SELECT id, 'LaPause.app', 'https://www.lapause.app'
FROM members WHERE name = 'Alexandre Sarfati';

-- =====================================================
-- MIGRATION: Add auth_id and achievements system
-- =====================================================

-- Add auth_id to link members to Supabase Auth
ALTER TABLE members ADD COLUMN auth_id UUID REFERENCES auth.users(id);
CREATE UNIQUE INDEX idx_members_auth_id ON members(auth_id);

-- Add countdown_started_at if not exists (for 30-day challenge)
ALTER TABLE members ADD COLUMN IF NOT EXISTS countdown_started_at TIMESTAMP WITH TIME ZONE;

-- Achievements table (available trophies)
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  position INTEGER DEFAULT 0
);

-- Member achievements (unlocked trophies)
CREATE TABLE member_achievements (
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (member_id, achievement_id)
);

-- Enable RLS on new tables
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are public (everyone can see the list)
CREATE POLICY "Achievements are public"
  ON achievements FOR SELECT
  USING (true);

-- Member achievements visible if member is public
CREATE POLICY "Member achievements visible if member public"
  ON member_achievements FOR SELECT
  USING (
    member_id IN (SELECT id FROM members WHERE onboarding_completed = true)
  );

-- Members can manage their own achievements (INSERT/DELETE)
CREATE POLICY "Members can insert own achievements"
  ON member_achievements FOR INSERT
  WITH CHECK (
    member_id IN (SELECT id FROM members WHERE auth_id = auth.uid())
  );

CREATE POLICY "Members can delete own achievements"
  ON member_achievements FOR DELETE
  USING (
    member_id IN (SELECT id FROM members WHERE auth_id = auth.uid())
  );

-- Members can update their own profile
CREATE POLICY "Members can update own profile"
  ON members FOR UPDATE
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- Index for feed queries
CREATE INDEX idx_member_achievements_unlocked ON member_achievements(unlocked_at DESC);

-- =====================================================
-- SEED: Insert achievements (trophies)
-- =====================================================

INSERT INTO achievements (id, name, description, icon, position) VALUES
  ('domain', 'Nom de domaine', 'Tu as acheté un nom de domaine', 'domain', 1),
  ('landing', 'Landing page', 'Ta landing page est en ligne', 'landing', 2),
  ('mvp', 'MVP prêt', 'Ton MVP est fonctionnel', 'mvp', 3),
  ('payment', 'Paiement câblé', 'Stripe/paiement en place', 'payment', 4),
  ('first_post', 'Premier post', 'Tu as posté sur les réseaux', 'first_post', 5),
  ('first_user', 'Premier utilisateur', 'Quelqu''un utilise ton produit', 'first_user', 6),
  ('first_euro', 'Premier euro', 'Tu as gagné ton premier euro', 'first_euro', 7),
  ('ten_customers', '10 clients', 'Tu as 10 clients payants', 'ten_customers', 8),
  ('hundred_mrr', '100€ MRR', 'Tu génères 100€/mois', 'hundred_mrr', 9),
  ('first_review', 'Premier témoignage', 'Un client t''a laissé un avis', 'first_review', 10),
  ('fifty_customers', '50 clients', 'Tu as 50 clients payants', 'fifty_customers', 11),
  ('five_hundred_mrr', '500€ MRR', 'Tu génères 500€/mois', 'five_hundred_mrr', 12),
  ('newsletter', 'Newsletter', 'Tu as lancé ta newsletter', 'newsletter', 13),
  ('first_refund', 'Premier refund', 'Tu as géré ton premier remboursement', 'first_refund', 14),
  ('hundred_customers', '100 clients', 'Tu as 100 clients payants', 'hundred_customers', 15),
  ('thousand_mrr', '1000€ MRR', 'Tu génères 1000€/mois', 'thousand_mrr', 16),
  ('product_hunt', 'Product Hunt', 'Tu as lancé sur Product Hunt', 'product_hunt', 17),
  ('first_affiliate', 'Premier affilié', 'Quelqu''un te recommande', 'first_affiliate', 18),
  ('five_k_mrr', '5000€ MRR', 'Tu génères 5000€/mois', 'five_k_mrr', 19),
  ('ten_k_mrr', '10000€ MRR', 'Tu génères 10000€/mois', 'ten_k_mrr', 20);

-- =====================================================
-- MIGRATION: Add new achievements (run this to update existing DB)
-- =====================================================

INSERT INTO achievements (id, name, description, icon, position) VALUES
  ('first_review', 'Premier témoignage', 'Un client t''a laissé un avis', 'first_review', 10),
  ('fifty_customers', '50 clients', 'Tu as 50 clients payants', 'fifty_customers', 11),
  ('five_hundred_mrr', '500€ MRR', 'Tu génères 500€/mois', 'five_hundred_mrr', 12),
  ('newsletter', 'Newsletter', 'Tu as lancé ta newsletter', 'newsletter', 13),
  ('first_refund', 'Premier refund', 'Tu as géré ton premier remboursement', 'first_refund', 14),
  ('hundred_customers', '100 clients', 'Tu as 100 clients payants', 'hundred_customers', 15),
  ('thousand_mrr', '1000€ MRR', 'Tu génères 1000€/mois', 'thousand_mrr', 16),
  ('product_hunt', 'Product Hunt', 'Tu as lancé sur Product Hunt', 'product_hunt', 17),
  ('first_affiliate', 'Premier affilié', 'Quelqu''un te recommande', 'first_affiliate', 18),
  ('five_k_mrr', '5000€ MRR', 'Tu génères 5000€/mois', 'five_k_mrr', 19),
  ('ten_k_mrr', '10000€ MRR', 'Tu génères 10000€/mois', 'ten_k_mrr', 20)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MIGRATION: Add marketing/distribution achievements
-- =====================================================

INSERT INTO achievements (id, name, description, icon, position) VALUES
  ('tiktok', 'Premier TikTok', 'Tu as posté ta première vidéo TikTok', 'tiktok', 25),
  ('twitter', 'Premier post X', 'Tu as posté sur X (Twitter)', 'twitter', 26),
  ('reddit', 'Premier post Reddit', 'Tu as posté sur Reddit', 'reddit', 27),
  ('youtube', 'Première vidéo YouTube', 'Tu as publié une vidéo YouTube', 'youtube', 28),
  ('linkedin', 'Premier post LinkedIn', 'Tu as posté sur LinkedIn', 'linkedin', 29)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MIGRATION: Add viral achievements
-- =====================================================

INSERT INTO achievements (id, name, description, icon, position) VALUES
  ('first_hater', 'Premier hater', 'Quelqu''un t''a critiqué publiquement', 'first_hater', 30),
  ('nuit_blanche', 'Nuit blanche', 'Tu as codé jusqu''au lever du soleil', 'nuit_blanche', 31),
  ('bug_prod', 'Bug en prod', 'Tu as cassé la prod', 'bug_prod', 32),
  ('pivot', 'Pivot', 'Tu as changé d''idée de projet', 'pivot', 33),
  ('cold_emails', '100 cold emails', 'Tu as envoyé 100 emails', 'cold_emails', 34),
  ('dm_warrior', 'DM warrior', '50+ DMs de prospection envoyés', 'dm_warrior', 35),
  ('zero_like', 'Zéro like', 'Ton post a fait un flop monumental', 'zero_like', 37),
  ('copied', 'Copié', 'Un concurrent t''a copié', 'copied', 38),
  ('viral', 'Viral par accident', 'Un truc random a explosé', 'viral', 39),
  ('press', 'Mention presse', 'Un média a parlé de toi', 'press', 40)
ON CONFLICT (id) DO NOTHING;
