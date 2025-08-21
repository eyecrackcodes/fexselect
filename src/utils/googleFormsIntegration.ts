import { CustomerData, GoogleFormSubmission } from '../types';
import { transformDataForGoogleForm } from './googleFormsDataTransformer';

// Google Forms integration utility
export class GoogleFormsIntegration {
  private formUrl: string;
  private fieldMappings: Record<string, string>;

  constructor(formUrl: string = '', fieldMappings: Record<string, string> = {}) {
    this.formUrl = formUrl;
    this.fieldMappings = fieldMappings;
  }

  // Update form configuration
  updateConfig(formUrl: string, fieldMappings: Record<string, string>) {
    this.formUrl = formUrl;
    this.fieldMappings = fieldMappings;
  }

  // Generate pre-filled Google Form URL
  generatePrefilledUrl(customerData: CustomerData): string {
    if (!this.formUrl) {
      throw new Error('Google Form URL not configured');
    }

    const url = new URL(this.formUrl);
    
    // Transform the data to match Google Form fields
    const transformedData = transformDataForGoogleForm(customerData);
    
    // Add pre-filled parameters based on field mappings
    Object.entries(this.fieldMappings).forEach(([fieldId, formFieldId]) => {
      const value = transformedData[fieldId];
      if (value !== undefined && value !== null && value !== '') {
        // Google Forms uses entry.XXXXXX format for pre-filled fields
        url.searchParams.set(`entry.${formFieldId}`, value);
      }
    });

    return url.toString();
  }

  // Submit data to Google Form (opens in browser)
  async submitToForm(customerData: CustomerData): Promise<GoogleFormSubmission> {
    try {
      const prefilledUrl = this.generatePrefilledUrl(customerData);
      
      // Open the pre-filled form in the default browser
      if (window.require) {
        // Electron environment
        const { shell } = window.require('electron');
        await shell.openExternal(prefilledUrl);
      } else {
        // Web browser environment
        window.open(prefilledUrl, '_blank');
      }

      return {
        success: true,
        submissionId: `form_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Export customer data as JSON for manual form filling
  exportAsJson(customerData: CustomerData): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      customerData: customerData,
      formUrl: this.formUrl,
      fieldMappings: this.fieldMappings
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Create a downloadable JSON file
  downloadAsJson(customerData: CustomerData, filename?: string): void {
    const jsonData = this.exportAsJson(customerData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `customer_data_${customerData.customer_last_name || 'unknown'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Validate that all required fields are present
  validateRequiredFields(customerData: CustomerData, requiredFields: string[]): { isValid: boolean; missingFields: string[] } {
    const missingFields = requiredFields.filter(field => {
      const value = customerData[field as keyof CustomerData];
      return value === undefined || value === null || value === '';
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  // Get form configuration status
  getConfigStatus(): { configured: boolean; hasUrl: boolean; hasMappings: boolean } {
    return {
      configured: Boolean(this.formUrl && Object.keys(this.fieldMappings).length > 0),
      hasUrl: Boolean(this.formUrl),
      hasMappings: Object.keys(this.fieldMappings).length > 0
    };
  }
}

// Default field mappings for common Google Form fields
export const defaultFieldMappings = {
  // Personal Information
  customer_first_name: '123456789', // Replace with actual Google Form entry IDs
  customer_last_name: '987654321',
  customer_phone: '111111111',
  customer_email: '222222222',
  customer_age: '333333333',
  customer_dob: '444444444',
  
  // Medical Information
  tobacco_use: '555555555',
  height: '666666666',
  weight: '777777777',
  heart_problems: '888888888',
  diabetes: '999999999',
  
  // Coverage Information
  coverage_amount: '101010101',
  monthly_premium: '121212121',
  selected_carrier: '131313131'
};

// Create a singleton instance
export const googleFormsIntegration = new GoogleFormsIntegration();

// Helper function to configure Google Forms integration
export const configureGoogleForms = (formUrl: string, fieldMappings?: Record<string, string>) => {
  googleFormsIntegration.updateConfig(formUrl, fieldMappings || defaultFieldMappings);
};

// Helper function to submit customer data after medical questions
export const submitMedicalData = async (customerData: CustomerData): Promise<GoogleFormSubmission> => {
  // Validate that medical questions are completed
  const medicalFields = [
    'tobacco_use', 'height', 'weight', 'heart_problems', 'stroke_history',
    'cancer_history', 'aids_hiv_terminal', 'diabetes'
  ];
  
  const validation = googleFormsIntegration.validateRequiredFields(customerData, medicalFields);
  
  if (!validation.isValid) {
    return {
      success: false,
      error: `Missing required medical information: ${validation.missingFields.join(', ')}`
    };
  }

  return await googleFormsIntegration.submitToForm(customerData);
};
