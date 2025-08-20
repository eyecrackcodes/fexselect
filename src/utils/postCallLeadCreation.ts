import { CustomerData } from '../types'

/**
 * Utility functions for post-call lead creation
 */

/**
 * Validates if customer data has minimum required fields for lead creation
 */
export const validateCustomerDataForLead = (customerData: CustomerData): boolean => {
  // Check for minimum required fields
  const hasName = customerData.customer_first_name || customerData.customer_last_name
  const hasContact = customerData.customer_phone || customerData.email
  
  return !!(hasName && hasContact)
}

/**
 * Gets a summary of collected customer data for confirmation
 */
export const getCustomerDataSummary = (customerData: CustomerData): string => {
  const summary = []
  
  if (customerData.customer_first_name || customerData.customer_last_name) {
    summary.push(`Name: ${customerData.customer_first_name || ''} ${customerData.customer_last_name || ''}`.trim())
  }
  
  if (customerData.customer_phone) {
    summary.push(`Phone: ${customerData.customer_phone}`)
  }
  
  if (customerData.email) {
    summary.push(`Email: ${customerData.email}`)
  }
  
  if (customerData.customer_age) {
    summary.push(`Age: ${customerData.customer_age}`)
  }
  
  if (customerData.coverage_amount) {
    summary.push(`Coverage: $${customerData.coverage_amount.toLocaleString()}`)
  }
  
  if (customerData.monthly_premium) {
    summary.push(`Premium: $${customerData.monthly_premium}/month`)
  }
  
  return summary.join('\n')
}

/**
 * Determines if enough data has been collected to warrant lead creation
 */
export const shouldCreateLead = (customerData: CustomerData): boolean => {
  const hasBasicInfo = validateCustomerDataForLead(customerData)
  
  // Additional criteria for lead worthiness
  const hasInsuranceInterest = !!(
    customerData.coverage_amount || 
    customerData.monthly_premium || 
    customerData.premium_budget ||
    customerData.main_concern ||
    customerData.protection_for
  )
  
  const hasHealthInfo = !!(
    customerData.tobacco_use ||
    customerData.heart_problems ||
    customerData.diabetes ||
    customerData.blood_pressure ||
    customerData.other_health_problems
  )
  
  // Lead should be created if we have basic info and either insurance interest or health info
  return hasBasicInfo && (hasInsuranceInterest || hasHealthInfo)
}

/**
 * Call completion statuses that should trigger lead creation
 */
export const LEAD_CREATION_TRIGGERS = {
  CALL_COMPLETED: 'call_completed',
  QUOTE_PROVIDED: 'quote_provided',
  APPLICATION_STARTED: 'application_started',
  CALLBACK_SCHEDULED: 'callback_scheduled',
  MANUAL_TRIGGER: 'manual_trigger'
} as const

export type LeadCreationTrigger = typeof LEAD_CREATION_TRIGGERS[keyof typeof LEAD_CREATION_TRIGGERS]
