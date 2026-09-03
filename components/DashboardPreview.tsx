import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

const DEMO = {
  weather: { temp: '28°C', cond: 'Sunny, 15% Rain Chance', advice: 'Good day for spraying' },
  cropTip: { crop: 'Rabi Wheat', tip: 'Optimal sowing window begins next week. Prepare field with NPK 12:32:16.' },
  mandi: { crop: 'Onion', price: '₹1,950/q', mandi: 'Nashik APMC', change: '+3.2%', best: true },
  scheme: { name: 'PM-KISAN', benefit: '₹6,000/yr Direct Support', status: 'Eligible' },
  news: { title: 'Wheat MSP raised to ₹2,350/quintal for upcoming Rabi procurement season' },
};

export default function DashboardPreview() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const iconWrap = 'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base shadow-sm';

  return (
    <section id="dashboard" className="py-14 bg-gradient-to-b from-[#f4f7f2] via-white to-[#f8faf6] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 rounded-full px-4 py-1 text-xs font-bold mb-3">
            <i className="fas fa-chart-pie text-emerald-600"></i>
            <span>Farmer Daily Briefing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {user ? `Namaste, ${user.name.split(' ')[0]} 👋` : 'Daily Agricultural Snapshot'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            {user ? 'Your real-time personalized field conditions and market updates' : 'A quick glance at essential parameters curated for Indian farms today'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Weather */}
          <ScrollReveal delay={0}>
            <div className="farmer-card p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${iconWrap} bg-sky-100 text-sky-600`}>
                    <i className="fas fa-cloud-sun"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                    Live
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900">{DEMO.weather.temp}</div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">{DEMO.weather.cond}</div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <i className="fas fa-circle-check text-emerald-500"></i>
                <span>{DEMO.weather.advice}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Crop tip */}
          <ScrollReveal delay={60}>
            <div className="farmer-card p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${iconWrap} bg-emerald-100 text-emerald-600`}>
                    <i className="fas fa-seedling"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {DEMO.cropTip.crop}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1">Seasonal Advisory</div>
                <p className="text-xs text-slate-600 leading-relaxed">{DEMO.cropTip.tip}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
                <span>View Full Crop Plan →</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Mandi alert */}
          <ScrollReveal delay={120}>
            <div className="farmer-card p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${iconWrap} bg-amber-100 text-amber-600`}>
                    <i className="fas fa-store"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {DEMO.mandi.change}
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">{DEMO.mandi.price}</div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">{DEMO.mandi.crop} · {DEMO.mandi.mandi}</div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <i className="fas fa-trophy text-amber-500"></i>
                <span>Top Regional Price</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Scheme match */}
          <ScrollReveal delay={180}>
            <div className="farmer-card p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${iconWrap} bg-violet-100 text-violet-600`}>
                    <i className="fas fa-landmark"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
                    {DEMO.scheme.status}
                  </span>
                </div>
                <div className="text-base font-black text-slate-900">{DEMO.scheme.name}</div>
                <p className="text-xs text-slate-600 mt-1">{DEMO.scheme.benefit}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-violet-700">
                <span>Check Eligibility →</span>
              </div>
            </div>
          </ScrollReveal>

          {/* News */}
          <ScrollReveal delay={240}>
            <div className="farmer-card p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${iconWrap} bg-teal-100 text-teal-600`}>
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Policy Update
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-3">{DEMO.news.title}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-teal-700">
                <span>Read Full Article →</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="btn-modern inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
          >
            <i className={user ? 'fas fa-chart-line' : 'fas fa-arrow-right-to-bracket'}></i>
            <span>{user ? 'Open Farmer Command Dashboard' : 'Login to Access Personalized Farmer Dashboard'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
