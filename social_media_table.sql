-- Create social_media_accounts table
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255) NOT NULL,
  url VARCHAR(1024) NOT NULL,
  display_name VARCHAR(255),
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate platforms per user
  UNIQUE(user_id, platform)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own social media accounts
CREATE POLICY "Users can view their own social media accounts"
  ON social_media_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own social media accounts
CREATE POLICY "Users can insert their own social media accounts"
  ON social_media_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own social media accounts
CREATE POLICY "Users can update their own social media accounts"
  ON social_media_accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to delete their own social media accounts
CREATE POLICY "Users can delete their own social media accounts"
  ON social_media_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_social_media_user_id ON social_media_accounts(user_id);