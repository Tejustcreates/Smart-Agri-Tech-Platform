import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { FarmerProfile, SchemeFilters, Scheme } from '../../types/scheme';
import { searchSchemes, getPopularSchemes } from '../../services/schemeService';
import Section from '../../components/Section';
import SchemeFilter from './SchemeFilter';
import SearchBar from './SearchBar';
import SchemeCard from './SchemeCard';
import PopularSchemes from './PopularSchemes';
import SchemeDetailsModal from './SchemeDetailsModal';

const DEFAULT_PROFILE: FarmerProfile = {
  state: '',
  district: '',
  category: '',
  landHolding: '',
  crop: '',
  gender: '',
  age: '',
  annualIncome: '',
  farmerType: '',
  irrigation: '',
};

const DEFAULT_FILTERS: SchemeFilters = {
  state: '',
  category: '',
  crop: '',
  search: '',
  level: 'all',
  sort: 'match',
};

const GovernmentSchemes: React.FC = () => {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [filters, setFilters] = useState<SchemeFilters>(DEFAULT_FILTERS);
  const [results, setResults] = useState<Scheme[]>([]);
  const [popular, setPopular] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPopular(getPopularSchemes('Maharashtra'));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const mergedFilters: SchemeFilters = {
        ...filters,
        state: profile.state || filters.state,
        crop: profile.crop || filters.crop,
      };
      const schemes = await searchSchemes(mergedFilters, profile);
      setResults(schemes);
    } catch {
      setError('Failed to load schemes. Showing popular schemes instead.');
      setResults(popular);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = async (f: SchemeFilters) => {
    setFilters(f);
    if (hasSearched) {
      setLoading(true);
      try {
        const mergedFilters: SchemeFilters = {
          ...f,
          state: profile.state || f.state,
          crop: profile.crop || f.crop,
        };
        const schemes = await searchSchemes(mergedFilters, profile);
        setResults(schemes);
      } catch {
        // keep existing results
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Section
      id="schemes"
      tone="rose"
      icon="fas fa-landmark"
      eyebrow="Government Scheme Finder"
      title="Find Schemes You Qualify For"
      subtitle="Complete your profile below and we will match you with central and state government schemes, subsidies, and grants tailored to your farm."
      className=""
    >
      <div className="mx-auto w-full">

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SchemeFilter profile={profile} onProfileChange={setProfile} onSearch={handleSearch} loading={loading} />
        </motion.div>

        {/* Popular Schemes (before first search) */}
        {!hasSearched && <PopularSchemes schemes={popular} onSelect={setSelectedScheme} />}

        {/* Search Results */}
        {hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SearchBar filters={filters} onFiltersChange={handleFiltersChange} resultCount={results.length} />

            {error && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 rounded-xl px-4 py-3 mb-6 text-sm">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-brand-500" />
                <span className="ml-3 text-gray-500 text-sm">Searching schemes...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">No Schemes Found</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Try adjusting your profile details or search filters to find more schemes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {results.map((scheme, i) => (
                  <SchemeCard key={scheme.id} scheme={scheme} rank={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <SchemeDetailsModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </Section>
  );
};

export default GovernmentSchemes;
