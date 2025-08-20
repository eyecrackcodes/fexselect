import { supabase } from '../lib/supabase'

export const createTables = async () => {
  try {
    // Create agents table
    const { error: agentsError } = await supabase.rpc('create_agents_table', {})
    if (agentsError && !agentsError.message.includes('already exists')) {
      console.error('Error creating agents table:', agentsError)
    }

    // Create leads table
    const { error: leadsError } = await supabase.rpc('create_leads_table', {})
    if (leadsError && !leadsError.message.includes('already exists')) {
      console.error('Error creating leads table:', leadsError)
    }

    // Create quotes table
    const { error: quotesError } = await supabase.rpc('create_quotes_table', {})
    if (quotesError && !quotesError.message.includes('already exists')) {
      console.error('Error creating quotes table:', quotesError)
    }

    console.log('Database tables setup completed')
  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

// SQL for creating tables (to be run in Supabase SQL editor)
export const SQL_SETUP = `
-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  npn_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  tobacco_use BOOLEAN DEFAULT FALSE,
  health_conditions TEXT[],
  coverage_amount NUMERIC,
  coverage_type TEXT,
  premium_budget NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  carrier TEXT NOT NULL,
  product_name TEXT NOT NULL,
  coverage_amount NUMERIC NOT NULL,
  monthly_premium NUMERIC NOT NULL,
  annual_premium NUMERIC NOT NULL,
  quote_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for agents table
CREATE POLICY "Users can view own agent profile" ON agents
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own agent profile" ON agents
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own agent profile" ON agents
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for leads table
CREATE POLICY "Agents can view own leads" ON leads
  FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own leads" ON leads
  FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own leads" ON leads
  FOR DELETE USING (auth.uid() = agent_id);

-- Create policies for quotes table
CREATE POLICY "Agents can view own quotes" ON quotes
  FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert own quotes" ON quotes
  FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own quotes" ON quotes
  FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own quotes" ON quotes
  FOR DELETE USING (auth.uid() = agent_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_quotes_agent_id ON quotes(agent_id);
CREATE INDEX IF NOT EXISTS idx_quotes_lead_id ON quotes(lead_id);
`
