import React from 'react';
import { CustomerData } from '../../types';

interface CustomerDataSummaryProps {
  customerData?: CustomerData;
  onClose?: () => void;
}

const CustomerDataSummary: React.FC<CustomerDataSummaryProps> = ({ customerData, onClose }) => {
  // Ensure we have a valid customerData object to work with
  const safeCustomerData = customerData || {};
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      color: 'text-purple-600 bg-purple-50',
      fields: ['agent_producer_number']
    },
    {
      title: 'Rapport Building',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'text-yellow-600 bg-yellow-50',
      fields: ['account_type', 'draft_date']
    },
    {
      title: 'Beneficiary Information',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
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
    <div className="w-96 bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 shadow-xl flex flex-col h-full">
      {/* Header */}
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

      {/* Actions */}
      <div className="p-4 bg-white border-b border-gray-100 space-y-3">
        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy to Clipboard</span>
        </button>
        <button
          onClick={exportData}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 border border-transparent rounded-lg hover:from-primary-700 hover:to-primary-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export JSON</span>
        </button>
      </div>

      {/* Customer Name Header */}
      {(safeCustomerData.customer_first_name || safeCustomerData.customer_last_name) && (
        <div className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-primary-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {(safeCustomerData.customer_first_name?.[0] || '') + (safeCustomerData.customer_last_name?.[0] || '')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-900">
                {safeCustomerData.customer_first_name} {safeCustomerData.customer_last_name}
              </h3>
              {safeCustomerData.customer_phone && (
                <div className="flex items-center space-x-1 mt-1">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-sm font-medium text-primary-700">{safeCustomerData.customer_phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const sectionData = section.fields.filter(field => 
            safeCustomerData[field as keyof CustomerData] !== undefined &&
            safeCustomerData[field as keyof CustomerData] !== null &&
            safeCustomerData[field as keyof CustomerData] !== ''
          );

          if (sectionData.length === 0) return null;

          return (
            <div key={section.title} className="border-b border-gray-100 last:border-b-0">
              <div className="p-5">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.color}`}>
                    {section.icon}
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">{section.title}</h4>
                </div>
                <div className="grid gap-3">
                  {sectionData.map((field) => {
                    const value = safeCustomerData[field as keyof CustomerData];
                    return (
                      <div key={field} className="bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors duration-150">
                        <dt className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          {formatFieldName(field)}
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
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
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customer Data Yet</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
              Customer information will appear here as you progress through the sales script and collect details.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <div className="text-xs font-medium text-gray-700">
            {Object.keys(safeCustomerData).length} fields completed
          </div>
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDataSummary;
