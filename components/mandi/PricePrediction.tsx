import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3, Loader2, Sprout, MapPin, Calendar, CloudRain, Navigation } from 'lucide-react';
import { PriceForecast, PredictionInput } from '../../types/mandi';
import { getPricePrediction } from '../../services/mandi/mandiApi';
import { CROP_OPTIONS } from '../../constants';
import { useGpsLocation } from '../../hooks/useGpsLocation';

const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const trendMeta = (t: string) => {
  if (t === 'bullish') return { icon: <TrendingUp size={18} />, label: 'Bullish (Prices rising)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (t === 'bearish') return { icon: <TrendingDown size={18} />, label: 'Bearish (Prices falling)', color: 'bg-red-50 text-red-700 border-red-200' };
  return { icon: <Minus size={18} />, label: 'Stable (Prices steady)', color: 'bg-gray-50 text-gray-600 border-gray-200' };
};

// Lazy import to avoid SSR issues
const AnalyticsChart = React.lazy(() => import('./AnalyticsChart'));

const PricePrediction: React.FC = () => {
  const [input, setInput] = useState<PredictionInput>({
    crop: '', state: '', district: '', currentPrice: '', season: '', month: '', rainfall: '',
  });
  const [result, setResult] = useState<PriceForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const { location, status: gpsStatus, detect } = useGpsLocation();

  useEffect(() => {
    detect();
  }, []);

  useEffect(() => {
    if (location) {
      setInput((prev) => ({ ...prev, state: location.state, district: location.district }));
    }
  }, [location]);

  const update = (field: keyof PredictionInput, value: string) => setInput((prev) => ({ ...prev, [field]: value }));

  const handlePredict = async () => {
    if (!input.crop || !input.currentPrice) return;
    setLoading(true);
    try {
      const forecast = await getPricePrediction(input.crop, Number(input.currentPrice));
      setResult(forecast);
    } finally {
      setLoading(false);
    }
  };

  const tm = result ? trendMeta(result.trend) : null;

  return (
    <div>
      {/* Input Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Crop *</label>
            <div className="relative">
              <Sprout size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={input.crop} onChange={(e) => update('crop', e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select Crop</option>
                {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Your Location</label>
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
                {gpsStatus === 'loading' ? 'Detecting...' : gpsStatus === 'granted' && location ? `${location.village || location.district || location.state}` : 'Auto-detect location'}
              </span>
            </button>
            {location && gpsStatus === 'granted' && (
              <p className="text-[10px] text-gray-400 mt-1 ml-1">{location.state && `${location.state}`}{location.district && `, ${location.district}`}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Current Market Price (₹/quintal) *</label>
            <input type="number" value={input.currentPrice} onChange={(e) => update('currentPrice', e.target.value)} placeholder="e.g. 5500" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Season</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={input.season} onChange={(e) => update('season', e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select Season</option>
                {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Month</label>
            <select value={input.month} onChange={(e) => update('month', e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Month</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Rainfall (mm, optional)</label>
            <div className="relative">
              <CloudRain size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" value={input.rainfall} onChange={(e) => update('rainfall', e.target.value)} placeholder="e.g. 200" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !input.crop || !input.currentPrice}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:bg-green-400 transition-all shadow-sm shadow-green-200 active:scale-[0.98] flex items-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Predicting...</> : <><BarChart3 size={16} /> Predict Price</>}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-[10px] text-gray-500 font-semibold uppercase mb-1">Current Price</p>
              <p className="text-2xl font-extrabold text-gray-800">₹{result.currentPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400">per quintal</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 p-5 shadow-sm">
              <p className="text-[10px] text-emerald-600 font-semibold uppercase mb-1">Tomorrow's Price</p>
              <p className="text-2xl font-extrabold text-emerald-700">₹{result.tomorrowPrice.toLocaleString()}</p>
              <p className={`text-xs font-medium ${result.tomorrowPrice >= result.currentPrice ? 'text-emerald-600' : 'text-red-600'}`}>
                {result.tomorrowPrice >= result.currentPrice ? '+' : ''}₹{(result.tomorrowPrice - result.currentPrice).toLocaleString()} from today
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 p-5 shadow-sm">
              <p className="text-[10px] text-blue-600 font-semibold uppercase mb-1">Next Week Price</p>
              <p className="text-2xl font-extrabold text-blue-700">₹{result.nextWeekPrice.toLocaleString()}</p>
              <p className={`text-xs font-medium ${result.nextWeekPrice >= result.currentPrice ? 'text-emerald-600' : 'text-red-600'}`}>
                {result.nextWeekPrice >= result.currentPrice ? '+' : ''}₹{(result.nextWeekPrice - result.currentPrice).toLocaleString()} from today
              </p>
            </div>
            <div className={`rounded-2xl border p-5 shadow-sm ${tm?.color}`}>
              <p className="text-[10px] font-semibold uppercase mb-1 opacity-70">Expected Trend</p>
              <div className="flex items-center gap-2 text-lg font-extrabold">
                {tm?.icon}
                {result.trend.charAt(0).toUpperCase() + result.trend.slice(1)}
              </div>
              <p className="text-xs mt-1 opacity-70">Confidence: {result.confidence}%</p>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Prediction Confidence</span>
              <span className="text-sm font-bold text-green-700">{result.confidence}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-2.5 rounded-full ${result.confidence >= 80 ? 'bg-green-500' : result.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Prediction is based on historical price patterns and seasonal trends. Backend ML model (XGBoost) will be integrated later for higher accuracy.
            </p>
          </div>

          {/* Chart */}
          <React.Suspense fallback={<div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />}>
            <AnalyticsChart data={result.history} currentPrice={result.currentPrice} label={`${result.crop} Price History & Forecast`} />
          </React.Suspense>
        </motion.div>
      )}

      {!result && !loading && (
        <div className="text-center py-16">
          <BarChart3 size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Enter crop details and current price to get a prediction.</p>
          <p className="text-gray-400 text-xs mt-1">Currently using placeholder logic. XGBoost model will replace this later.</p>
        </div>
      )}
    </div>
  );
};

export default PricePrediction;
