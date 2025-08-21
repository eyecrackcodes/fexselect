import React, { useState, useEffect } from 'react';
import { googleFormsIntegration } from '../../utils/googleFormsIntegration';

interface GoogleFormsConfigProps {
  onConfigured?: (isConfigured: boolean) => void;
}

const GoogleFormsConfig: React.FC<GoogleFormsConfigProps> = ({ onConfigured }) => {
  const [formUrl, setFormUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    // Check if Google Forms is already configured
    const status = googleFormsIntegration.getConfigStatus();
    setIsConfigured(status.configured);
    onConfigured?.(status.configured);
  }, [onConfigured]);

  const handleSaveConfig = () => {
    if (formUrl) {
      // Field mappings for your Google Form
      const fieldMappings = {
        // Reference and Company Info
        reference_id: '1234567890', // Replace with your Google Form entry IDs
        company_name: '1234567891',
        plan_type: '1234567892',
        rop_yes_questions: '1234567893',
        
        // Insured Information
        insured_name: '1234567894', // Will combine first + last name
        address: '1234567895',
        city: '1234567896',
        state: '1234567897',
        zip_code: '1234567898',
        telephone_number: '1234567899',
        email_address: '1234567900',
        gender: '1234567901',
        dob: '1234567902',
        age: '1234567903',
        state_of_birth: '1234567904',
        ss_number: '1234567905',
        height: '1234567906',
        weight: '1234567907',
        
        // Owner/Payor Information
        owner_if_other: '1234567908',
        owner_ss: '1234567909',
        payor_if_other: '1234567910',
        payor_ss: '1234567911',
        payor_dob: '1234567912',
        
        // Beneficiary Information
        primary_beneficiary: '1234567913',
        contingent_beneficiary: '1234567914',
        
        // Policy Information
        face_amount: '1234567915',
        riders: '1234567916',
        monthly_premium: '1234567917',
        tobacco_y_or_n: '1234567918',
        
        // Additional Information
        physician_name: '1234567919',
        name_of_bank: '1234567920',
        name_as_appears_on_account: '1234567921',
        routing: '1234567922',
        account: '1234567923',
        account_type: '1234567924',
        draft_day: '1234567925',
        
        // Summary Fields
        summary_state: '1234567926',
        summary_age: '1234567927',
        summary_dob: '1234567928',
        summary_tobacco: '1234567929',
        summary_ht_wt: '1234567930',
        summary_health: '1234567931',
        summary_meds: '1234567932',
        summary_current: '1234567933',
        summary_concern: '1234567934'
      };

      googleFormsIntegration.updateConfig(formUrl, fieldMappings);
      setIsConfigured(true);
      setShowConfig(false);
      onConfigured?.(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('googleFormUrl', formUrl);
      localStorage.setItem('googleFormMappings', JSON.stringify(fieldMappings));
    }
  };

  // Load saved configuration on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('googleFormUrl');
    const savedMappings = localStorage.getItem('googleFormMappings');
    
    if (savedUrl) {
      setFormUrl(savedUrl);
      const mappings = savedMappings ? JSON.parse(savedMappings) : {};
      googleFormsIntegration.updateConfig(savedUrl, mappings);
      setIsConfigured(true);
    }
  }, []);

  return (
    <div className="mb-4">
      {!showConfig && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <i className={`fas fa-${isConfigured ? 'check-circle text-green-600' : 'exclamation-circle text-amber-600'}`}></i>
            <span className="text-sm font-medium text-gray-700">
              Google Forms Integration: {isConfigured ? 'Configured' : 'Not Configured'}
            </span>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isConfigured ? 'Update' : 'Configure'}
          </button>
        </div>
      )}

      {showConfig && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Configure Google Forms Integration</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  Google Form URL
                  <span className="ml-2 text-xs text-gray-500">(The shareable link to your form)</span>
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://docs.google.com/forms/d/e/..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">How to get entry IDs:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Open your Google Form</li>
                  <li>Click the three dots menu → "Get pre-filled link"</li>
                  <li>Fill out the form with test data</li>
                  <li>Copy the generated link</li>
                  <li>The entry IDs are in the URL (e.g., entry.1234567890=value)</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveConfig}
                  disabled={!formUrl}
                  className="btn-primary"
                >
                  Save Configuration
                </button>
                <button
                  onClick={() => setShowConfig(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleFormsConfig;
