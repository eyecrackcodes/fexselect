import React, { useState } from 'react';
import { ScriptSection, CustomerData, ScriptContent } from '../../types';
import FormInput from '../FormInput/FormInput';
import CarrierRecommendations from '../CarrierRecommendations/CarrierRecommendations';

interface ScriptDisplayProps {
  section: ScriptSection;
  customerData: CustomerData;
  onDataChange: (fieldId: string, value: any) => void;
  agentName?: string;
  agentNpn?: string;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({
  section,
  customerData,
  onDataChange,
  agentName,
  agentNpn
}) => {
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const [showCarrierRecommendations, setShowCarrierRecommendations] = useState(false);

  const toggleBranch = (fieldId: string) => {
    const newExpanded = new Set(expandedBranches);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedBranches(newExpanded);
  };

  // Function to replace placeholders in script text
  const replacePlaceholders = (text: string | undefined): string => {
    if (!text) return '';
    
    let processedText = text;
    
    // Replace agent name placeholders
    if (agentName) {
      const firstName = agentName.split(' ')[0];
      processedText = processedText
        .replace(/\[agent full name\]/gi, agentName)
        .replace(/\(agent's first name\)/gi, firstName)
        .replace(/\(agent first name\)/gi, firstName);
    }
    
    // Replace customer name placeholders with actual data
    const customerFirstName = customerData.customer_first_name || '[Customer First Name]';
    const customerLastName = customerData.customer_last_name || '[Customer Last Name]';
    const customerState = customerData.customer_state || '[STATE]';
    const customerPhone = customerData.customer_phone || '[Phone Number]';
    // Use agent's NPN from profile instead of customer data
    const producerNumber = agentNpn || '[Producer Number]';
    
    processedText = processedText
      .replace(/\(customer's first name\)/gi, customerFirstName)
      .replace(/\(customer first name\)/gi, customerFirstName)
      .replace(/\(Client\)/gi, customerFirstName)
      .replace(/\(CLIENT\)/gi, customerFirstName)
      .replace(/\(Mr\. \/ Ms\. Customer's Last name\)/gi, `${customerLastName ? 'Mr./Ms. ' + customerLastName : '[Customer Last Name]'}`)
      .replace(/\(Mr\. \/ Ms\. ______\)/gi, `${customerLastName ? 'Mr./Ms. ' + customerLastName : 'Mr./Ms. [Customer Last Name]'}`)
      .replace(/Mr\. \/ Ms\. ______/gi, `${customerLastName ? 'Mr./Ms. ' + customerLastName : 'Mr./Ms. [Customer Last Name]'}`)
      .replace(/\[STATE\]/gi, customerState)
      .replace(/______/g, (match, offset) => {
        // Context-aware replacement for blanks
        const beforeText = processedText.substring(Math.max(0, offset - 50), offset).toLowerCase();
        if (beforeText.includes('producer number') || beforeText.includes('npn')) {
          return producerNumber;
        }
        if (beforeText.includes('telephone') || beforeText.includes('phone')) {
          return customerPhone;
        }
        return match; // Keep original if we can't determine context
      });
    
    return processedText;
  };

  const renderContent = (content: ScriptContent[], level: number = 0) => {
    return content.map((item, index) => {
      const key = `${level}-${index}`;
      
      switch (item.type) {
        case 'agent_line':
          return (
            <div key={key} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                <p className="font-semibold text-blue-900 leading-relaxed">
                  {replacePlaceholders(item.text)}
                </p>
              </div>
            </div>
          );

        case 'instruction':
          return (
            <div key={key} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                <p className="font-medium text-red-800 text-sm">
                  {replacePlaceholders(item.text)}
                </p>
              </div>
            </div>
          );

        case 'input_field':
          if (!item.id) return null;
          
          const fieldValue = customerData[item.id as keyof CustomerData];
          const hasBranching = item.branching && fieldValue && item.branching[fieldValue as string];
          
          return (
            <div key={key} className={`mb-6 ${level > 0 ? 'ml-6' : ''}`}>
              <FormInput
                id={item.id}
                label={item.label || ''}
                type={item.inputType || 'text'}
                placeholder={item.placeholder}
                required={item.required}
                options={item.options}
                value={fieldValue}
                onChange={(value) => onDataChange(item.id!, value)}
                className="mb-2"
              />
              
              {/* Branching Logic */}
              {hasBranching && (
                <div className="mt-4">
                  <button
                    onClick={() => toggleBranch(item.id!)}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium mb-2"
                  >
                    {expandedBranches.has(item.id!) ? '▼' : '▶'} Follow-up Questions
                  </button>
                  
                  {expandedBranches.has(item.id!) && (
                    <div className="border-l-2 border-gray-200 pl-4 ml-2">
                      {renderContent(item.branching![fieldValue as string], level + 1)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );

        case 'customer_response':
          return (
            <div key={key} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
                <p className="italic text-green-800">
                  Customer Response: {replacePlaceholders(item.text)}
                </p>
              </div>
            </div>
          );

        default:
          return null;
      }
    });
  };

  // Auto-expand branches based on current data
  React.useEffect(() => {
    const newExpanded = new Set<string>();
    
    const checkForBranching = (content: ScriptContent[]) => {
      content.forEach(item => {
        if (item.type === 'input_field' && item.id && item.branching) {
          const fieldValue = customerData[item.id as keyof CustomerData];
          if (fieldValue && item.branching[fieldValue as string]) {
            newExpanded.add(item.id);
            // Recursively check nested content
            checkForBranching(item.branching[fieldValue as string]);
          }
        }
      });
    };
    
    checkForBranching(section.content);
    setExpandedBranches(newExpanded);
  }, [section.content, customerData]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {section.title}
        </h1>
        <div className="h-1 w-20 bg-primary-600 rounded"></div>
      </div>

      {/* Section Content */}
      <div className="space-y-2">
        {renderContent(section.content)}
      </div>

      {/* Section Completion Indicator */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Section Progress
          </div>
          <div className="flex items-center space-x-2">
            {section.content
              .filter(item => item.type === 'input_field' && item.required)
              .map(item => {
                const isCompleted = customerData[item.id! as keyof CustomerData];
                return (
                  <div
                    key={item.id}
                    className={`w-3 h-3 rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={`${item.label}: ${isCompleted ? 'Completed' : 'Required'}`}
                  />
                );
              })}
          </div>
        </div>
      </div>

      {/* Carrier Recommendations Button - Show only for medical questions section */}
      {section.id === 'medical_questions' && customerData.customer_age && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Get Carrier Recommendations
              </h3>
              <p className="text-sm text-gray-600">
                Based on the health information provided, see which carriers are the best fit for this customer.
              </p>
            </div>
            <button
              onClick={() => setShowCarrierRecommendations(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>View Recommendations</span>
            </button>
          </div>
        </div>
      )}

      {/* Carrier Recommendations Modal */}
      {showCarrierRecommendations && (
        <CarrierRecommendations
          customerData={customerData}
          onClose={() => setShowCarrierRecommendations(false)}
        />
      )}
    </div>
  );
};

export default ScriptDisplay;
