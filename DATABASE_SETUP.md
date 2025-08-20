# Database Setup Instructions

This document provides step-by-step instructions for setting up the Supabase database for the FEX Select application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. Your project URL and anon key

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

## Database Schema Setup

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and paste the following SQL:

```sql
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
```

4. Run the query to create all tables and policies

### Option 2: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

1. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

2. Link to your remote project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply the migrations:
   ```bash
   supabase db push
   ```

## Authentication Setup

The application uses Supabase Auth with email/password authentication. No additional setup is required as this is enabled by default in Supabase projects.

### Email Templates (Optional)

You may want to customize the email templates in your Supabase project:

1. Go to Authentication > Templates in your Supabase dashboard
2. Customize the "Confirm signup" and "Reset password" templates as needed

## Testing the Setup

1. Start your React application:
   ```bash
   npm start
   ```

2. Navigate to the application in your browser
3. Try creating a new agent account
4. Verify that you can log in and access the dashboard

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure your `.env` file is in the root directory and restart your development server.

2. **Database connection errors**: Verify your Supabase URL and anon key are correct in the `.env` file.

3. **RLS (Row Level Security) errors**: Ensure all policies are created correctly and that users are authenticated.

4. **Table creation errors**: Check that you have the necessary permissions in your Supabase project.

### Checking Database Status

You can verify your database setup by:

1. Going to the Table Editor in your Supabase dashboard
2. Confirming that `agents`, `leads`, and `quotes` tables exist
3. Checking that RLS is enabled on all tables
4. Verifying that policies are in place

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already added to `.gitignore`
- Use the `.env.example` file as a template for other developers
- Regularly rotate your Supabase keys if needed
- Monitor your Supabase project for unusual activity

## Support

If you encounter issues during setup:

1. Check the Supabase documentation: https://supabase.com/docs
2. Review the application logs in your browser's developer console
3. Check the Supabase project logs in your dashboard
