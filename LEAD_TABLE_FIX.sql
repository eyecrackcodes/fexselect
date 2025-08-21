-- Fix for missing columns in leads table
-- Run this in your Supabase SQL editor

-- First, let's check what columns exist
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'leads';

-- Add any missing columns that might not exist yet
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS account_type TEXT,
ADD COLUMN IF NOT EXISTS draft_date TEXT,
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
ADD COLUMN IF NOT EXISTS customer_data JSONB;

-- Verify the columns were added
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY column_name;
