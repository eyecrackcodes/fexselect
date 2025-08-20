import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LeadProvider, useLead } from './contexts/LeadContext';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ScriptDisplay from './components/ScriptDisplay/ScriptDisplay';
import QuoteCalculator from './components/QuoteCalculator/QuoteCalculator';
import CarrierReference from './components/CarrierReference/CarrierReference';
import CustomerDataSummary from './components/CustomerDataSummary/CustomerDataSummary';
import AgentProfile from './components/AgentProfile/AgentProfile';
import LeadManagement from './components/LeadManagement/LeadManagement';
import scriptData from './data/script-sections.json';
import carrierData from './data/carriers.json';
import { ScriptData, Carrier } from './types';

const AuthenticatedApp: React.FC = () => {
  const { user, agent, loading, profileLoading, error, clearError, retryAuth } = useAuth();
  const { currentLead } = useLead();
  const [activeTab, setActiveTab] = useState('leads');
  const [customerData, setCustomerData] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const sections = (scriptData as ScriptData).sections;
  const carriers = (carrierData as { carriers: Carrier[] }).carriers;

  // Check if current section's required fields are completed
  const isCurrentSectionComplete = () => {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return false;
    
    const requiredFields = currentSection.content
      .filter(item => item.type === 'input_field' && item.required)
      .map(item => item.id)
      .filter(Boolean);
    
    return requiredFields.every(fieldId => {
      const value = customerData[fieldId as keyof typeof customerData];
      return value !== undefined && value !== null && value !== '';
    });
  };


  // Show loading screen with better UX
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            {loading ? 'Initializing Application...' : 'Loading Profile...'}
          </h2>
          <p className="mt-2 text-gray-600">
            {loading 
              ? 'Please wait while we set up your workspace.' 
              : 'Fetching your agent profile and settings.'
            }
          </p>
          
          {/* Show error state with retry option */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={retryAuth}
                  className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={clearError}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: loading ? '30%' : '70%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthFlow />;
  }

  // Show profile setup if agent profile is incomplete
  if (!agent || !agent.name || !agent.npn_number) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-yellow-800">Complete Your Profile</h3>
            <p className="text-yellow-700 mt-1">
              Please complete your agent profile to access the application.
            </p>
          </div>
          <AgentProfile />
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'leads':
        return <LeadManagement />;
      case 'script':
        return (
          <div className="space-y-6">
            {/* Section Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Script Navigation
                </h2>
                <div className="text-sm text-gray-500">
                  Section {currentSectionIndex + 1} of {sections.length}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                  disabled={currentSectionIndex === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentSectionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Previous Section
                </button>
                
                <div className="flex space-x-2">
                  {sections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSectionIndex(index)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                        index === currentSectionIndex
                          ? 'bg-primary-600 text-white'
                          : index < currentSectionIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentSectionIndex(Math.min(sections.length - 1, currentSectionIndex + 1))}
                  disabled={currentSectionIndex === sections.length - 1 || !isCurrentSectionComplete()}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentSectionIndex === sections.length - 1 || !isCurrentSectionComplete()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Next Section →
                </button>
              </div>
            </div>
            
            {/* Current Script Section */}
            <ScriptDisplay
              section={sections[currentSectionIndex]}
              customerData={customerData}
              onDataChange={(fieldId: string, value: any) => {
                setCustomerData(prev => ({ ...prev, [fieldId]: value }));
              }}
              agentName={agent?.name || ''}
              agentNpn={agent?.npn_number || ''}
            />
          </div>
        );
      case 'calculator':
        return (
          <QuoteCalculator
            customerData={customerData}
            carriers={carriers}
            onQuoteSelected={(quote: any) => {
              console.log('Quote selected:', quote);
            }}
          />
        );
      case 'carriers':
        return (
          <CarrierReference
            carriers={carriers}
            onClose={() => {}}
          />
        );
      case 'summary':
        return <CustomerDataSummary />;
      case 'profile':
        return <AgentProfile />;
      default:
        return <LeadManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">FEX Select</h1>
              <span className="text-sm text-gray-500">
                Welcome, {agent.name}
              </span>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'leads'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'script'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Script
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'calculator'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setActiveTab('carriers')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'carriers'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Carriers
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'summary'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

const AuthFlow: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login onToggleMode={() => setIsLogin(false)} />
  ) : (
    <SignUp onToggleMode={() => setIsLogin(true)} />
  );
};

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <AuthenticatedApp />
      </LeadProvider>
    </AuthProvider>
  );
}

export default App;
