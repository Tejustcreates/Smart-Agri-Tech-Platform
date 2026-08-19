import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../../types';
import { ROUTES } from '../../constants';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

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

const PRICE_DATA = [
  { day: 'Mon', soybean: 4750, wheat: 2250, cotton: 6800 },
  { day: 'Tue', soybean: 4780, wheat: 2260, cotton: 6850 },
  { day: 'Wed', soybean: 4800, wheat: 2270, cotton: 6880 },
  { day: 'Thu', soybean: 4820, wheat: 2265, cotton: 6900 },
  { day: 'Fri', soybean: 4850, wheat: 2275, cotton: 6920 },
  { day: 'Sat', soybean: 4870, wheat: 2280, cotton: 6950 },
  { day: 'Sun', soybean: 4850, wheat: 2275, cotton: 6920 },
];

const RAIN_DATA = [
  { day: 'Mon', rainfall: 12 },
  { day: 'Tue', rainfall: 25 },
  { day: 'Wed', rainfall: 40 },
  { day: 'Thu', rainfall: 35 },
  { day: 'Fri', rainfall: 15 },
  { day: 'Sat', rainfall: 8 },
  { day: 'Sun', rainfall: 5 },
];

const SOIL_DATA = [
  { nutrient: 'Nitrogen', value: 80, full: 100 },
  { nutrient: 'Phosphorus', value: 65, full: 100 },
  { nutrient: 'Potassium', value: 70, full: 100 },
  { nutrient: 'pH Level', value: 75, full: 100 },
  { nutrient: 'Moisture', value: 85, full: 100 },
  { nutrient: 'Organic Matter', value: 60, full: 100 },
];

const ALERTS = [
  { icon: 'fas fa-cloud-showers-heavy', title: 'Heavy Rain Expected', desc: 'Rain expected tomorrow. Delay pesticide spray.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
  { icon: 'fas fa-chart-line', title: 'Soybean Price Up', desc: 'Soybean prices rose 3.5% at Nashik mandi today.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
  { icon: 'fas fa-bug', title: 'Blight Risk Detected', desc: 'High humidity may cause late blight in tomato/potato.', color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' },
  { icon: 'fas fa-landmark', title: 'PM-KISAN Installment', desc: '17th installment expected this week. Check status.', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-l-purple-500' },
  { icon: 'fas fa-wheat-awn', title: 'Rabi Sowing Window', desc: 'Optimal wheat sowing starts next week.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' },
];

const ACTIVITIES = [
  { text: 'Soil test report uploaded for Field #3', time: '2 hours ago', icon: 'fas fa-flask', color: 'text-emerald-600' },
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

const RECENT_NEWS = [
  { title: 'PM-KISAN 17th installment releasing soon', source: 'Krishi Jagran', time: '2h ago', icon: 'fas fa-landmark', color: 'text-emerald-600' },
  { title: 'Soybean prices surge across Maharashtra', source: 'Agri Market', time: '5h ago', icon: 'fas fa-chart-line', color: 'text-amber-600' },
  { title: 'New drone spraying technology for cotton', source: 'AgriTech India', time: '1d ago', icon: 'fas fa-robot', color: 'text-purple-600' },
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

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 9) return 'Kharif (Jun-Oct)';
  if (month >= 9 || month <= 2) return 'Rabi (Oct-Mar)';
  return 'Zaid (Mar-Jun)';
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
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const greeting = useMemo(() => getGreeting(), []);
  const today = useMemo(() => formatDate(), []);
  const currentSeason = useMemo(() => getCurrentSeason(), []);

  const goToSection = (sectionId: string) => {
    navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
  };

  const dismissAlert = (index: number) => {
    setDismissedAlerts((prev) => [...prev, index]);
  };

  const visibleAlerts = ALERTS.filter((_, i) => !dismissedAlerts.includes(i));

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{greeting}, Farmer!</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-emerald-100">
                <span>{today}</span>
                <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-3 py-0.5 text-xs font-medium">
                  <i className="fas fa-calendar-days text-[10px]"></i> {currentSeason}
                </span>
              </div>
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

        {/* QUICK ACTIONS */}
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

        {/* WIDGET GRID */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Widget 1: Weather Summary */}
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fas fa-cloud-sun text-2xl"></i>
                <div>
                  <h3 className="text-lg font-semibold">Weather Now</h3>
                  <p className="text-blue-100 text-sm">Partly Cloudy</p>
                </div>
              </div>
              <span className="text-3xl font-bold">34°C</span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <i className="fas fa-droplet text-blue-400"></i>
                  <span>Humidity: <strong>68%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-wind text-blue-400"></i>
                  <span>Wind: <strong>12 km/h</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-cloud-rain text-blue-400"></i>
                  <span>Rain: <strong>40%</strong></span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-sm text-blue-700">
                  <i className="fas fa-seedling mr-1"></i>
                  <strong>Farming Advisory:</strong> Good day for field work. Delay irrigation if rain expected.
                </p>
              </div>
              <button
                onClick={() => goToSection(Section.WEATHER)}
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Details →
              </button>
            </div>
          </section>

          {/* Widget 2: Mandi Price Alert */}
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4 text-white">
              <h3 className="text-lg font-semibold">
                <i className="fas fa-store mr-2"></i>Mandi Price Alert
              </h3>
              <p className="text-teal-100 text-sm">Top crops today</p>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-3">
                {MANDI_PRICES.map((item) => (
                  <div key={item.crop} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <i className={`${item.icon} text-gray-400`}></i>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.crop}</p>
                        <p className="text-xs text-gray-400">{item.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{item.price.toLocaleString('en-IN')}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        item.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <i className={`fas ${item.change >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px]`}></i>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => goToSection(Section.MANDI)}
                className="mt-3 w-full text-center text-teal-600 text-sm font-medium hover:underline"
              >
                View All Mandi Prices →
              </button>
            </div>
          </section>

          {/* Widget 3: Govt Schemes */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-landmark text-indigo-500 mr-2"></i>Government Schemes
            </h3>
            <div className="space-y-3">
              {SCHEMES.map((s) => (
                <div key={s.name} className="bg-gray-50 rounded-xl p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <i className={`${s.icon} text-indigo-600 text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{s.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${s.statusColor}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => goToSection(Section.SCHEMES)}
              className="mt-3 w-full text-center text-indigo-600 text-sm font-medium hover:underline"
            >
              View All Schemes →
            </button>
          </section>

          {/* Widget 4: Farm Health Score */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-heart-pulse text-red-400 mr-2"></i>Farm Health Score
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
              <CircularProgress score={82} />
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
        </div>

        {/* CHARTS SECTION */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Chart 1: Weekly Mandi Price Trend */}
          <section className="bg-white rounded-2xl shadow-sm p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-chart-line text-emerald-500 mr-2"></i>Weekly Mandi Price Trend
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PRICE_DATA}>
                  <defs>
                    <linearGradient id="gradSoybean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradWheat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCotton" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="soybean" stroke="#10b981" fill="url(#gradSoybean)" strokeWidth={2} name="Soybean" />
                  <Area type="monotone" dataKey="wheat" stroke="#f59e0b" fill="url(#gradWheat)" strokeWidth={2} name="Wheat" />
                  <Area type="monotone" dataKey="cotton" stroke="#8b5cf6" fill="url(#gradCotton)" strokeWidth={2} name="Cotton" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Chart 2: Rainfall Forecast */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-cloud-rain text-blue-500 mr-2"></i>Rainfall Forecast
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RAIN_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" unit=" mm" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value} mm`, 'Rainfall']}
                  />
                  <Bar dataKey="rainfall" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Chart 3: Soil Nutrient Radar */}
        <section className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-flask text-emerald-500 mr-2"></i>Soil Nutrient Analysis
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SOIL_DATA} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Full" dataKey="full" stroke="#e5e7eb" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
                <Radar name="Current" dataKey="value" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ALERTS PANEL */}
        {visibleAlerts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              <i className="fas fa-bell text-amber-500 mr-2"></i>Alerts & Notifications
            </h2>
            <div className="space-y-2">
              {ALERTS.map((alert, i) => (
                <div
                  key={i}
                  className={`${alert.bg} ${alert.border} border-l-4 rounded-xl p-4 flex items-start gap-3`}
                >
                  <i className={`${alert.icon} ${alert.color} text-lg mt-0.5`}></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{alert.desc}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(i)}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <i className="fas fa-xmark text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM GRID: Activity + Tips + News */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Recent Activity Timeline */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-clock-rotate-left text-gray-400 mr-2"></i>Recent Activity
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 border-l-2 border-dotted border-gray-200"></div>
              <div className="space-y-5">
                {ACTIVITIES.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 z-10">
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

          {/* Weather-based Tips */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-lightbulb text-amber-500 mr-2"></i>Weather-based Tips
            </h3>
            <div className="space-y-3">
              {FARMING_TIPS.map((t, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl ${t.bg} p-3`}>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className={`${t.icon} ${t.color} text-sm`}></i>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{t.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent News */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-newspaper text-gray-400 mr-2"></i>Recent News
            </h3>
            <div className="space-y-3">
              {RECENT_NEWS.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className={`${item.icon} ${item.color} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{item.source}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* EXPORT BUTTON */}
        <section className="text-center">
          <button
            onClick={() => toast.success('Dashboard report exported!')}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-6 py-3 text-sm transition-colors shadow-sm"
          >
            <i className="fas fa-file-export"></i> Export Dashboard Data
          </button>
        </section>

      </div>
    </div>
  );
};

export default FarmerDashboard;
