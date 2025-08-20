import React from 'react';
import { CustomerData } from '../../types';

interface CustomerDataSummaryProps {
  customerData: CustomerData;
  onClose: () => void;
}

const CustomerDataSummary: React.FC<CustomerDataSummaryProps> = ({ customerData, onClose }) => {
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
      fields: ['agent_producer_number']
    },
    {
      title: 'Rapport Building',
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
      fields: [
        'main_concern',
        'paid_for_funeral',
        'funeral_experience',
        'protection_for'
      ]
    },
    {
      title: 'Medical Information',
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
      fields: ['account_type', 'draft_date']
    },
    {
      title: 'Beneficiary Information',
      fields: [
        'primary_beneficiary',
        'primary_beneficiary_relationship',
        'contingent_beneficiary',
        'contingent_beneficiary_relationship'
      ]
    },
    {
      title: 'Contact Information',
      fields: [
        'address',
        'alternate_phone',
        'email',
        'primary_doctor'
      ]
    },
    {
      title: 'Quote Information',
      fields: [
        'selected_plan',
        'coverage_amount',
        'monthly_premium',
        'selected_carrier'
      ]
    }
  ];

  const exportData = () => {
    const dataStr = JSON.stringify(customerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer_data_${customerData.customer_last_name || 'unknown'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const formattedData = sections
      .map(section => {
        const sectionData = section.fields
          .filter(field => customerData[field as keyof CustomerData])
          .map(field => `${formatFieldName(field)}: ${formatValue(customerData[field as keyof CustomerData])}`)
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
    <div className="w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Customer Data</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-gray-200 space-y-2">
        <button
          onClick={copyToClipboard}
          className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={exportData}
          className="w-full px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Export JSON
        </button>
      </div>

      {/* Customer Name Header */}
      {(customerData.customer_first_name || customerData.customer_last_name) && (
        <div className="p-4 bg-primary-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-primary-900">
            {customerData.customer_first_name} {customerData.customer_last_name}
          </h3>
          {customerData.customer_phone && (
            <p className="text-sm text-primary-700">{customerData.customer_phone}</p>
          )}
        </div>
      )}

      {/* Data Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const sectionData = section.fields.filter(field => 
            customerData[field as keyof CustomerData] !== undefined &&
            customerData[field as keyof CustomerData] !== null &&
            customerData[field as keyof CustomerData] !== ''
          );

          if (sectionData.length === 0) return null;

          return (
            <div key={section.title} className="border-b border-gray-200">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">{section.title}</h4>
                <div className="space-y-2">
                  {sectionData.map((field) => {
                    const value = customerData[field as keyof CustomerData];
                    return (
                      <div key={field} className="flex flex-col">
                        <dt className="text-xs font-medium text-gray-500">
                          {formatFieldName(field)}
                        </dt>
                        <dd className="text-sm text-gray-900 mt-1">
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
        {Object.keys(customerData).length === 0 && (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No customer data</h3>
            <p className="text-xs text-gray-500">
              Customer information will appear here as you progress through the script.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          {Object.keys(customerData).length} fields completed
        </div>
      </div>
    </div>
  );
};

export default CustomerDataSummary;
