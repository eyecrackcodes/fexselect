-- Migration script to update database for Clerk authentication
-- Run this in your Supabase SQL Editor

-- Add clerk_id column to agents table
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Create index for clerk_id for better performance
CREATE INDEX IF NOT EXISTS idx_agents_clerk_id ON agents(clerk_id);

-- Update Row Level Security policies to work with clerk_id
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view own agent profile" ON agents;
DROP POLICY IF EXISTS "Users can insert own agent profile" ON agents;
DROP POLICY IF EXISTS "Users can update own agent profile" ON agents;

DROP POLICY IF EXISTS "Agents can view own leads" ON leads;
DROP POLICY IF EXISTS "Agents can insert own leads" ON leads;
DROP POLICY IF EXISTS "Agents can update own leads" ON leads;
DROP POLICY IF EXISTS "Agents can delete own leads" ON leads;

DROP POLICY IF EXISTS "Agents can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Agents can insert own quotes" ON quotes;
DROP POLICY IF EXISTS "Agents can update own quotes" ON quotes;
DROP POLICY IF EXISTS "Agents can delete own quotes" ON quotes;

-- Since we're using Clerk for auth, we'll need to make the tables accessible
-- In production, you'd want to implement proper RLS with a service that can verify Clerk tokens
-- For now, we'll allow authenticated access from the app

-- Temporarily disable RLS (only for development)
-- In production, implement proper RLS with Clerk JWT verification
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- Note: In production, you should:
-- 1. Keep RLS enabled
-- 2. Use Supabase Edge Functions to verify Clerk JWTs
-- 3. Create policies that check the verified user ID from the JWT
