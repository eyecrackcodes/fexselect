import React from 'react';
import { CustomerData } from '../../types';

interface AdditionalInfoProps {
  customerData: CustomerData;
  onDataChange: (fieldId: string, value: any) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ customerData, onDataChange }) => {
  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Additional Information</h1>
        <p className="text-gray-600 mt-2">Complete additional details for the application</p>
      </div>

      {/* Beneficiary Information */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-user-friends"></i>
            Beneficiary Information
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Primary Beneficiary Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Full name"
                value={customerData.primary_beneficiary || ''}
                onChange={(e) => onDataChange('primary_beneficiary', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Relationship</label>
              <select
                className="form-input"
                value={customerData.primary_beneficiary_relationship || ''}
                onChange={(e) => onDataChange('primary_beneficiary_relationship', e.target.value)}
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other Relative">Other Relative</option>
                <option value="Friend">Friend</option>
                <option value="Trust">Trust</option>
                <option value="Estate">Estate</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contingent Beneficiary Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Full name (optional)"
                value={customerData.contingent_beneficiary || ''}
                onChange={(e) => onDataChange('contingent_beneficiary', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Relationship</label>
              <select
                className="form-input"
                value={customerData.contingent_beneficiary_relationship || ''}
                onChange={(e) => onDataChange('contingent_beneficiary_relationship', e.target.value)}
                disabled={!customerData.contingent_beneficiary}
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other Relative">Other Relative</option>
                <option value="Friend">Friend</option>
                <option value="Trust">Trust</option>
                <option value="Estate">Estate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Banking Information */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-credit-card"></i>
            Banking Information
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Name of Bank</label>
              <input
                type="text"
                className="form-input"
                placeholder="Bank name"
                value={customerData.name_of_bank || ''}
                onChange={(e) => onDataChange('name_of_bank', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Name as Appears on Account</label>
              <input
                type="text"
                className="form-input"
                placeholder="Account holder name"
                value={customerData.name_on_account || ''}
                onChange={(e) => onDataChange('name_on_account', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Routing Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="9 digits"
                maxLength={9}
                value={customerData.routing_number || ''}
                onChange={(e) => onDataChange('routing_number', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="Account number"
                value={customerData.account_number || ''}
                onChange={(e) => onDataChange('account_number', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                className="form-input"
                value={customerData.account_type || ''}
                onChange={(e) => onDataChange('account_type', e.target.value)}
              >
                <option value="">Select account type</option>
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Draft Date</label>
              <select
                className="form-input"
                value={customerData.draft_date || ''}
                onChange={(e) => onDataChange('draft_date', e.target.value)}
              >
                <option value="">Select draft date</option>
                <option value="1st">1st of the month</option>
                <option value="3rd">3rd of the month</option>
                <option value="5th">5th of the month</option>
                <option value="10th">10th of the month</option>
                <option value="15th">15th of the month</option>
                <option value="20th">20th of the month</option>
                <option value="25th">25th of the month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Contact Information */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-address-book"></i>
            Additional Contact Information
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group md:col-span-2">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="123 Main St"
                value={customerData.address || ''}
                onChange={(e) => onDataChange('address', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Phone</label>
              <input
                type="tel"
                className="form-input"
                placeholder="(555) 123-4567"
                value={customerData.alternate_phone || ''}
                onChange={(e) => onDataChange('alternate_phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={customerData.email || ''}
                onChange={(e) => onDataChange('email', e.target.value)}
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Primary Doctor</label>
              <input
                type="text"
                className="form-input"
                placeholder="Dr. Smith"
                value={customerData.primary_doctor || ''}
                onChange={(e) => onDataChange('primary_doctor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quote Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-dollar-sign"></i>
            Quote Information
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Selected Carrier</label>
              <input
                type="text"
                className="form-input"
                placeholder="Carrier name"
                value={customerData.selected_carrier || ''}
                onChange={(e) => onDataChange('selected_carrier', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Selected Plan</label>
              <input
                type="text"
                className="form-input"
                placeholder="Plan name"
                value={customerData.selected_plan || ''}
                onChange={(e) => onDataChange('selected_plan', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Premium</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                value={customerData.monthly_premium || ''}
                onChange={(e) => onDataChange('monthly_premium', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
