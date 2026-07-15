import React, { useState, useCallback, useEffect } from 'react';
import { Section, Scheme } from '../types';
import { INDIAN_STATES, CROP_OPTIONS } from '../constants';
import { fetchSchemes } from '../services/geminiService';

interface SchemeWithMatch extends Scheme {
  matchScore: number;
  category: string;
}

const SCHEME_DATABASE: Record<string, SchemeWithMatch[]> = {
  default: [
    {
      schemeName: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support of ₹6,000 per year to farmer families, transferred in 3 equal installments of ₹2,000 each.',
      eligibility: 'All landholding farmer families with cultivable land. SC/ST farmers prioritized.',
      benefits: '₹6,000 per year per family, Direct bank transfer, No middlemen',
      matchScore: 95,
      category: 'Financial Support',
    },
    {
      schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Crop insurance scheme providing comprehensive coverage against crop failure due to natural calamities, pests, and diseases.',
      eligibility: 'All farmers growing notified crops in notified areas who have insurable interest.',
      benefits: 'Low premium rates (2% kharif, 1.5% rabi), Full claim amount, Post-harvest coverage',
      matchScore: 90,
      category: 'Insurance',
    },
    {
      schemeName: 'Kisan Credit Card (KCC)',
      description: 'Easy credit access for farmers at subsidized interest rates for agricultural expenses and allied activities.',
      eligibility: 'All farmers - individual or joint owners of cultivable land.',
      benefits: 'Credit limit up to ₹3 lakhs, 4% interest rate, Flexible repayment, Crop purchase facility',
      matchScore: 88,
      category: 'Credit',
    },
    {
      schemeName: 'Soil Health Card Scheme',
      description: 'Free soil testing and issuance of Soil Health Cards with crop-wise nutrient recommendations.',
      eligibility: 'All farmers with agricultural land holdings.',
      benefits: 'Free soil testing, Personalized recommendations, Balanced fertilizer usage guidance',
      matchScore: 85,
      category: 'Advisory',
    },
  ],
};

const LAND_SIZE_CATEGORIES = [
  { label: 'Small (< 2.5 acres)', icon: 'fa-seedling', schemes: ['PM-KISAN', 'KCC', 'Soil Health Card'] },
  { label: 'Medium (2.5 - 5 acres)', icon: 'fa-tractor', schemes: ['PM-KISAN', 'PMFBY', 'KCC'] },
  { label: 'Large (> 5 acres)', icon: 'fa-building', schemes: ['PMFBY', 'KCC', 'Subsidized Equipment'] },
];

const Schemes: React.FC = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedLandSize, setSelectedLandSize] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [schemes, setSchemes] = useState<SchemeWithMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const getSchemes = useCallback(async () => {
    setLoading(true);
    
    let matchedSchemes: SchemeWithMatch[] = [...SCHEME_DATABASE.default];
    
    if (selectedLandSize || selectedCrop) {
      matchedSchemes = matchedSchemes.map(scheme => {
        let newScore = scheme.matchScore;
        let boost = 0;
        
        if (selectedLandSize.includes('Small') && (scheme.category === 'Financial Support' || scheme.category === 'Advisory')) {
          boost += 5;
        }
        if (selectedLandSize.includes('Medium') && (scheme.category === 'Insurance' || scheme.category === 'Credit')) {
          boost += 5;
        }
        if (selectedLandSize.includes('Large') && scheme.category === 'Insurance') {
          boost += 8;
        }
        
        if (selectedCrop && ['Wheat', 'Rice', 'Cotton'].includes(selectedCrop)) {
          if (scheme.schemeName.includes('PMFBY')) boost += 5;
          if (scheme.schemeName.includes('KCC')) boost += 3;
        }
        
        return {
          ...scheme,
          matchScore: Math.min(100, newScore + boost),
        };
      });
      
      matchedSchemes.sort((a, b) => b.matchScore - a.matchScore);
    }
    
    if (selectedState) {
      try {
        const fetchedSchemes = await fetchSchemes(selectedState);
        const convertedSchemes: SchemeWithMatch[] = fetchedSchemes.map((scheme, index) => ({
          ...scheme,
          matchScore: 85 + (10 - index * 2),
          category: ['State Scheme', 'Central Scheme', 'Subsidy'][index % 3],
        }));
        matchedSchemes = [...convertedSchemes, ...matchedSchemes];
      } catch (error) {
        console.error('Error fetching state schemes:', error);
      }
    }
    
    setSchemes(matchedSchemes.slice(0, 8));
    setLoading(false);
  }, [selectedState, selectedLandSize, selectedCrop]);

  useEffect(() => {
    if (selectedState || selectedLandSize || selectedCrop) {
      getSchemes();
    }
  }, [selectedState, selectedLandSize, selectedCrop, getSchemes]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial Support': return 'fa-hand-holding-usd text-green-500';
      case 'Insurance': return 'fa-shield-alt text-blue-500';
      case 'Credit': return 'fa-credit-card text-yellow-500';
      case 'Advisory': return 'fa-lightbulb text-purple-500';
      default: return 'fa-gift text-gray-500';
    }
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 75) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <section id={Section.SCHEMES} className="py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Government <span className="text-indigo-600">Schemes</span> Recommender
          </h2>
          <p className="text-gray-600 mt-4">Smart personalized scheme recommendations for your farm</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-filter text-indigo-600"></i>
              Filter Schemes
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showFilters ? '' : 'hidden md:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select your State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All India Schemes</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Size</label>
              <select
                value={selectedLandSize}
                onChange={(e) => setSelectedLandSize(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Land Size</option>
                {LAND_SIZE_CATEGORIES.map((cat) => (
                  <option key={cat.label} value={cat.label}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Crop (Optional)</option>
                {CROP_OPTIONS.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>

          {(selectedState || selectedLandSize || selectedCrop) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedState && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1">
                  <i className="fas fa-map-marker-alt"></i>
                  {selectedState}
                </span>
              )}
              {selectedLandSize && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                  <i className="fas fa-expand-arrows-alt"></i>
                  {selectedLandSize}
                </span>
              )}
              {selectedCrop && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                  <i className="fas fa-seedling"></i>
                  {selectedCrop}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-indigo-600 text-4xl mb-4"></i>
                <p className="text-lg text-gray-700">Fetching personalized schemes...</p>
              </div>
            </div>
          ) : schemes.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Smart Recommendations</h3>
                    <p className="opacity-90">
                      Schemes are ranked based on your profile. Match percentage shows relevance to your farm.
                    </p>
                  </div>
                </div>
              </div>

              {schemes.map((scheme, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getMatchBadgeColor(scheme.matchScore)}`}>
                        <span className="font-bold text-lg">{scheme.matchScore}%</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{scheme.schemeName}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold mt-1 ${
                            scheme.category === 'Financial Support' ? 'bg-green-100 text-green-700' :
                            scheme.category === 'Insurance' ? 'bg-blue-100 text-blue-700' :
                            scheme.category === 'Credit' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            <i className={`fas ${getCategoryIcon(scheme.category)}`}></i>
                            {scheme.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{scheme.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500"></i>
                            Eligibility
                          </h4>
                          <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <i className="fas fa-gift text-green-500"></i>
                            Benefits
                          </h4>
                          <p className="text-sm text-gray-600">{scheme.benefits}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => window.open('https://pmkisan.gov.in/', '_blank')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-indigo-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Find Government Schemes</h3>
              <p className="text-gray-600 mb-6">
                Select your state, land size, and crop to see personalized scheme recommendations
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  <i className="fas fa-check mr-1"></i>PM-KISAN
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <i className="fas fa-check mr-1"></i>Crop Insurance
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  <i className="fas fa-check mr-1"></i>KCC
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-blue-600"></i>
            Quick Reference: Land Size Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LAND_SIZE_CATEGORIES.map((cat) => (
              <div key={cat.label} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <i className={`fas ${cat.icon} text-indigo-500`}></i>
                  {cat.label}
                </h4>
                <p className="text-sm text-gray-600 mb-2">Recommended schemes:</p>
                <div className="flex flex-wrap gap-1">
                  {cat.schemes.map((s) => (
                    <span key={s} className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schemes;
