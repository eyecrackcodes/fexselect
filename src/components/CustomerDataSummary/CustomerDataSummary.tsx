import React, { useState } from 'react';
import { CustomerData } from '../../types';
import { useLead } from '../../contexts/LeadContext';

interface CustomerDataSummaryProps {
  customerData?: CustomerData;
  onClose?: () => void;
}

const CustomerDataSummary: React.FC<CustomerDataSummaryProps> = ({ customerData, onClose }) => {
  // Ensure we have a valid customerData object to work with
  const safeCustomerData = customerData || {};
  const isFullPage = !onClose; // If no onClose prop, assume full page view
  const { createLeadFromScriptData } = useLead();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const formatFieldName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }
    return String(value);
  };

  const sections = [
    {
      title: 'Personal Information',
      icon: <i className="fas fa-user text-lg"></i>,
      color: 'text-blue-600 bg-blue-50',
      fields: [
        'customer_first_name',
        'customer_last_name',
        'customer_phone',
        'customer_state',
        'customer_city',
        'customer_age',
        'customer_dob'
      ]
    },
    {
      title: 'Agent Information',
      icon: <i className="fas fa-id-badge text-lg"></i>,
      color: 'text-purple-600 bg-purple-50',
      fields: ['agent_producer_number']
    },
    {
      title: 'Rapport Building',
      icon: <i className="fas fa-users text-lg"></i>,
      color: 'text-green-600 bg-green-50',
      fields: [
        'marital_status',
        'has_children',
        'retirement_status',
        'previous_occupation',
        'current_occupation',
        'hobbies_interests'
      ]
    },
    {
      title: 'Qualifying Information',
      icon: <i className="fas fa-check-circle text-lg"></i>,
      color: 'text-indigo-600 bg-indigo-50',
      fields: [
        'main_concern',
        'paid_for_funeral',
        'funeral_experience',
        'protection_for'
      ]
    },
    {
      title: 'Medical Information',
      icon: <i className="fas fa-heartbeat text-lg"></i>,
      color: 'text-red-600 bg-red-50',
      fields: [
        'tobacco_use',
        'height',
        'weight',
        'heart_problems',
        'stroke_history',
        'cancer_history',
        'aids_hiv_terminal',
        'diabetes',
        'diabetes_treatment',
        'diabetes_medication_changed',
        'ever_used_insulin',
        'insulin_before_50',
        'diabetes_complications',
        'diabetes_complication_types',
        'blood_pressure',
        'blood_pressure_medication_changed',
        'emphysema_copd',
        'inhalers_nebulizer_oxygen',
        'autoimmune_disorders',
        'liver_kidney_disease',
        'alcohol_drug_treatment',
        'disability_status',
        'disability_reason',
        'mobility_aids',
        'home_health_care',
        'other_health_problems',
        'medications'
      ]
    },
    {
      title: 'Banking Information',
      icon: <i className="fas fa-credit-card text-lg"></i>,
      color: 'text-yellow-600 bg-yellow-50',
      fields: ['account_type', 'draft_date']
    },
    {
      title: 'Beneficiary Information',
      icon: <i className="fas fa-user-friends text-lg"></i>,
      color: 'text-pink-600 bg-pink-50',
      fields: [
        'primary_beneficiary',
        'primary_beneficiary_relationship',
        'contingent_beneficiary',
        'contingent_beneficiary_relationship'
      ]
    },
    {
      title: 'Contact Information',
      icon: <i className="fas fa-address-book text-lg"></i>,
      color: 'text-teal-600 bg-teal-50',
      fields: [
        'address',
        'alternate_phone',
        'email',
        'primary_doctor'
      ]
    },
    {
      title: 'Quote Information',
      icon: <i className="fas fa-dollar-sign text-lg"></i>,
      color: 'text-emerald-600 bg-emerald-50',
      fields: [
        'selected_plan',
        'coverage_amount',
        'monthly_premium',
        'selected_carrier'
      ]
    }
  ];

  const exportData = () => {
    const dataStr = JSON.stringify(safeCustomerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer_data_${safeCustomerData.customer_last_name || 'unknown'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { data, error } = await createLeadFromScriptData(safeCustomerData);
      
      if (error) {
        setSaveError(error.message);
      } else if (data) {
        setSaveSuccess(true);
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if we have minimum required data to save
  const canSave = safeCustomerData.customer_first_name && 
                  safeCustomerData.customer_last_name && 
                  (safeCustomerData.customer_phone || safeCustomerData.email);

  // Calculate completion percentage
  const totalPossibleFields = 50; // Approximate total fields in CustomerData
  const filledFields = Object.keys(safeCustomerData).length;
  const completionPercentage = Math.round((filledFields / totalPossibleFields) * 100);

  const copyToClipboard = () => {
    const formattedData = sections
      .map(section => {
        const sectionData = section.fields
          .filter(field => safeCustomerData[field as keyof CustomerData])
          .map(field => `${formatFieldName(field)}: ${formatValue(safeCustomerData[field as keyof CustomerData])}`)
          .join('\n');
        
        return sectionData ? `${section.title}:\n${sectionData}` : '';
      })
      .filter(Boolean)
      .join('\n\n');

    navigator.clipboard.writeText(formattedData).then(() => {
      alert('Customer data copied to clipboard!');
    });
  };

  return (
    <div className={isFullPage ? "max-w-6xl mx-auto fade-in" : "w-96 bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 shadow-xl flex flex-col h-full"}>
      {/* Header */}
      {isFullPage ? (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Summary & Save</h1>
              <p className="text-gray-600 mt-2">Review customer information and save as a lead</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600 mb-2">Data Completion</div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Customer Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Save Success/Error Messages */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <i className="fas fa-check-circle text-green-600 text-xl"></i>
          <div>
            <p className="font-semibold text-green-900">Lead Saved Successfully!</p>
            <p className="text-sm text-green-700">You can now view this lead in your Lead Management section.</p>
          </div>
        </div>
      )}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <i className="fas fa-exclamation-circle text-red-600 text-xl"></i>
          <div>
            <p className="font-semibold text-red-900">Error Saving Lead</p>
            <p className="text-sm text-red-700">{saveError}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={isFullPage ? "flex gap-4 mb-8" : "p-4 bg-white border-b border-gray-100 space-y-3"}>
        {isFullPage && (
          <button
            onClick={handleSaveToDatabase}
            disabled={!canSave || isSaving}
            className="btn-primary flex items-center gap-2 min-w-[200px]"
          >
            {isSaving ? (
              <>
                <div className="loading-spinner"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>Save as Lead</span>
              </>
            )}
          </button>
        )}
        <button
          onClick={copyToClipboard}
          className={isFullPage ? "btn-secondary flex items-center gap-2" : "w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"}
        >
          <i className="fas fa-copy"></i>
          <span>Copy to Clipboard</span>
        </button>
        <button
          onClick={exportData}
          className={isFullPage ? "btn-secondary flex items-center gap-2" : "w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 border border-transparent rounded-lg hover:from-primary-700 hover:to-primary-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"}
        >
          <i className="fas fa-download"></i>
          <span>Export Data</span>
        </button>
      </div>

      {/* Customer Name Header */}
      {(safeCustomerData.customer_first_name || safeCustomerData.customer_last_name) && (
        <div className={isFullPage ? "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6" : "p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-primary-100"}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {safeCustomerData.customer_first_name} {safeCustomerData.customer_last_name}
            </h2>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              {safeCustomerData.customer_phone && (
                <div className="flex items-center gap-1">
                  <i className="fas fa-phone text-sm"></i>
                  <span className="text-sm">{safeCustomerData.customer_phone}</span>
                </div>
              )}
              {safeCustomerData.customer_state && (
                <div className="flex items-center gap-1">
                  <i className="fas fa-map-marker-alt text-sm"></i>
                  <span className="text-sm">{safeCustomerData.customer_city ? `${safeCustomerData.customer_city}, ` : ''}{safeCustomerData.customer_state}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Sections */}
      <div className={isFullPage ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex-1 overflow-y-auto"}>
        {sections.map((section) => {
              const sectionData = section.fields.filter(field => {
      const value = safeCustomerData[field as keyof CustomerData];
      return value !== undefined && value !== null && value !== '';
    });

          if (sectionData.length === 0) return null;

          return (
            <div key={section.title} className={isFullPage ? "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" : "border-b border-gray-100 last:border-b-0"}>
              <div className={isFullPage ? "px-6 py-4 border-b border-gray-100 bg-gray-50" : "p-5"}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                    {section.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                </div>
              </div>
              <div className={isFullPage ? "p-6" : "px-5 pb-5"}>
                <div className="space-y-2">
                  {sectionData.map((field) => {
                    const value = safeCustomerData[field as keyof CustomerData];
                    return (
                      <div key={field} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                        <dt className="text-sm text-gray-600 font-medium">
                          {formatFieldName(field)}
                        </dt>
                        <dd className="text-sm text-gray-900 font-semibold text-right ml-4">
                          {formatValue(value)}
                        </dd>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {Object.keys(safeCustomerData).length === 0 && (
          <div className={isFullPage ? "col-span-full" : ""}>
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-file-alt text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Customer Data Yet</h3>
              <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                Customer information will appear here as you progress through the sales script.
                Once you have collected the necessary information, you can save it as a lead.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {isFullPage && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              <i className="fas fa-check-circle text-primary-600 mr-2"></i>
              {Object.keys(safeCustomerData).length} fields completed
            </div>
            {!canSave && (
              <div className="text-sm text-amber-600 flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                <span>Need name and contact info to save</span>
              </div>
            )}
          </div>
        </div>
      )}
      {!isFullPage && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <div className="text-xs font-medium text-gray-700">
              {Object.keys(safeCustomerData).length} fields completed
            </div>
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDataSummary;
