-- Add placement columns to tournaments table for storing results
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS place_1st TEXT;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS place_2nd TEXT;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS place_3rd TEXT;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS place_4th TEXT;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS place_5th_6th TEXT[] DEFAULT '{}';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS place_7th_8th TEXT[] DEFAULT '{}';

-- Create pickems_users table (stores Twitch user info)
CREATE TABLE IF NOT EXISTS pickems_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twitch_id TEXT UNIQUE NOT NULL,
  twitch_username TEXT NOT NULL,
  twitch_display_name TEXT,
  twitch_avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pickems table (stores user predictions)
CREATE TABLE IF NOT EXISTS pickems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES pickems_users(id) ON DELETE CASCADE,
  tournament_week INTEGER NOT NULL,
  pick_1st TEXT NOT NULL,
  pick_2nd TEXT NOT NULL,
  pick_3rd TEXT NOT NULL,
  pick_4th TEXT NOT NULL,
  pick_5th_6th TEXT[] NOT NULL DEFAULT '{}',
  pick_7th_8th TEXT[] NOT NULL DEFAULT '{}',
  points_earned INTEGER DEFAULT 0,
  scored BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tournament_week)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pickems_user_id ON pickems(user_id);
CREATE INDEX IF NOT EXISTS idx_pickems_tournament_week ON pickems(tournament_week);
CREATE INDEX IF NOT EXISTS idx_pickems_users_twitch_id ON pickems_users(twitch_id);
CREATE INDEX IF NOT EXISTS idx_pickems_users_total_points ON pickems_users(total_points DESC);

-- Enable Row Level Security
ALTER TABLE pickems_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickems ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pickems_users
-- Anyone can read user profiles (for leaderboard)
CREATE POLICY "Anyone can view pickems users" ON pickems_users
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON pickems_users
  FOR UPDATE USING (auth.uid()::text = twitch_id);

-- RLS Policies for pickems
-- Anyone can view picks (after tournament is complete)
CREATE POLICY "Anyone can view picks" ON pickems
  FOR SELECT USING (true);

-- Users can insert their own picks
CREATE POLICY "Users can insert own picks" ON pickems
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM pickems_users WHERE twitch_id = auth.uid()::text)
  );

-- Users can update their own picks
CREATE POLICY "Users can update own picks" ON pickems
  FOR UPDATE USING (
    user_id IN (SELECT id FROM pickems_users WHERE twitch_id = auth.uid()::text)
  );

-- Function to update total_points after scoring
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pickems_users
  SET total_points = (
    SELECT COALESCE(SUM(points_earned), 0)
    FROM pickems
    WHERE user_id = NEW.user_id AND scored = TRUE
  ),
  updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update total points when picks are scored
DROP TRIGGER IF EXISTS trigger_update_total_points ON pickems;
CREATE TRIGGER trigger_update_total_points
  AFTER UPDATE OF points_earned, scored ON pickems
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_points();
