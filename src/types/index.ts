// Script and Content Types
export interface ScriptContent {
  type: 'agent_line' | 'instruction' | 'input_field' | 'customer_response';
  text?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  inputType?: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea';
  options?: string[];
  branching?: Record<string, ScriptContent[]>;
}

export interface ScriptSection {
  id: string;
  title: string;
  order: number;
  content: ScriptContent[];
}

export interface ScriptData {
  sections: ScriptSection[];
}

// Customer Data Types
export interface CustomerData {
  // Personal Information
  customer_first_name?: string;
  customer_last_name?: string;
  customer_phone?: string;
  customer_state?: string;
  customer_city?: string;
  customer_age?: number;
  customer_dob?: string;
  
  // Agent Information
  agent_producer_number?: string;
  
  // Rapport Building
  marital_status?: string;
  has_children?: string;
  retirement_status?: string;
  previous_occupation?: string;
  current_occupation?: string;
  hobbies_interests?: string;
  
  // Qualifying Information
  main_concern?: string;
  paid_for_funeral?: string;
  funeral_experience?: string;
  protection_for?: string;
  
  // Medical Information
  tobacco_use?: string;
  height?: string;
  weight?: number;
  heart_problems?: string;
  stroke_history?: string;
  cancer_history?: string;
  aids_hiv_terminal?: string;
  diabetes?: string;
  diabetes_treatment?: string;
  diabetes_medication_changed?: string;
  ever_used_insulin?: string;
  insulin_before_50?: string;
  diabetes_complications?: string;
  diabetes_complication_types?: string[];
  blood_pressure?: string;
  blood_pressure_medication_changed?: string;
  emphysema_copd?: string;
  inhalers_nebulizer_oxygen?: string;
  autoimmune_disorders?: string;
  liver_kidney_disease?: string;
  alcohol_drug_treatment?: string;
  disability_status?: string;
  disability_reason?: string;
  mobility_aids?: string;
  home_health_care?: string;
  other_health_problems?: string;
  medications?: string[];
  
  // Banking Information
  account_type?: string;
  draft_date?: string;
  
  // Beneficiary Information
  primary_beneficiary?: string;
  primary_beneficiary_relationship?: string;
  contingent_beneficiary?: string;
  contingent_beneficiary_relationship?: string;
  
  // Contact Information
  address?: string;
  alternate_phone?: string;
  email?: string;
  primary_doctor?: string;
  
  // Quote Information
  selected_plan?: string;
  coverage_amount?: number;
  monthly_premium?: number;
  selected_carrier?: string;
}

// Carrier Types
export interface CoverageTypes {
  immediate: boolean;
  graded: boolean;
  return_of_premium: boolean;
}

export interface GradedDetails {
  year1: string;
  year2: string;
  year3_plus: string;
  accidental: string;
}

export interface Carrier {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: string;
  ratingAgency: string;
  yearsInBusiness: number;
  founded: number;
  assets?: string;
  customers?: string;
  members?: string;
  specialties: string[];
  coverage_types: CoverageTypes;
  graded_details?: GradedDetails;
  return_of_premium_details?: string;
}

export interface CarrierData {
  carriers: Carrier[];
}

// Application State Types
export interface AppState {
  currentSection: number;
  customerData: CustomerData;
  completedSections: string[];
  isCallActive: boolean;
  callStartTime?: Date;
  selectedCarrier?: Carrier;
  quotes?: QuoteOption[];
}

export interface QuoteOption {
  coverage_amount: number;
  monthly_premium: number;
  daily_cost: number;
  carrier: string;
  plan_type: 'immediate' | 'graded' | 'return_of_premium';
}

// Form Input Types
export interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value?: any;
  onChange: (value: any) => void;
  className?: string;
}

// Navigation Types
export interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToSection: (sectionIndex: number) => void;
  canProceed: boolean;
}

// Google Forms Integration Types
export interface GoogleFormConfig {
  formUrl: string;
  fieldMappings: Record<string, string>;
}

export interface GoogleFormSubmission {
  success: boolean;
  error?: string;
  submissionId?: string;
}

// Compliance Types
export interface ComplianceReminder {
  id: string;
  type: 'recording_consent' | 'licensing' | 'state_specific';
  message: string;
  required: boolean;
  completed: boolean;
}

// Call Management Types
export interface CallSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  customerData: CustomerData;
  completedSections: string[];
  notes: string;
  outcome?: 'completed' | 'incomplete' | 'no_sale' | 'callback';
}
