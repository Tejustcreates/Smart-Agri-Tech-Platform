import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wheat, Truck, IndianRupee, Loader2, Sparkles, Trophy, Navigation } from 'lucide-react';
import { MandiRecommendation, RecommendationInput } from '../../types/mandi';
import { getRecommendation } from '../../services/mandi/mandiApi';
import { CROP_OPTIONS } from '../../constants';
import { useGpsLocation } from '../../hooks/useGpsLocation';

const BestRecommendation: React.FC = () => {
  const [input, setInput] = useState<RecommendationInput>({
    location: '', crop: '', quantity: '', transportCost: '',
  });
  const [results, setResults] = useState<MandiRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { location, status: gpsStatus, detect } = useGpsLocation();

  useEffect(() => {
    detect();
  }, []);

  useEffect(() => {
    if (location) {
      const name = location.village || location.district || location.state;
      setInput((prev) => ({ ...prev, location: name }));
    }
  }, [location]);

  const update = (field: keyof RecommendationInput, value: string) => setInput((p) => ({ ...p, [field]: value }));

  const handleSearch = async () => {
    if (!input.crop || !input.quantity) return;
    setLoading(true);
    setSearched(true);
    try {
      const qty = Number(input.quantity);
      const tc = Number(input.transportCost) || 200;
      const recs = await getRecommendation(input.crop, qty, tc);
      setResults(recs);
    } finally {
      setLoading(false);
    }
  };

  const recommended = results.find((r) => r.isRecommended);

  return (
    <div>
      {/* Input Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Current Location</label>
            <button
              onClick={detect}
              disabled={gpsStatus === 'loading'}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-left hover:bg-green-50 hover:border-green-300 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {gpsStatus === 'loading' ? (
                <Loader2 size={14} className="animate-spin text-green-500 flex-shrink-0" />
              ) : gpsStatus === 'granted' && location ? (
                <Navigation size={14} className="text-green-600 flex-shrink-0" />
              ) : (
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              )}
              <span className={`truncate text-xs font-medium ${gpsStatus === 'granted' && location ? 'text-green-700' : 'text-gray-500'}`}>
                {gpsStatus === 'loading' ? 'Detecting...' : gpsStatus === 'granted' && location ? (location.village || location.district || location.state) : 'Auto-detect location'}
              </span>
            </button>
            {location && gpsStatus === 'granted' && (
              <p className="text-[10px] text-gray-400 mt-1 ml-1">{location.state && `${location.state}`}{location.district && `, ${location.district}`}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Crop *</label>
            <div className="relative">
              <Wheat size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={input.crop} onChange={(e) => update('crop', e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select Crop</option>
                {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Quantity (Quintals) *</label>
            <input type="number" min={1} value={input.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="e.g. 10" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Transport Budget (₹)</label>
            <div className="relative">
              <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" value={input.transportCost} onChange={(e) => update('transportCost', e.target.value)} placeholder="e.g. 200" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !input.crop || !input.quantity}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:bg-green-400 transition-all shadow-sm shadow-green-200 active:scale-[0.98] flex items-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Sparkles size={16} /> Find Best Mandi</>}
        </button>
      </div>

      {/* Recommended Highlight */}
      {recommended && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-amber-300" />
            <span className="text-sm font-bold uppercase tracking-wide">Recommended Mandi</span>
          </div>

          <h3 className="text-2xl font-extrabold mb-4">{recommended.name}</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <p className="text-[10px] text-white/70 uppercase font-semibold">Current Price</p>
              <p className="text-lg font-bold">₹{recommended.currentPrice.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <p className="text-[10px] text-white/70 uppercase font-semibold">Distance</p>
              <p className="text-lg font-bold">{recommended.distance} km</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <p className="text-[10px] text-white/70 uppercase font-semibold">Transport Cost</p>
              <p className="text-lg font-bold">₹{recommended.transportCost.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <p className="text-[10px] text-white/70 uppercase font-semibold">Net Price</p>
              <p className="text-lg font-bold">₹{recommended.netPrice.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <p className="text-[10px] text-white/70 uppercase font-semibold">Extra Profit</p>
              <p className="text-lg font-bold text-amber-300">+₹{recommended.extraProfit.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <p className="text-[10px] text-white/70 uppercase font-semibold">Arrivals</p>
              <p className="text-lg font-bold">{recommended.arrivalQty} qtl</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
            <Sparkles size={18} className="text-amber-300 flex-shrink-0" />
            <p className="text-sm font-medium">
              Sell at <strong>{recommended.name}</strong> — you save an extra{' '}
              <strong className="text-amber-300">₹{recommended.extraProfit.toLocaleString()}</strong> compared to other mandis.
            </p>
          </div>
        </motion.div>
      )}

      {/* All Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-700 mb-2">All Nearby Mandis — Ranked by Net Profit</h4>
          {results.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl border p-5 shadow-sm transition-all ${
                r.isRecommended ? 'border-green-300 ring-1 ring-green-200' : 'border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800">{r.name}</h3>
                    {r.isRecommended && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">BEST</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={11} /> {r.district}, {r.state} — {r.distance} km
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-green-700">₹{r.netPrice.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">Net per quintal</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400">Market Price</p>
                  <p className="text-xs font-bold text-gray-700">₹{r.currentPrice.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400">Transport</p>
                  <p className="text-xs font-bold text-gray-700">₹{r.transportCost}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400">Arrivals</p>
                  <p className="text-xs font-bold text-gray-700">{r.arrivalQty} qtl</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400">Distance</p>
                  <p className="text-xs font-bold text-gray-700">{r.distance} km</p>
                </div>
                <div className={`rounded-lg p-2 text-center ${r.extraProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <p className="text-[10px] text-gray-400">Extra Profit</p>
                  <p className={`text-xs font-bold ${r.extraProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {r.extraProfit >= 0 ? '+' : ''}₹{r.extraProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-16">
          <Sparkles size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Enter your crop, quantity, and location to find the best mandi.</p>
          <p className="text-gray-400 text-xs mt-1">We compare prices, transport costs, and distances to maximize your profit.</p>
        </div>
      )}
    </div>
  );
};

export default BestRecommendation;
