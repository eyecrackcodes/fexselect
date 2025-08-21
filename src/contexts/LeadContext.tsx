import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, Lead } from '../lib/supabase'
import { useAuth } from './ClerkAuthContext'
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
  const { agent } = useAuth()

  useEffect(() => {
    if (agent) {
      fetchLeads()
    }
  }, [agent])

  const fetchLeads = async () => {
    if (!agent) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('agent_id', agent.id)
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
    if (!agent) {
      console.error('No agent profile found')
      return { data: null, error: new Error('No agent profile found') }
    }

    console.log('Creating lead with agent ID:', agent.id)
    console.log('Lead data:', leadData)

    const newLead = {
      ...leadData,
      agent_id: agent.id,
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
    if (!agent) {
      console.error('No agent profile found')
      return { data: null, error: new Error('No agent profile found') }
    }

    // Map CustomerData to Lead format with enhanced fields
    const leadData: any = {
      first_name: customerData.customer_first_name || '',
      last_name: customerData.customer_last_name || '',
      email: customerData.email,
      phone: customerData.customer_phone,
      date_of_birth: customerData.customer_dob,
      tobacco_use: customerData.tobacco_use === 'yes',
      coverage_amount: customerData.coverage_amount || (customerData.selected_plan ? parseInt(customerData.selected_plan) : undefined),
      premium_budget: customerData.premium_budget || customerData.monthly_premium,
      
      // Additional personal information
      state: customerData.customer_state,
      city: customerData.customer_city,
      address: customerData.address,
      alternate_phone: customerData.alternate_phone,
      age: customerData.customer_age,
      
      // Rapport building information
      marital_status: customerData.marital_status,
      has_children: customerData.has_children,
      retirement_status: customerData.retirement_status,
      previous_occupation: customerData.previous_occupation,
      current_occupation: customerData.current_occupation,
      hobbies_interests: customerData.hobbies_interests,
      main_concern: customerData.main_concern,
      
      // Medical information
      height: customerData.height,
      weight: customerData.weight,
      diabetes: customerData.diabetes === 'yes',
      diabetes_details: customerData.diabetes === 'yes' ? {
        treatment: customerData.diabetes_treatment,
        medication_changed: customerData.diabetes_medication_changed,
        ever_used_insulin: customerData.ever_used_insulin,
        insulin_before_50: customerData.insulin_before_50,
        complications: customerData.diabetes_complications,
        complication_types: customerData.diabetes_complication_types
      } : null,
      blood_pressure: customerData.blood_pressure === 'yes',
      heart_problems: customerData.heart_problems === 'yes',
      stroke_history: customerData.stroke_history === 'yes',
      cancer_history: customerData.cancer_history === 'yes',
      copd_emphysema: customerData.emphysema_copd === 'yes',
      other_health_conditions: customerData.other_health_problems,
      medications: customerData.medications 
        ? (typeof customerData.medications === 'string' 
          ? (customerData.medications as string).split(',').map((med: string) => med.trim()).filter((med: string) => med.length > 0)
          : customerData.medications)
        : [],
      primary_doctor: customerData.primary_doctor,
      
      // Beneficiary information
      primary_beneficiary: customerData.primary_beneficiary,
      primary_beneficiary_relationship: customerData.primary_beneficiary_relationship,
      contingent_beneficiary: customerData.contingent_beneficiary,
      contingent_beneficiary_relationship: customerData.contingent_beneficiary_relationship,
      
      // Quote/Policy information
      selected_carrier: customerData.selected_carrier,
      selected_plan: customerData.selected_plan,
      monthly_premium: customerData.monthly_premium,
      account_type: customerData.account_type,
      draft_date: customerData.draft_date,
      
      // Store complete customer data as JSON for full record keeping
      customer_data: customerData,
      
      // Map health conditions for backward compatibility
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

    // Temporary: Remove fields that might not exist in the database yet
    // This prevents errors while the user updates their database schema
    const fieldsToExclude = ['account_type', 'draft_date', 'selected_carrier', 'selected_plan', 'monthly_premium'];
    const filteredLeadData = Object.keys(leadData).reduce((acc, key) => {
      if (!fieldsToExclude.includes(key)) {
        acc[key] = leadData[key];
      }
      return acc;
    }, {} as any);

    console.log('Creating lead with filtered data:', filteredLeadData)
    
    return await createLead(filteredLeadData)
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
