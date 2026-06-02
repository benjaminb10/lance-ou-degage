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
