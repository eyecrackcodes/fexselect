import React, { useState, useEffect } from 'react';
import { CustomerData, QuoteOption, Carrier } from '../../types';

interface QuoteCalculatorProps {
  customerData: CustomerData;
  carriers: Carrier[];
  onQuoteSelected: (quote: QuoteOption) => void;
}

const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  customerData,
  carriers,
  onQuoteSelected
}) => {
  const [quotes, setQuotes] = useState<QuoteOption[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteOption | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate quotes based on customer data
  const calculateQuotes = () => {
    setLoading(true);
    
    // Simulate quote calculation based on age, health, and other factors
    const age = customerData.customer_age || 65;
    const hasHealthIssues = checkHealthIssues();
    const baseRate = getBaseRate(age);
    
    // Generate three quote options (low, medium, high coverage)
    const quoteOptions: QuoteOption[] = [
      {
        coverage_amount: 6000,
        monthly_premium: calculatePremium(6000, baseRate, hasHealthIssues),
        daily_cost: 0,
        carrier: selectBestCarrier(hasHealthIssues),
        plan_type: hasHealthIssues ? 'graded' : 'immediate'
      },
      {
        coverage_amount: 8000,
        monthly_premium: calculatePremium(8000, baseRate, hasHealthIssues),
        daily_cost: 0,
        carrier: selectBestCarrier(hasHealthIssues),
        plan_type: hasHealthIssues ? 'graded' : 'immediate'
      },
      {
        coverage_amount: 10000,
        monthly_premium: calculatePremium(10000, baseRate, hasHealthIssues),
        daily_cost: 0,
        carrier: selectBestCarrier(hasHealthIssues),
        plan_type: hasHealthIssues ? 'graded' : 'immediate'
      }
    ];

    // Calculate daily costs
    quoteOptions.forEach(quote => {
      quote.daily_cost = Math.round((quote.monthly_premium / 30) * 100) / 100;
    });

    setQuotes(quoteOptions);
    setLoading(false);
  };

  // Check if customer has health issues
  const checkHealthIssues = (): boolean => {
    const healthFields = [
      'heart_problems', 'stroke_history', 'cancer_history', 'diabetes',
      'emphysema_copd', 'liver_kidney_disease'
    ];
    
    return healthFields.some(field => 
      customerData[field as keyof CustomerData] === 'Yes'
    );
  };

  // Get base rate based on age
  const getBaseRate = (age: number): number => {
    if (age < 50) return 0.8;
    if (age < 60) return 1.0;
    if (age < 70) return 1.3;
    if (age < 80) return 1.8;
    return 2.5;
  };

  // Calculate premium based on coverage amount and risk factors
  const calculatePremium = (coverage: number, baseRate: number, hasHealthIssues: boolean): number => {
    let premium = (coverage / 1000) * baseRate * 8; // Base calculation
    
    // Adjust for health issues
    if (hasHealthIssues) {
      premium *= 1.4; // 40% increase for health issues
    }
    
    // Adjust for tobacco use
    if (customerData.tobacco_use === 'Yes') {
      premium *= 1.5; // 50% increase for tobacco
    }
    
    // Round to nearest dollar
    return Math.round(premium);
  };

  // Select best carrier based on health profile
  const selectBestCarrier = (hasHealthIssues: boolean): string => {
    if (hasHealthIssues) {
      // Prefer carriers that offer graded benefits
      const gradedCarriers = carriers.filter(c => c.coverage_types.graded);
      return gradedCarriers.length > 0 ? gradedCarriers[0].name : carriers[0].name;
    } else {
      // Prefer carriers with immediate benefits and good ratings
      const immediateCarriers = carriers.filter(c => c.coverage_types.immediate);
      return immediateCarriers.length > 0 ? immediateCarriers[0].name : carriers[0].name;
    }
  };

  // Handle quote selection
  const handleQuoteSelection = (quote: QuoteOption) => {
    setSelectedQuote(quote);
    onQuoteSelected(quote);
  };

  // Auto-calculate quotes when customer data changes
  useEffect(() => {
    if (customerData.customer_age && customerData.tobacco_use) {
      calculateQuotes();
    }
  }, [customerData.customer_age, customerData.tobacco_use, customerData.heart_problems, customerData.diabetes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your personalized quotes...</p>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Quotes</h3>
          <p className="text-gray-600 mb-4">
            Complete the age and tobacco use questions to see personalized quotes.
          </p>
          <button
            onClick={calculateQuotes}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Calculate Quotes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quote Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Quotes</h2>
        <p className="text-gray-600">
          Based on your age ({customerData.customer_age}) and health information
        </p>
      </div>

      {/* Quote Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quotes.map((quote, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedQuote === quote
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleQuoteSelection(quote)}
          >
            {/* Coverage Amount */}
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">
                ${quote.coverage_amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Coverage Amount</div>
            </div>

            {/* Premium */}
            <div className="text-center mb-4">
              <div className="text-2xl font-semibold text-primary-600">
                ${quote.monthly_premium}/month
              </div>
              <div className="text-sm text-gray-500">
                About ${quote.daily_cost}/day
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Carrier:</span>
                <span className="font-medium">{quote.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Type:</span>
                <span className="font-medium capitalize">
                  {quote.plan_type.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedQuote === quote && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Plan Type Explanations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Type Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Immediate Benefit</h4>
            <p className="text-gray-600">
              Full coverage from day one. Best for those in good health.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Graded Benefit</h4>
            <p className="text-gray-600">
              Partial coverage in years 1-2, full coverage after 2 years. 
              100% coverage for accidental death from day one.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {selectedQuote && (
        <div className="text-center space-x-4">
          <button
            onClick={() => calculateQuotes()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Recalculate Quotes
          </button>
          <button
            onClick={() => {
              // This would typically proceed to the application section
              console.log('Proceeding with selected quote:', selectedQuote);
            }}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Proceed with Selected Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteCalculator;
