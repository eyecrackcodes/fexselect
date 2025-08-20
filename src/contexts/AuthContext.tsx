import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Agent } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  agent: Agent | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string, npnNumber: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateAgentProfile: (name: string, npnNumber: string) => Promise<{ error: any }>
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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAgentProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchAgentProfile(session.user.id)
      } else {
        setAgent(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchAgentProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching agent profile:', error)
        return
      }

      setAgent(data)
    } catch (error) {
      console.error('Error fetching agent profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, name: string, npnNumber: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return { error }

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
        return { error: profileError }
      }
    }

    return { error: null }
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
    signIn,
    signUp,
    signOut,
    updateAgentProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
