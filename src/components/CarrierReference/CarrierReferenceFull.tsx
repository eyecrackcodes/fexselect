import React, { useState } from 'react';
import { Carrier } from '../../types';

interface CarrierReferenceFullProps {
  carriers: Carrier[];
}

const CarrierReferenceFull: React.FC<CarrierReferenceFullProps> = ({ carriers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'immediate' | 'graded' | 'rop'>('all');
  const [expandedCarrierId, setExpandedCarrierId] = useState<string | null>(null);

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'immediate' && carrier.coverage_types.immediate) ||
      (filterType === 'graded' && carrier.coverage_types.graded) ||
      (filterType === 'rop' && carrier.coverage_types.return_of_premium);
    
    return matchesSearch && matchesFilter;
  });

  const toggleExpanded = (carrierId: string) => {
    setExpandedCarrierId(expandedCarrierId === carrierId ? null : carrierId);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Carriers</h1>
        <p className="text-gray-600 mt-1">Compare carrier options and coverage types</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search carriers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'immediate', 'graded', 'rop'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                filterType === type 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All' : type === 'rop' ? 'ROP' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Carrier List */}
      <div className="space-y-3">
        {filteredCarriers.map((carrier) => {
          const isExpanded = expandedCarrierId === carrier.id;
          
          return (
            <div
              key={carrier.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:border-gray-300"
            >
              {/* Carrier Header - Always Visible */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpanded(carrier.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {carrier.name}
                          <span className="text-sm font-normal text-gray-500">• {carrier.location}</span>
                        </h3>
                        
                        {/* Key Info Bar */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Rating:</span>
                            <span className="text-sm font-semibold text-green-600">{carrier.rating}</span>
                            <span className="text-xs text-gray-500">({carrier.ratingAgency})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Experience:</span>
                            <span className="text-sm font-semibold text-gray-900">{carrier.yearsInBusiness} years</span>
                          </div>
                          {carrier.assets && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">Assets:</span>
                              <span className="text-sm font-semibold text-gray-900">{carrier.assets}</span>
                            </div>
                          )}
                        </div>

                        {/* Coverage Types */}
                        <div className="flex items-center gap-2 mt-3">
                          {carrier.coverage_types.immediate && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Immediate
                            </span>
                          )}
                          {carrier.coverage_types.graded && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Graded
                            </span>
                          )}
                          {carrier.coverage_types.return_of_premium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              ROP
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Expand/Collapse Icon */}
                      <div className="ml-4 flex items-center">
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{carrier.description}</p>
                      </div>

                      {/* Specialties */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {carrier.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Graded Details */}
                      {carrier.graded_details && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-blue-900 mb-3">Graded Benefit Schedule</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Year 1:</span>
                              <span className="font-medium text-blue-900">{carrier.graded_details.year1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Year 2:</span>
                              <span className="font-medium text-blue-900">{carrier.graded_details.year2}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Year 3+:</span>
                              <span className="font-medium text-blue-900">{carrier.graded_details.year3_plus}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-blue-200">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Accidental:</span>
                                <span className="font-bold text-blue-900">{carrier.graded_details.accidental}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ROP Details */}
                      {carrier.return_of_premium_details && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-purple-900 mb-2">Return of Premium</h4>
                          <p className="text-sm text-purple-700">
                            {carrier.return_of_premium_details}
                          </p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 btn-secondary text-sm py-2">
                          <i className="fas fa-calculator mr-2"></i>
                          Get Quote
                        </button>
                        <button className="flex-1 btn-primary text-sm py-2">
                          <i className="fas fa-phone mr-2"></i>
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCarriers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No carriers found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CarrierReferenceFull;