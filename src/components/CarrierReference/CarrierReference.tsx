import React, { useState } from 'react';
import { Carrier } from '../../types';

interface CarrierReferenceProps {
  carriers: Carrier[];
  onClose: () => void;
}

const CarrierReference: React.FC<CarrierReferenceProps> = ({ carriers, onClose }) => {
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCarriers = carriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Carrier Reference</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search carriers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Carrier List */}
      <div className="flex-1 overflow-y-auto">
        {selectedCarrier ? (
          /* Detailed View */
          <div className="p-4">
            <button
              onClick={() => setSelectedCarrier(null)}
              className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to list
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCarrier.name}</h3>
                <p className="text-sm text-gray-600">{selectedCarrier.location}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rating:</span>
                  <span className="text-sm font-bold text-green-600">
                    {selectedCarrier.rating} ({selectedCarrier.ratingAgency})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Years in Business:</span>
                  <span className="text-sm text-gray-900">{selectedCarrier.yearsInBusiness}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedCarrier.description}</p>
              </div>

              {selectedCarrier.assets && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Assets</h4>
                  <p className="text-sm text-gray-900">{selectedCarrier.assets}</p>
                </div>
              )}

              {selectedCarrier.customers && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Customers</h4>
                  <p className="text-sm text-gray-900">{selectedCarrier.customers}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCarrier.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Coverage Types</h4>
                <div className="space-y-1">
                  {selectedCarrier.coverage_types.immediate && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">Immediate Benefit</span>
                    </div>
                  )}
                  {selectedCarrier.coverage_types.graded && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">Graded Benefit</span>
                    </div>
                  )}
                  {selectedCarrier.coverage_types.return_of_premium && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">Return of Premium</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedCarrier.graded_details && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Graded Benefit Details</h4>
                  <div className="bg-blue-50 p-3 rounded-md text-xs space-y-1">
                    <div>Year 1: {selectedCarrier.graded_details.year1}</div>
                    <div>Year 2: {selectedCarrier.graded_details.year2}</div>
                    <div>Year 3+: {selectedCarrier.graded_details.year3_plus}</div>
                    <div className="font-medium">Accidental: {selectedCarrier.graded_details.accidental}</div>
                  </div>
                </div>
              )}

              {selectedCarrier.return_of_premium_details && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Return of Premium Details</h4>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {selectedCarrier.return_of_premium_details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-gray-200">
            {filteredCarriers.map((carrier) => (
              <div
                key={carrier.id}
                onClick={() => setSelectedCarrier(carrier)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{carrier.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{carrier.location}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {carrier.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        {carrier.yearsInBusiness} years
                      </span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrierReference;
