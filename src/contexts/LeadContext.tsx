import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, Lead } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface LeadContextType {
  leads: Lead[]
  currentLead: Lead | null
  loading: boolean
  createLead: (leadData: Partial<Lead>) => Promise<{ data: Lead | null; error: any }>
  updateLead: (id: string, leadData: Partial<Lead>) => Promise<{ error: any }>
  deleteLead: (id: string) => Promise<{ error: any }>
  setCurrentLead: (lead: Lead | null) => void
  fetchLeads: () => Promise<void>
}

const LeadContext = createContext<LeadContextType | undefined>(undefined)

export const useLead = () => {
  const context = useContext(LeadContext)
  if (context === undefined) {
    throw new Error('useLead must be used within a LeadProvider')
  }
  return context
}

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [currentLead, setCurrentLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchLeads()
    }
  }, [user])

  const fetchLeads = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching leads:', error)
      } else {
        setLeads(data || [])
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData: Partial<Lead>) => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    const newLead = {
      ...leadData,
      agent_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([newLead])
      .select()
      .single()

    if (!error && data) {
      setLeads(prev => [data, ...prev])
      setCurrentLead(data)
    }

    return { data, error }
  }

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    const { error } = await supabase
      .from('leads')
      .update({
        ...leadData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (!error) {
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, ...leadData } : lead
      ))
      
      if (currentLead?.id === id) {
        setCurrentLead(prev => prev ? { ...prev, ...leadData } : null)
      }
    }

    return { error }
  }

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (!error) {
      setLeads(prev => prev.filter(lead => lead.id !== id))
      if (currentLead?.id === id) {
        setCurrentLead(null)
      }
    }

    return { error }
  }

  const value = {
    leads,
    currentLead,
    loading,
    createLead,
    updateLead,
    deleteLead,
    setCurrentLead,
    fetchLeads,
  }

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>
}
