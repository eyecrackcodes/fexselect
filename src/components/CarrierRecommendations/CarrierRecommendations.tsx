import React from 'react';
import { CustomerData } from '../../types';

interface CarrierRecommendation {
  carrier: string;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
  reasons: string[];
  notes?: string;
}

interface CarrierRecommendationsProps {
  customerData: CustomerData;
  onClose: () => void;
}

const CarrierRecommendations: React.FC<CarrierRecommendationsProps> = ({ customerData, onClose }) => {
  const analyzeHealthProfile = (): CarrierRecommendation[] => {
    const recommendations: CarrierRecommendation[] = [];
    
    // Health risk factors
    const hasHeartProblems = customerData.heart_problems === 'Yes';
    const hasStroke = customerData.stroke_history === 'Yes';
    const hasCancer = customerData.cancer_history === 'Yes';
    const hasAidsHivTerminal = customerData.aids_hiv_terminal === 'Yes';
    const hasDiabetes = customerData.diabetes === 'Yes';
    const hasBloodPressure = customerData.blood_pressure === 'Yes';
    const hasEmphysemaCopd = customerData.emphysema_copd === 'Yes';
    const hasAutoimmune = customerData.autoimmune_disorders === 'Yes';
    const hasLiverKidney = customerData.liver_kidney_disease === 'Yes';
    const hasAlcoholDrug = customerData.alcohol_drug_treatment === 'Yes';
    const onDisability = customerData.disability_status === 'Yes';
    const usesMobilityAids = customerData.mobility_aids === 'Yes';
    const hasHomeHealthCare = customerData.home_health_care === 'Yes';
    const usesTobacco = customerData.tobacco_use === 'Yes';
    
    // Age factor
    const age = parseInt(String(customerData.customer_age || '0'));
    
    // Calculate BMI if height and weight are provided
    let bmi = 0;
    if (customerData.height && customerData.weight) {
      const heightInInches = parseHeight(customerData.height.toString());
      const weight = parseInt(customerData.weight.toString());
      if (heightInInches > 0 && weight > 0) {
        bmi = (weight / (heightInInches * heightInInches)) * 703;
      }
    }
    
    // High-risk conditions that may require guaranteed issue
    const highRiskConditions = hasAidsHivTerminal || hasCancer || hasStroke || 
                              (hasDiabetes && customerData.diabetes_complications === 'Yes') ||
                              hasLiverKidney || hasAutoimmune || hasHomeHealthCare;
    
    // Mutual of Omaha - Good for standard health, competitive rates
    if (!highRiskConditions && !hasEmphysemaCopd && age >= 50 && age <= 80) {
      recommendations.push({
        carrier: 'Mutual of Omaha',
        suitability: hasBloodPressure || hasDiabetes ? 'good' : 'excellent',
        reasons: [
          'Competitive rates for standard health',
          'Good underwriting for controlled diabetes',
          'Accepts blood pressure with medication',
          age >= 65 ? 'Senior-friendly underwriting' : 'Good age range coverage'
        ],
        notes: hasBloodPressure ? 'May require stable medication for 12 months' : undefined
      });
    }
    
    // Baltimore Life - Good for mild health issues
    if (!highRiskConditions && age >= 45 && age <= 85) {
      recommendations.push({
        carrier: 'Baltimore Life',
        suitability: (hasBloodPressure || hasDiabetes) && !hasHeartProblems ? 'good' : 'excellent',
        reasons: [
          'Lenient underwriting for mild conditions',
          'Good for controlled diabetes (pills only)',
          'Accepts stable blood pressure',
          'Competitive pricing'
        ],
        notes: hasDiabetes && customerData.diabetes_treatment === 'Insulin' ? 
               'May be challenging for insulin-dependent diabetes' : undefined
      });
    }
    
    // Pioneer American - Good for higher risk cases
    if (age >= 50 && age <= 80) {
      const suitability = highRiskConditions ? 'fair' : 
                         (hasHeartProblems || hasEmphysemaCopd) ? 'good' : 'excellent';
      recommendations.push({
        carrier: 'Pioneer American',
        suitability,
        reasons: [
          'More lenient health questions',
          'Good for heart conditions (stable)',
          'Accepts COPD with treatment',
          'Flexible underwriting'
        ],
        notes: highRiskConditions ? 'May require guaranteed issue product' : undefined
      });
    }
    
    // AIG (American General) - Conservative underwriting
    if (!highRiskConditions && !hasHeartProblems && !hasEmphysemaCopd && age >= 18 && age <= 75) {
      recommendations.push({
        carrier: 'AIG (American General)',
        suitability: (hasBloodPressure || hasDiabetes) ? 'fair' : 'excellent',
        reasons: [
          'Excellent rates for healthy applicants',
          'Strong financial ratings',
          'Good customer service',
          'Competitive term conversion options'
        ],
        notes: (hasBloodPressure || hasDiabetes) ? 'Stricter underwriting for health conditions' : undefined
      });
    }
    
    // Foresters - Good for guaranteed issue needs
    if (highRiskConditions || age >= 75 || onDisability) {
      recommendations.push({
        carrier: 'Foresters',
        suitability: 'good',
        reasons: [
          'Guaranteed issue options available',
          'No medical exam required',
          'Good for high-risk applicants',
          'Member benefits included'
        ],
        notes: 'Graded death benefit for first 2-3 years'
      });
    }
    
    // Liberty Bankers - Competitive for standard risks
    if (!highRiskConditions && age >= 18 && age <= 80) {
      recommendations.push({
        carrier: 'Liberty Bankers',
        suitability: hasBloodPressure || hasDiabetes ? 'good' : 'excellent',
        reasons: [
          'Competitive pricing',
          'Good underwriting flexibility',
          'Fast approval process',
          'Good customer service'
        ]
      });
    }
    
    // Sort by suitability
    const suitabilityOrder = { 'excellent': 4, 'good': 3, 'fair': 2, 'poor': 1 };
    return recommendations.sort((a, b) => suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability]);
  };
  
  const parseHeight = (height: string): number => {
    // Parse height like "5'8" or "5'8\"" or "68"
    const match = height.match(/(\d+)'?\s*(\d+)?/);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = parseInt(match[2] || '0');
      return feet * 12 + inches;
    }
    return parseInt(height) || 0;
  };
  
  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return 'text-green-700 bg-green-100';
      case 'good': return 'text-blue-700 bg-blue-100';
      case 'fair': return 'text-yellow-700 bg-yellow-100';
      case 'poor': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };
  
  const recommendations = analyzeHealthProfile();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Carrier Recommendations</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Available</h3>
              <p className="text-gray-600">Complete the medical questions to see carrier recommendations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Based on Health Profile Analysis
                </h3>
                <p className="text-gray-600">
                  These recommendations are based on the customer's age, health conditions, and typical carrier underwriting guidelines.
                </p>
              </div>
              
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{rec.carrier}</h4>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSuitabilityColor(rec.suitability)}`}>
                        {rec.suitability.charAt(0).toUpperCase() + rec.suitability.slice(1)} Match
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Recommendation #{index + 1}</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Why this carrier:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {rec.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {rec.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <div className="flex">
                        <svg className="w-4 h-4 text-yellow-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Important Note:</p>
                          <p className="text-sm text-yellow-700">{rec.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Recommendations based on typical underwriting guidelines
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierRecommendations;
