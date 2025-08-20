import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set')
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Not set')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    REACT_APP_SUPABASE_URL: supabaseUrl,
    REACT_APP_SUPABASE_ANON_KEY: supabaseAnonKey ? '[HIDDEN]' : 'Not set'
  })
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error)
  } else {
    console.log('Supabase connection successful')
  }
}).catch((error) => {
  console.error('Failed to connect to Supabase:', error)
})

// Database types
export interface Agent {
  id: string
  name: string
  npn_number: string
  email: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  agent_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  tobacco_use?: boolean
  health_conditions?: string[]
  coverage_amount?: number
  coverage_type?: string
  premium_budget?: number
  created_at: string
  updated_at: string
}

export interface Quote {
  id: string
  lead_id: string
  agent_id: string
  carrier: string
  product_name: string
  coverage_amount: number
  monthly_premium: number
  annual_premium: number
  quote_data: any
  created_at: string
}
