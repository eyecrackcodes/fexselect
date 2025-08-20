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
  const { user, agent, loading } = useAuth();
  const { currentLead } = useLead();
  const [activeTab, setActiveTab] = useState('leads');
  const [customerData, setCustomerData] = useState({});
  
  const sections = (scriptData as ScriptData).sections;
  const carriers = (carrierData as { carriers: Carrier[] }).carriers;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
          <ScriptDisplay
            section={sections[0]}
            customerData={customerData}
            onDataChange={(fieldId: string, value: any) => {
              setCustomerData(prev => ({ ...prev, [fieldId]: value }));
            }}
          />
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
