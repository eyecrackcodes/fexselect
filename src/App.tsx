import React, { useState, useEffect } from 'react';
import { ScriptData, CustomerData, AppState, Carrier } from './types';
import ScriptDisplay from './components/ScriptDisplay/ScriptDisplay';
import Navigation from './components/Navigation/Navigation';
import CarrierReference from './components/CarrierReference/CarrierReference';
import CustomerDataSummary from './components/CustomerDataSummary/CustomerDataSummary';
import scriptData from './data/script-sections.json';
import carrierData from './data/carriers.json';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentSection: 0,
    customerData: {},
    completedSections: [],
    isCallActive: false,
  });

  const [showCarrierReference, setShowCarrierReference] = useState(false);
  const [showCustomerSummary, setShowCustomerSummary] = useState(false);

  const sections = (scriptData as ScriptData).sections;
  const carriers = (carrierData as { carriers: Carrier[] }).carriers;

  // Auto-save customer data to localStorage
  useEffect(() => {
    localStorage.setItem('customerData', JSON.stringify(appState.customerData));
  }, [appState.customerData]);

  // Load saved data on startup
  useEffect(() => {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAppState(prev => ({
          ...prev,
          customerData: parsedData
        }));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleDataChange = (fieldId: string, value: any) => {
    setAppState(prev => ({
      ...prev,
      customerData: {
        ...prev.customerData,
        [fieldId]: value
      }
    }));
  };

  const handleNextSection = () => {
    if (appState.currentSection < sections.length - 1) {
      const currentSectionId = sections[appState.currentSection].id;
      setAppState(prev => ({
        ...prev,
        currentSection: prev.currentSection + 1,
        completedSections: Array.from(new Set([...prev.completedSections, currentSectionId]))
      }));
    }
  };

  const handlePreviousSection = () => {
    if (appState.currentSection > 0) {
      setAppState(prev => ({
        ...prev,
        currentSection: prev.currentSection - 1
      }));
    }
  };

  const handleGoToSection = (sectionIndex: number) => {
    setAppState(prev => ({
      ...prev,
      currentSection: sectionIndex
    }));
  };

  const handleNewCall = () => {
    setAppState({
      currentSection: 0,
      customerData: {},
      completedSections: [],
      isCallActive: true,
      callStartTime: new Date()
    });
    localStorage.removeItem('customerData');
  };

  const canProceedToNext = () => {
    const currentSection = sections[appState.currentSection];
    const requiredFields = currentSection.content
      .filter(item => item.type === 'input_field' && item.required)
      .map(item => item.id);
    
    return requiredFields.every(fieldId => 
      appState.customerData[fieldId as keyof CustomerData]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Final Expense Select
              </h1>
              <div className="text-sm text-gray-500">
                Script Application v1.0
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCustomerSummary(!showCustomerSummary)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Customer Data
              </button>
              <button
                onClick={() => setShowCarrierReference(!showCarrierReference)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Carrier Reference
              </button>
              <button
                onClick={handleNewCall}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                New Call
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <Navigation
          currentSection={appState.currentSection}
          totalSections={sections.length}
          onNext={handleNextSection}
          onPrevious={handlePreviousSection}
          onGoToSection={handleGoToSection}
          canProceed={canProceedToNext()}
        />

        {/* Script Display */}
        <main className="flex-1 px-6 py-6">
          <ScriptDisplay
            section={sections[appState.currentSection]}
            customerData={appState.customerData}
            onDataChange={handleDataChange}
          />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              {appState.isCallActive && appState.callStartTime && (
                <span>
                  Call started: {appState.callStartTime.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div>
              Section {appState.currentSection + 1} of {sections.length}
            </div>
          </div>
        </footer>
      </div>

      {/* Sidebar Panels */}
      {showCarrierReference && (
        <CarrierReference
          carriers={carriers}
          onClose={() => setShowCarrierReference(false)}
        />
      )}

      {showCustomerSummary && (
        <CustomerDataSummary
          customerData={appState.customerData}
          onClose={() => setShowCustomerSummary(false)}
        />
      )}
    </div>
  );
}

export default App;
