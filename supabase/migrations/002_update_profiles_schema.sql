-- Migration: Update profiles table schema
-- File: 002_update_profiles_schema.sql
-- Description: Updates the profiles table to match TypeScript types

-- Rename 'name' column to 'full_name' to match TypeScript types
ALTER TABLE profiles RENAME COLUMN name TO full_name;

-- Add avatar_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Ensure all constraints and indexes are properly set
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
