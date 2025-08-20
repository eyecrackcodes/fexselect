import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, Lead } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { CustomerData } from '../types'

interface LeadContextType {
  leads: Lead[]
  currentLead: Lead | null
  loading: boolean
  createLead: (leadData: Partial<Lead>) => Promise<{ data: Lead | null; error: any }>
  updateLead: (id: string, leadData: Partial<Lead>) => Promise<{ error: any }>
  deleteLead: (id: string) => Promise<{ error: any }>
  setCurrentLead: (lead: Lead | null) => void
  fetchLeads: () => Promise<void>
  createLeadFromScriptData: (customerData: CustomerData) => Promise<{ data: Lead | null; error: any }>
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
    if (!user) {
      console.error('No user logged in')
      return { data: null, error: new Error('No user logged in') }
    }

    console.log('Creating lead with user ID:', user.id)
    console.log('Lead data:', leadData)

    const newLead = {
      ...leadData,
      agent_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('Prepared lead data for insertion:', newLead)

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single()

      console.log('Supabase response:', { data, error })

      if (!error && data) {
        setLeads(prev => [data, ...prev])
        setCurrentLead(data)
        console.log('Lead created successfully and state updated')
      } else if (error) {
        console.error('Supabase error creating lead:', error)
      }

      return { data, error }
    } catch (err) {
      console.error('Unexpected error in createLead:', err)
      return { data: null, error: err }
    }
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

  const createLeadFromScriptData = async (customerData: CustomerData) => {
    if (!user) {
      console.error('No user logged in')
      return { data: null, error: new Error('No user logged in') }
    }

    // Map CustomerData to Lead format
    const leadData: Partial<Lead> = {
      first_name: customerData.customer_first_name || '',
      last_name: customerData.customer_last_name || '',
      email: customerData.email,
      phone: customerData.customer_phone,
      date_of_birth: customerData.customer_dob,
      tobacco_use: customerData.tobacco_use === 'yes',
      coverage_amount: customerData.coverage_amount || (customerData.selected_plan ? parseInt(customerData.selected_plan) : undefined),
      premium_budget: customerData.premium_budget || customerData.monthly_premium,
      // Map health conditions from various medical fields
      health_conditions: [
        customerData.heart_problems === 'yes' ? 'Heart Problems' : null,
        customerData.stroke_history === 'yes' ? 'Stroke History' : null,
        customerData.cancer_history === 'yes' ? 'Cancer History' : null,
        customerData.diabetes === 'yes' ? 'Diabetes' : null,
        customerData.blood_pressure === 'yes' ? 'High Blood Pressure' : null,
        customerData.emphysema_copd === 'yes' ? 'COPD/Emphysema' : null,
        customerData.other_health_problems ? `Other: ${customerData.other_health_problems}` : null
      ].filter(Boolean) as string[]
    }

    console.log('Creating lead from script data:', leadData)
    console.log('Original customer data:', customerData)

    return await createLead(leadData)
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
    createLeadFromScriptData,
  }

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>
}
