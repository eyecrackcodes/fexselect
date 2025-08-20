import React, { useState } from 'react'
import { CustomerData } from '../../types'
import { useLead } from '../../contexts/LeadContext'
import { 
  validateCustomerDataForLead, 
  getCustomerDataSummary, 
  shouldCreateLead,
  LEAD_CREATION_TRIGGERS,
  LeadCreationTrigger
} from '../../utils/postCallLeadCreation'

interface PostCallLeadCreationProps {
  customerData: CustomerData
  onLeadCreated?: (leadId: string) => void
  onCancel?: () => void
  trigger?: LeadCreationTrigger
}

const PostCallLeadCreation: React.FC<PostCallLeadCreationProps> = ({
  customerData,
  onLeadCreated,
  onCancel,
  trigger = LEAD_CREATION_TRIGGERS.MANUAL_TRIGGER
}) => {
  const { createLeadFromScriptData, loading } = useLead()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const canCreateLead = validateCustomerDataForLead(customerData)
  const shouldAutoCreate = shouldCreateLead(customerData)
  const dataSummary = getCustomerDataSummary(customerData)

  const handleCreateLead = async () => {
    if (!canCreateLead) {
      setError('Insufficient customer data to create lead. Need at least name and contact information.')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const { data, error: createError } = await createLeadFromScriptData(customerData)
      
      if (createError) {
        setError(`Failed to create lead: ${createError.message}`)
      } else if (data) {
        setSuccess(true)
        onLeadCreated?.(data.id)
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsCreating(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Created Successfully!</h3>
          <p className="text-gray-600 mb-4">
            The customer information has been saved as a new lead in your system.
          </p>
          <button
            onClick={onCancel}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Create Lead from Call Data
        </h3>
        <p className="text-sm text-gray-600">
          {trigger === LEAD_CREATION_TRIGGERS.CALL_COMPLETED && 'Call completed. '}
          {trigger === LEAD_CREATION_TRIGGERS.QUOTE_PROVIDED && 'Quote provided. '}
          {trigger === LEAD_CREATION_TRIGGERS.CALLBACK_SCHEDULED && 'Callback scheduled. '}
          Would you like to save this customer information as a lead?
        </p>
      </div>

      {/* Customer Data Summary */}
      <div className="bg-gray-50 rounded-md p-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information:</h4>
        <div className="text-sm text-gray-700 whitespace-pre-line">
          {dataSummary || 'No customer data collected'}
        </div>
      </div>

      {/* Validation Status */}
      <div className="mb-4">
        {canCreateLead ? (
          <div className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ready to create lead
          </div>
        ) : (
          <div className="flex items-center text-amber-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Need name and contact info to create lead
          </div>
        )}
        
        {shouldAutoCreate && (
          <div className="flex items-center text-blue-600 text-sm mt-1">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recommended: Good lead potential detected
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-center text-red-800 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleCreateLead}
          disabled={!canCreateLead || isCreating || loading}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            canCreateLead && !isCreating && !loading
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isCreating || loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </div>
          ) : (
            'Create Lead'
          )}
        </button>
        
        <button
          onClick={onCancel}
          disabled={isCreating || loading}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Skip
        </button>
      </div>
    </div>
  )
}

export default PostCallLeadCreation
