import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Agent } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  agent: Agent | null
  loading: boolean
  authLoading: boolean
  profileLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string, npnNumber: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateAgentProfile: (name: string, npnNumber: string) => Promise<{ error: any }>
  clearError: () => void
  retryAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (loading) {
        console.error('Authentication timeout - this may indicate Supabase connection issues');
        setLoading(false);
        setError('Connection timeout. This may be due to Supabase configuration issues. Check the browser console for more details.');
      }
    }, 10000); // 10 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session retrieved:', session ? 'User found' : 'No user');
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAgentProfile(session.user.id)
      } else {
        setLoading(false)
      }
      clearTimeout(timeoutId);
    }).catch((error) => {
      console.error('Error getting session:', error);
      console.error('This usually indicates a Supabase configuration problem');
      setError(`Failed to initialize authentication: ${error.message}. Check browser console for details.`);
      setLoading(false);
      clearTimeout(timeoutId);
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'User present' : 'No user');
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchAgentProfile(session.user.id)
      } else {
        setAgent(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId);
    }
  }, [])

  const fetchAgentProfile = async (userId: string) => {
    setProfileLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No agent profile found - this is expected for new users
          console.log('No agent profile found for user:', userId)
          setAgent(null)
        } else {
          console.error('Error fetching agent profile:', error)
          setError('Failed to load agent profile. Please try again.')
        }
      } else {
        setAgent(data)
      }
    } catch (error) {
      console.error('Error fetching agent profile:', error)
      setError('Failed to load agent profile. Please try again.')
    } finally {
      setProfileLoading(false)
      setLoading(false) // Ensure main loading is also set to false
    }
  }

  const clearError = () => {
    setError(null)
  }

  const retryAuth = async () => {
    if (user) {
      await fetchAgentProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setError(error.message)
      }
      
      return { error }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign in'
      setError(errorMessage)
      return { error: new Error(errorMessage) }
    } finally {
      setAuthLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, npnNumber: string) => {
    setAuthLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return { error }
      }

      if (data.user) {
        // Create agent profile
        const { error: profileError } = await supabase
          .from('agents')
          .insert([
            {
              id: data.user.id,
              name,
              npn_number: npnNumber,
              email,
            }
          ])

        if (profileError) {
          console.error('Error creating agent profile:', profileError)
          setError('Failed to create agent profile. Please try again.')
          return { error: profileError }
        }
      }

      return { error: null }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign up'
      setError(errorMessage)
      return { error: new Error(errorMessage) }
    } finally {
      setAuthLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateAgentProfile = async (name: string, npnNumber: string) => {
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('agents')
      .upsert([
        {
          id: user.id,
          name,
          npn_number: npnNumber,
          email: user.email,
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (!error && data) {
      setAgent(data)
    }

    return { error }
  }

  const value = {
    user,
    agent,
    loading,
    authLoading,
    profileLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateAgentProfile,
    clearError,
    retryAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
