import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Sprout, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { FarmerProfile } from '../../types/scheme';
import { INDIAN_STATES, CROP_OPTIONS } from '../../constants';

interface SchemeFilterProps {
  profile: FarmerProfile;
  onProfileChange: (p: FarmerProfile) => void;
  onSearch: () => void;
  loading: boolean;
}

const FARMER_CATEGORIES = ['Small', 'Marginal', 'Medium', 'Large'];
const FARMER_TYPES = ['Individual', 'FPO', 'SHG', 'Organic Farmer', 'Tenant Farmer'];
const IRRIGATION_TYPES = ['Rainfed', 'Canal', 'Drip', 'Sprinkler'];

const SchemeFilter: React.FC<SchemeFilterProps> = ({ profile, onProfileChange, onSearch, loading }) => {
  const [expanded, setExpanded] = useState(true);

  const update = (field: keyof FarmerProfile, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <User size={20} className="text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-gray-800">Farmer Profile</h3>
            <p className="text-xs text-gray-400">Fill in your details to find the best matching schemes</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 space-y-5">
          {/* Row 1: State + District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">State</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={profile.state}
                  onChange={(e) => update('state', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">District</label>
              <input
                type="text"
                value={profile.district}
                onChange={(e) => update('district', e.target.value)}
                placeholder="e.g. Pune"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Row 2: Category + Land Holding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Farmer Category</label>
              <div className="flex flex-wrap gap-1.5">
                {FARMER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => update('category', profile.category === cat ? '' : cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      profile.category === cat
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Land Holding (Acres)</label>
              <input
                type="text"
                value={profile.landHolding}
                onChange={(e) => update('landHolding', e.target.value)}
                placeholder="e.g. 2.5"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Row 3: Crop + Gender + Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Primary Crop</label>
              <div className="relative">
                <Sprout size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={profile.crop}
                  onChange={(e) => update('crop', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Crop</option>
                  {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Age</label>
              <input
                type="number"
                min={18}
                max={100}
                value={profile.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="e.g. 35"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Row 4: Income + Farmer Type + Irrigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Annual Income (₹)</label>
              <input
                type="number"
                value={profile.annualIncome}
                onChange={(e) => update('annualIncome', e.target.value)}
                placeholder="e.g. 150000"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Farmer Type</label>
              <select
                value={profile.farmerType}
                onChange={(e) => update('farmerType', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                {FARMER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Irrigation Type</label>
              <div className="relative">
                <Droplets size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={profile.irrigation}
                  onChange={(e) => update('irrigation', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select</option>
                  {IRRIGATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            disabled={loading}
            className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:bg-green-400 transition-all shadow-sm shadow-green-200 active:scale-[0.98]"
          >
            {loading ? 'Searching...' : 'Find Matching Schemes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SchemeFilter;
