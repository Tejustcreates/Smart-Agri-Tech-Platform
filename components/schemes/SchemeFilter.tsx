import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Sprout, Droplets, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
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
  const [showOptional, setShowOptional] = useState(false);

  const update = (field: keyof FarmerProfile, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <User size={20} className="text-brand-600" />
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
          {/* ── Required Fields ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">Required</span>
              <span className="text-[10px] text-gray-400">— drives scheme matching</span>
            </div>

            {/* State */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">State</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={profile.state}
                  onChange={(e) => update('state', e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Farmer Category — big tap targets, 2x2 on mobile */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Farmer Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FARMER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => update('category', profile.category === cat ? '' : cat)}
                    className={`tap-target rounded-xl text-sm font-semibold transition-all duration-200 ${
                      profile.category === cat
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-200 ring-2 ring-brand-400'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Land Holding */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Land Holding (Acres)</label>
              <input
                type="text"
                value={profile.landHolding}
                onChange={(e) => update('landHolding', e.target.value)}
                placeholder="e.g. 2.5"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* ── Optional Fields Toggle ── */}
          <button
            onClick={() => setShowOptional(!showOptional)}
            className="tap-target w-full flex items-center justify-between py-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              {showOptional ? <Minus size={16} /> : <Plus size={16} />}
              Add more details
            </span>
            <span className="text-xs text-gray-400 font-normal">— improves accuracy</span>
          </button>

          <AnimatePresence>
            {showOptional && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-1">
                  {/* District */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">District</label>
                    <input
                      type="text"
                      value={profile.district}
                      onChange={(e) => update('district', e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>

                  {/* Crop + Gender + Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Primary Crop</label>
                      <div className="relative">
                        <Sprout size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                          value={profile.crop}
                          onChange={(e) => update('crop', e.target.value)}
                          className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
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
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
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
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Income + Farmer Type + Irrigation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Annual Income (₹)</label>
                      <input
                        type="number"
                        value={profile.annualIncome}
                        onChange={(e) => update('annualIncome', e.target.value)}
                        placeholder="e.g. 150000"
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Farmer Type</label>
                      <select
                        value={profile.farmerType}
                        onChange={(e) => update('farmerType', e.target.value)}
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value="">Select</option>
                        {FARMER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Irrigation Type</label>
                      <div className="relative">
                        <Droplets size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                          value={profile.irrigation}
                          onChange={(e) => update('irrigation', e.target.value)}
                          className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
                        >
                          <option value="">Select</option>
                          {IRRIGATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sticky Submit Button */}
          <div className="sticky bottom-0 -mx-6 px-6 pb-0 pt-2 bg-white lg:static lg:pb-0">
            <button
              onClick={onSearch}
              disabled={loading}
              className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 disabled:bg-brand-400 transition-all shadow-sm shadow-brand-200 active:scale-[0.98]"
            >
              {loading ? 'Searching...' : 'Find Matching Schemes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchemeFilter;
