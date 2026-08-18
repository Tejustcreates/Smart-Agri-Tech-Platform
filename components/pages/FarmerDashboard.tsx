import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../../types';
import { ROUTES } from '../../constants';

const QUICK_ACTIONS = [
  { label: 'Weather', icon: 'fas fa-cloud-sun', section: Section.WEATHER, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { label: 'Crop Advice', icon: 'fas fa-seedling', section: Section.CROP_RECOMMENDER, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { label: 'Disease Check', icon: 'fas fa-bug', section: Section.DISEASE_DETECTION, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  { label: 'Mandi Prices', icon: 'fas fa-store', section: Section.MANDI, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  { label: 'Govt Schemes', icon: 'fas fa-landmark', section: Section.SCHEMES, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { label: 'Equipment', icon: 'fas fa-tractor', section: Section.EQUIPMENT_RECOMMENDER, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
];

const MANDI_PRICES = [
  { crop: 'Soybean', price: 4850, unit: '₹/quintal', change: +2.3, icon: 'fas fa-seedling' },
  { crop: 'Wheat', price: 2275, unit: '₹/quintal', change: -0.8, icon: 'fas fa-wheat-awn' },
  { crop: 'Cotton', price: 6920, unit: '₹/quintal', change: +1.5, icon: 'fas fa-cloud' },
  { crop: 'Onion', price: 3150, unit: '₹/quintal', change: -3.1, icon: 'fas fa-circle' },
];

const SCHEMES = [
  { name: 'PM-KISAN', desc: 'Direct income support of ₹6,000/year to farmer families', status: 'Eligible', statusColor: 'bg-emerald-100 text-emerald-700', icon: 'fas fa-hand-holding-dollar' },
  { name: 'PM Fasal Bima', desc: 'Crop insurance against natural calamities', status: 'Active', statusColor: 'bg-blue-100 text-blue-700', icon: 'fas fa-shield-halved' },
  { name: 'KCC Loan', desc: 'Kisan Credit Card with subsidized interest rates', status: 'Applied', statusColor: 'bg-amber-100 text-amber-700', icon: 'fas fa-credit-card' },
];

const ACTIVITIES = [
  { text: 'Soil test report uploaded for Field #3', time: '2 hours ago', icon: 'fas fa-flask', color: 'text-brand-600' },
  { text: 'Weather alert: Heavy rain expected tomorrow', time: '5 hours ago', icon: 'fas fa-cloud-showers-heavy', color: 'text-blue-600' },
  { text: 'PM-KISAN installment received ₹2,000', time: '1 day ago', icon: 'fas fa-indian-rupee-sign', color: 'text-emerald-600' },
  { text: 'Pesticide order delivered from Mandi', time: '2 days ago', icon: 'fas fa-truck', color: 'text-orange-600' },
  { text: 'Cotton crop health check completed', time: '3 days ago', icon: 'fas fa-clipboard-check', color: 'text-purple-600' },
];

const FARMING_TIPS = [
  { tip: 'Delay irrigation for 2 days — rain expected', icon: 'fas fa-cloud-rain', color: 'text-blue-600', bg: 'bg-blue-50' },
  { tip: 'Apply neem-based pesticide to prevent aphids', icon: 'fas fa-spray-can-sparkles', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { tip: 'Harvest wheat within 3 days for best MSP rates', icon: 'fas fa-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { tip: 'Spray fungicide on cotton leaves today', icon: 'fas fa-droplet', color: 'text-purple-600', bg: 'bg-purple-50' },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function CircularProgress({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Moderate' : 'Needs Attention';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-semibold ${color}`}>{label}</span>
    </div>
  );
}

const FarmerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [weather] = useState({ temp: 34, humidity: 68, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' });
  const [farmHealth] = useState(82);

  const greeting = useMemo(() => getGreeting(), []);
  const today = useMemo(() => formatDate(), []);

  useEffect(() => {
    document.title = 'Farmer Dashboard — Smart Agri-Tech';
  }, []);

  const goToSection = (sectionId: string) => {
    navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-600 text-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{greeting}, Farmer!</h1>
              <p className="text-brand-100 text-sm mt-1">{today}</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 text-white text-sm font-medium rounded-full px-4 py-2 min-h-[48px] transition-colors self-start"
            >
              <i className="fas fa-arrow-left text-xs"></i> Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => goToSection(action.section)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border ${action.bg} ${action.border} ${action.text} p-4 min-h-[48px] active:scale-95 transition-transform hover:shadow-md`}
              >
                <i className={`${action.icon} text-xl`}></i>
                <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Weather Summary */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className={`${weather.icon} text-2xl`}></i>
              <div>
                <h3 className="text-lg font-semibold">Weather Now</h3>
                <p className="text-blue-100 text-sm">{weather.condition}</p>
              </div>
            </div>
            <span className="text-3xl font-bold">{weather.temp}°C</span>
          </div>
          <div className="px-5 py-4 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <i className="fas fa-droplet text-blue-400"></i>
              <span>Humidity: <strong>{weather.humidity}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-wind text-blue-400"></i>
              <span>Wind: <strong>12 km/h</strong></span>
            </div>
            <button
              onClick={() => goToSection(Section.WEATHER)}
              className="ml-auto text-blue-600 font-medium text-sm hover:underline"
            >
              Details →
            </button>
          </div>
        </section>

        {/* Mandi Prices */}
        <section className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-store text-teal-500 mr-2"></i>Mandi Prices Today
            </h2>
            <button
              onClick={() => goToSection(Section.MANDI)}
              className="text-teal-600 text-sm font-medium hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Crop</th>
                  <th className="pb-2 font-medium text-right">Price</th>
                  <th className="pb-2 font-medium text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {MANDI_PRICES.map((item) => (
                  <tr key={item.crop} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      <i className={`${item.icon} text-gray-400`}></i>
                      <span className="font-medium text-gray-800">{item.crop}</span>
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-800">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.change >= 0
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        <i className={`fas ${item.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} text-[10px]`}></i>
                        {Math.abs(item.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Govt Schemes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-landmark text-indigo-500 mr-2"></i>Government Schemes
            </h2>
            <button
              onClick={() => goToSection(Section.SCHEMES)}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {SCHEMES.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                      <i className={`${s.icon} text-indigo-600 text-sm`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{s.name}</h3>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.statusColor}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Farm Health + Tips Row */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Farm Health Score */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-heart-pulse text-red-400 mr-2"></i>Farm Health Score
            </h2>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
              <CircularProgress score={farmHealth} />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-gray-600">Soil moisture: <strong className="text-gray-800">Optimal</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="text-gray-600">Pest risk: <strong className="text-gray-800">Low</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-gray-600">Nutrient level: <strong className="text-gray-800">Good</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="text-gray-600">Irrigation: <strong className="text-gray-800">On Schedule</strong></span>
                </div>
              </div>
            </div>
          </section>

          {/* Weather-based Tips */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-lightbulb text-amber-500 mr-2"></i>Weather-based Tips
            </h2>
            <div className="space-y-3">
              {FARMING_TIPS.map((t, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl ${t.bg} p-3`}>
                  <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <i className={`${t.icon} ${t.color} text-sm`}></i>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{t.tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Activity Timeline */}
        <section className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-clock-rotate-left text-gray-400 mr-2"></i>Recent Activity
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
            <div className="space-y-5">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 z-10`}>
                    <i className={`${a.icon} ${a.color} text-xs`}></i>
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default FarmerDashboard;
