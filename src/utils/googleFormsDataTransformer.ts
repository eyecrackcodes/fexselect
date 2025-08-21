import { CustomerData } from '../types';

/**
 * Transforms customer data from our application format to Google Forms format
 */
export const transformDataForGoogleForm = (customerData: CustomerData): Record<string, string> => {
  // Helper function to format Yes/No values
  const formatYesNo = (value?: string): string => {
    if (!value) return 'N';
    return value.toLowerCase() === 'yes' ? 'Y' : 'N';
  };

  // Helper function to collect "Yes" health questions
  const collectYesQuestions = (): string => {
    const yesQuestions: string[] = [];
    
    if (customerData.tobacco_use === 'yes') yesQuestions.push('Q1: Tobacco Use');
    if (customerData.heart_problems === 'yes') yesQuestions.push('Q2: Heart Problems');
    if (customerData.stroke_history === 'yes') yesQuestions.push('Q3: Stroke');
    if (customerData.cancer_history === 'yes') yesQuestions.push('Q4: Cancer');
    if (customerData.aids_hiv_terminal === 'yes') yesQuestions.push('Q5: AIDS/HIV/Terminal');
    if (customerData.diabetes === 'yes') yesQuestions.push('Q6: Diabetes');
    if (customerData.blood_pressure === 'yes') yesQuestions.push('Q7: High Blood Pressure');
    if (customerData.emphysema_copd === 'yes') yesQuestions.push('Q8: Emphysema/COPD');
    if (customerData.autoimmune_disorders === 'yes') yesQuestions.push('Q9: Autoimmune Disorders');
    if (customerData.liver_kidney_disease === 'yes') yesQuestions.push('Q10: Liver/Kidney Disease');
    if (customerData.alcohol_drug_treatment === 'yes') yesQuestions.push('Q11: Alcohol/Drug Treatment');
    if (customerData.disability_status === 'yes') yesQuestions.push('Q12: Disability');
    if (customerData.mobility_aids === 'yes') yesQuestions.push('Q13: Mobility Aids');
    if (customerData.home_health_care === 'yes') yesQuestions.push('Q14: Home Health Care');
    
    return yesQuestions.join(', ') || 'None';
  };

  // Helper function to summarize health conditions
  const summarizeHealth = (): string => {
    const conditions: string[] = [];
    
    if (customerData.heart_problems === 'yes') conditions.push('Heart');
    if (customerData.stroke_history === 'yes') conditions.push('Stroke');
    if (customerData.cancer_history === 'yes') conditions.push('Cancer');
    if (customerData.diabetes === 'yes') conditions.push('Diabetes');
    if (customerData.blood_pressure === 'yes') conditions.push('HBP');
    if (customerData.emphysema_copd === 'yes') conditions.push('COPD');
    if (customerData.autoimmune_disorders === 'yes') conditions.push('Autoimmune');
    if (customerData.liver_kidney_disease === 'yes') conditions.push('Liver/Kidney');
    if (customerData.disability_status === 'yes') conditions.push('Disability');
    
    return conditions.length > 0 ? conditions.join(', ') : 'No major conditions';
  };

  // Transform the data
  const transformedData: Record<string, string> = {
    // Reference and Company Info
    reference_id: `REF-${Date.now()}`, // Generate a unique reference ID
    company_name: 'Final Expense Select',
    plan_type: customerData.selected_plan || 'TBD',
    rop_yes_questions: collectYesQuestions(),
    
    // Insured Information
    insured_name: `${customerData.customer_first_name || ''} ${customerData.customer_last_name || ''}`.trim(),
    address: customerData.address || '',
    city: customerData.customer_city || '',
    state: customerData.customer_state || '',
    zip_code: '', // Not collected in our form
    telephone_number: customerData.customer_phone || '',
    email_address: customerData.email || '',
    gender: '', // Not collected in our form
    dob: customerData.customer_dob || '',
    age: customerData.customer_age?.toString() || '',
    state_of_birth: '', // Not collected in our form
    ss_number: '', // Not collected in our form
    height: customerData.height || '',
    weight: customerData.weight?.toString() || '',
    
    // Owner/Payor Information (typically same as insured)
    owner_if_other: '',
    owner_ss: '',
    payor_if_other: '',
    payor_ss: '',
    payor_dob: '',
    
    // Beneficiary Information
    primary_beneficiary: customerData.primary_beneficiary || '',
    contingent_beneficiary: customerData.contingent_beneficiary || '',
    
    // Policy Information
    face_amount: customerData.coverage_amount?.toString() || customerData.selected_plan || '',
    riders: '', // Not collected in our form
    monthly_premium: customerData.monthly_premium?.toString() || '',
    tobacco_y_or_n: formatYesNo(customerData.tobacco_use),
    
    // Additional Information
    physician_name: customerData.primary_doctor || '',
    name_of_bank: '', // Not collected in our form
    name_as_appears_on_account: `${customerData.customer_first_name || ''} ${customerData.customer_last_name || ''}`.trim(),
    routing: '', // Not collected in our form
    account: '', // Not collected in our form
    account_type: customerData.account_type || '',
    draft_day: customerData.draft_date || '',
    
    // Summary Fields
    summary_state: customerData.customer_state || '',
    summary_age: customerData.customer_age?.toString() || '',
    summary_dob: customerData.customer_dob || '',
    summary_tobacco: formatYesNo(customerData.tobacco_use),
    summary_ht_wt: `${customerData.height || ''} / ${customerData.weight || ''}`,
    summary_health: summarizeHealth(),
    summary_meds: typeof customerData.medications === 'string' 
      ? customerData.medications 
      : (customerData.medications?.join(', ') || 'None'),
    summary_current: customerData.current_occupation || '',
    summary_concern: customerData.main_concern || ''
  };

  return transformedData;
};
