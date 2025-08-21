import React, { useState } from 'react';
import './App.css';
import './styles/enhanced-ui.css';
import { ClerkProvider, UserButton, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './contexts/ClerkAuthContext';
import { LeadProvider } from './contexts/LeadContext';
import ScriptDisplay from './components/ScriptDisplay/ScriptDisplay';
import QuoteCalculator from './components/QuoteCalculator/QuoteCalculator';
import CarrierReference from './components/CarrierReference/CarrierReference';
import CarrierReferenceFull from './components/CarrierReference/CarrierReferenceFull';
import CustomerDataSummary from './components/CustomerDataSummary/CustomerDataSummary';
import AgentProfile from './components/AgentProfile/AgentProfile';
import LeadManagement from './components/LeadManagement/LeadManagement';
import AdditionalInfo from './components/AdditionalInfo/AdditionalInfo';
import GoogleFormsConfig from './components/GoogleFormsConfig/GoogleFormsConfig';
import { submitMedicalData } from './utils/googleFormsIntegration';
import scriptData from './data/script-sections.json';
import carrierData from './data/carriers.json';
import { ScriptData, Carrier } from './types';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

const AuthenticatedApp: React.FC = () => {
  const { user, agent, loading, profileLoading, error, clearError, retryAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('leads');
  const [customerData, setCustomerData] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const sections = (scriptData as ScriptData).sections;
  const carriers = (carrierData as { carriers: Carrier[] }).carriers;
  const [hasSubmittedToGoogleForm, setHasSubmittedToGoogleForm] = useState(false);

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
        <div className="text-center max-w-md mx-auto p-6 fade-in">
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
                  className="btn-secondary text-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={clearError}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="progress-bar">
              <div 
                className="progress-fill"
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
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Script Navigation
                  </h2>
                  <div className="text-sm text-gray-600 font-medium">
                    Section {currentSectionIndex + 1} of {sections.length}
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                {/* Progress Bar */}
                <div className="progress-bar mb-6">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
                  ></div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                    disabled={currentSectionIndex === 0}
                    className={currentSectionIndex === 0 
                      ? 'btn-secondary opacity-50 cursor-not-allowed'
                      : 'btn-secondary'
                    }
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {sections.map((section, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSectionIndex(index)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all tooltip ${
                          index === currentSectionIndex
                            ? 'bg-primary-600 text-white shadow-md transform scale-110'
                            : index < currentSectionIndex
                            ? 'bg-success text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:transform hover:scale-105'
                        }`}
                        data-tooltip={section.title}
                      >
                        {index < currentSectionIndex ? '✓' : index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={async () => {
                      const nextIndex = currentSectionIndex + 1;
                      
                      // Check if we just completed medical questions (section 6, index 5)
                      if (currentSectionIndex === 5 && !hasSubmittedToGoogleForm) {
                        const result = await submitMedicalData(customerData);
                        if (result.success) {
                          setHasSubmittedToGoogleForm(true);
                          alert('Medical data has been submitted to Google Forms!');
                        } else {
                          console.error('Failed to submit to Google Forms:', result.error);
                        }
                      }
                      
                      setCurrentSectionIndex(Math.min(sections.length - 1, nextIndex));
                    }}
                    disabled={currentSectionIndex === sections.length - 1 || !isCurrentSectionComplete()}
                    className={
                      currentSectionIndex === sections.length - 1 || !isCurrentSectionComplete()
                        ? 'btn-primary opacity-50 cursor-not-allowed'
                        : 'btn-primary'
                    }
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
            
            {/* Google Forms Configuration */}
            <GoogleFormsConfig />
            
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
        return <CarrierReferenceFull carriers={carriers} />;
      case 'additional':
        return (
          <AdditionalInfo 
            customerData={customerData}
            onDataChange={(fieldId: string, value: any) => {
              setCustomerData(prev => ({ ...prev, [fieldId]: value }));
            }}
          />
        );
      case 'summary':
        return <CustomerDataSummary customerData={customerData} />;
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
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600 font-medium">
                {agent.name}
              </span>
            </div>
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('leads')}
                className={`nav-tab ${
                  activeTab === 'leads' ? 'active' : ''
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`nav-tab ${
                  activeTab === 'script' ? 'active' : ''
                }`}
              >
                Script
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`nav-tab ${
                  activeTab === 'calculator' ? 'active' : ''
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setActiveTab('carriers')}
                className={`nav-tab ${
                  activeTab === 'carriers' ? 'active' : ''
                }`}
              >
                Carriers
              </button>
              <button
                onClick={() => setActiveTab('additional')}
                className={`nav-tab ${
                  activeTab === 'additional' ? 'active' : ''
                }`}
              >
                Additional Info
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`nav-tab ${
                  activeTab === 'summary' ? 'active' : ''
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`nav-tab ${
                  activeTab === 'profile' ? 'active' : ''
                }`}
              >
                Profile
              </button>
              <div className="ml-6 pl-6 border-l border-gray-200">
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 fade-in">
        <div className="px-4 sm:px-0">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

const AuthFlow: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        {isLogin ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            <SignIn afterSignInUrl="/" redirectUrl="/" />
            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <SignUp afterSignUpUrl="/" redirectUrl="/" />
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey!}>
      <AuthProvider>
        <LeadProvider>
          <AppContent />
        </LeadProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

// Separate component to handle the SignedIn/SignedOut logic
const AppContent: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    // Show loading state while Clerk is initializing
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isSignedIn ? <AuthenticatedApp /> : <AuthFlow />;
}

export default App;
