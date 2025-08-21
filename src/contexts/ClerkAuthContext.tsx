import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import { supabase, Agent } from '../lib/supabase'

interface AuthContextType {
  user: any | null
  agent: Agent | null
  loading: boolean
  profileLoading: boolean
  error: string | null
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
  const { user, isLoaded: userLoaded } = useUser()
  const { userId } = useClerkAuth()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userLoaded && userId) {
      fetchAgentProfile(userId)
    } else if (userLoaded && !userId) {
      setAgent(null)
    }
  }, [userLoaded, userId])

  const fetchAgentProfile = async (clerkUserId: string) => {
    setProfileLoading(true)
    setError(null)
    try {
      console.log('Fetching agent profile for Clerk user:', clerkUserId)
      
      // First check if agent exists by email (for existing users)
      if (user?.primaryEmailAddress) {
        const email = user.primaryEmailAddress.emailAddress;
        
        // Try to find existing agent by email first
        const { data: existingByEmail, error: emailError } = await supabase
          .from('agents')
          .select('*')
          .eq('email', email)
          .single()
        
        if (existingByEmail && !existingByEmail.clerk_id) {
          // Update existing agent with clerk_id
          console.log('Updating existing agent with Clerk ID')
          const { data: updatedAgent, error: updateError } = await supabase
            .from('agents')
            .update({ clerk_id: clerkUserId })
            .eq('id', existingByEmail.id)
            .select()
            .single()
          
          if (!updateError && updatedAgent) {
            setAgent(updatedAgent)
            return
          }
        } else if (existingByEmail && existingByEmail.clerk_id === clerkUserId) {
          // Agent already has correct clerk_id
          setAgent(existingByEmail)
          return
        }
      }
      
      // Then check if agent exists with Clerk ID
      const { data: existingAgent, error: fetchError } = await supabase
        .from('agents')
        .select('*')
        .eq('clerk_id', clerkUserId)
        .maybeSingle() // Use maybeSingle instead of single to avoid errors
      
      if (existingAgent) {
        console.log('Agent profile found:', existingAgent)
        setAgent(existingAgent)
      } else if (user?.primaryEmailAddress && !fetchError) {
        // Create agent profile if it doesn't exist
        console.log('Creating new agent profile for:', user.primaryEmailAddress.emailAddress)
        
        // Generate a UUID for the new agent
        const newAgentId = crypto.randomUUID();
        
        const { data: newAgent, error: createError } = await supabase
          .from('agents')
          .insert([
            {
              id: newAgentId, // Explicitly set the ID
              clerk_id: clerkUserId,
              email: user.primaryEmailAddress.emailAddress,
              name: user.fullName || user.firstName || 'New Agent',
              npn_number: 'PENDING', // User will need to update this
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Error creating agent profile:', createError)
          if (createError.code === '23505') { // Unique constraint violation
            setError('An agent profile already exists. Please refresh the page.')
          } else {
            setError('Unable to create agent profile. Please check database configuration.')
          }
        } else if (newAgent) {
          setAgent(newAgent)
        }
      }
    } catch (error) {
      console.error('Error in fetchAgentProfile:', error)
      setError('Failed to load agent profile. Please try again.')
    } finally {
      setProfileLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const retryAuth = async () => {
    if (userId) {
      await fetchAgentProfile(userId)
    }
  }

  const updateAgentProfile = async (name: string, npnNumber: string) => {
    if (!userId) return { error: new Error('No user logged in') }

    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('agents')
        .update({
          name,
          npn_number: npnNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', userId)
        .select()
        .single()

      if (!error && data) {
        setAgent(data)
      }

      return { error }
    } finally {
      setProfileLoading(false)
    }
  }

  const value = {
    user,
    agent,
    loading: !userLoaded,
    profileLoading,
    error,
    updateAgentProfile,
    clearError,
    retryAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
