-- Enhanced Lead Table Migration
-- This migration adds comprehensive fields to store all customer data collected during the script

-- Add new columns to the leads table to store all medical and personal information
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS customer_data JSONB,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS has_children TEXT,
ADD COLUMN IF NOT EXISTS retirement_status TEXT,
ADD COLUMN IF NOT EXISTS previous_occupation TEXT,
ADD COLUMN IF NOT EXISTS current_occupation TEXT,
ADD COLUMN IF NOT EXISTS hobbies_interests TEXT,
ADD COLUMN IF NOT EXISTS main_concern TEXT,
ADD COLUMN IF NOT EXISTS height TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS diabetes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS diabetes_details JSONB,
ADD COLUMN IF NOT EXISTS blood_pressure BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS heart_problems BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stroke_history BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cancer_history BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS copd_emphysema BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS other_health_conditions TEXT,
ADD COLUMN IF NOT EXISTS medications TEXT[],
ADD COLUMN IF NOT EXISTS primary_doctor TEXT,
ADD COLUMN IF NOT EXISTS primary_beneficiary TEXT,
ADD COLUMN IF NOT EXISTS primary_beneficiary_relationship TEXT,
ADD COLUMN IF NOT EXISTS contingent_beneficiary TEXT,
ADD COLUMN IF NOT EXISTS contingent_beneficiary_relationship TEXT,
ADD COLUMN IF NOT EXISTS selected_carrier TEXT,
ADD COLUMN IF NOT EXISTS selected_plan TEXT,
ADD COLUMN IF NOT EXISTS monthly_premium NUMERIC,
ADD COLUMN IF NOT EXISTS account_type TEXT,
ADD COLUMN IF NOT EXISTS draft_date TEXT;

-- Create a comment on the customer_data column explaining its purpose
COMMENT ON COLUMN leads.customer_data IS 'Full JSON storage of all customer data collected during the script for complete record keeping';

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_tobacco_use ON leads(tobacco_use);
CREATE INDEX IF NOT EXISTS idx_leads_diabetes ON leads(diabetes);

-- Sample query to show how the enhanced data can be used
-- SELECT 
--   first_name, 
--   last_name, 
--   phone,
--   state,
--   tobacco_use,
--   diabetes,
--   customer_data->>'insulin_before_50' as insulin_before_50,
--   customer_data->>'disability_status' as disability_status
-- FROM leads 
-- WHERE agent_id = ? 
-- AND created_at > NOW() - INTERVAL '30 days';
