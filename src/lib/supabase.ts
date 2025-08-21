import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Enhanced logging for debugging
console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ Not set')
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Not set')

// Create a placeholder client if credentials are missing
let supabase: SupabaseClient

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!')
  console.error('Please follow these steps:')
  console.error('1. Run: node setup-env.js')
  console.error('2. Update the .env file with your Supabase credentials')
  console.error('3. Restart your development server')
  console.error('')
  console.error('You can find your credentials at:')
  console.error('URL: Supabase Dashboard > Settings > API > Project URL')
  console.error('Key: Supabase Dashboard > Settings > API > anon public key')
  
  // Create a dummy client to prevent app crashes
  // This will fail gracefully when methods are called
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not configured') })
        })
      }),
      insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
      upsert: async () => ({ data: null, error: new Error('Supabase not configured') }),
    })
  } as any
} else {
  // Create the Supabase client with simplified configuration
  // Removing custom fetch to avoid potential issues
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })

  // Test connection with simpler approach
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Supabase auth error:', error.message)
        } else {
          console.log('✅ Supabase client initialized successfully')
        }
      })
      .catch((error) => {
        console.error('❌ Failed to initialize Supabase:', error)
      })
  }
}

export { supabase }

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
