import React from 'react';
import { NavigationProps } from '../../types';

const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  totalSections,
  onNext,
  onPrevious,
  onGoToSection,
  canProceed
}) => {
  const sectionNames = [
    'Preamble',
    'Company Introduction',
    'Building Rapport',
    'Transition to Qualifying',
    'Preliminary Health',
    'Medical Questions',
    'Quote Presentation',
    'Talk Down & Close',
    'Application'
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Section Progress */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Progress:</span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSections }, (_, index) => (
              <button
                key={index}
                onClick={() => onGoToSection(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentSection
                    ? 'bg-primary-600 text-white'
                    : index < currentSection
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={sectionNames[index] || `Section ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Section Info */}
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {sectionNames[currentSection] || `Section ${currentSection + 1}`}
          </h2>
          <p className="text-sm text-gray-500">
            Step {currentSection + 1} of {totalSections}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onPrevious}
            disabled={currentSection === 0}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
            }`}
          >
            ← Previous
          </button>
          
          <button
            onClick={onNext}
            disabled={currentSection === totalSections - 1 || !canProceed}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentSection === totalSections - 1 || !canProceed
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
          />
        </div>
      </div>

      {/* Validation Message */}
      {!canProceed && currentSection < totalSections - 1 && (
        <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Please complete all required fields before proceeding to the next section.
        </div>
      )}
    </nav>
  );
};

export default Navigation;
