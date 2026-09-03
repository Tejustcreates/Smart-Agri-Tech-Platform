import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

const DEMO = {
  weather: { temp: '28°C', cond: 'Partly Cloudy, Rain expected' },
  cropTip: 'Sow Rice after the first good rain for best yield',
  mandi: { crop: 'Onion', price: '₹1,950/quintal', mandi: 'Nashik APMC', best: true },
  scheme: { name: 'PM-KISAN', benefit: '₹6,000/year income support' },
  news: { title: 'Wheat MSP raised to ₹2,350/quintal for Rabi season' },
};

export default function DashboardPreview() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const card = 'bg-white rounded-2xl p-4 border border-gray-100 hover-lift';
  const iconWrap = 'w-9 h-9 rounded-xl flex items-center justify-center';

  return (
    <section id="dashboard" className="py-14 bg-gradient-to-b from-emerald-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-3">
            <i className="fas fa-chart-line text-[11px]"></i> {t('nav.dashboard')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {user ? `Namaste, ${user.name.split(' ')[0]} 👋` : t('dashboard.title', 'Your Farming Command Center')}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {user ? t('dashboard.personalized', 'Here is your personalized snapshot') : t('dashboard.preview', 'A quick glance at everything GrowSmart brings together')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Weather */}
          <ScrollReveal delay={0}>
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${iconWrap} bg-sky-100`}><i className="fas fa-cloud-sun text-sky-600"></i></div>
                <span className="text-sm font-semibold text-gray-700">{t('nav.weather')}</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{DEMO.weather.temp}</p>
              <p className="text-xs text-gray-500 mt-1">{DEMO.weather.cond}</p>
            </div>
          </ScrollReveal>

          {/* Crop tip */}
          <ScrollReveal delay={60}>
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${iconWrap} bg-emerald-100`}><i className="fas fa-seedling text-emerald-600"></i></div>
                <span className="text-sm font-semibold text-gray-700">{t('nav.crops')}</span>
              </div>
              <p className="text-sm text-gray-700 leading-snug">{DEMO.cropTip}</p>
            </div>
          </ScrollReveal>

          {/* Mandi alert */}
          <ScrollReveal delay={120}>
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${iconWrap} bg-amber-100`}><i className="fas fa-store text-amber-600"></i></div>
                <span className="text-sm font-semibold text-gray-700">{t('nav.mandi')}</span>
              </div>
              <p className="text-lg font-black text-gray-900">{DEMO.mandi.price}</p>
              <p className="text-xs text-gray-500">{DEMO.mandi.crop} · {DEMO.mandi.mandi}</p>
              {DEMO.mandi.best && (
                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <i className="fas fa-thumbs-up"></i> Best price
                </span>
              )}
            </div>
          </ScrollReveal>

          {/* Scheme match */}
          <ScrollReveal delay={180}>
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${iconWrap} bg-violet-100`}><i className="fas fa-landmark text-violet-600"></i></div>
                <span className="text-sm font-semibold text-gray-700">{t('nav.schemes')}</span>
              </div>
              <p className="text-base font-bold text-gray-900">{DEMO.scheme.name}</p>
              <p className="text-xs text-gray-500 mt-1">{DEMO.scheme.benefit}</p>
            </div>
          </ScrollReveal>

          {/* News */}
          <ScrollReveal delay={240}>
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${iconWrap} bg-teal-100`}><i className="fas fa-newspaper text-teal-600"></i></div>
                <span className="text-sm font-semibold text-gray-700">{t('nav.news')}</span>
              </div>
              <p className="text-sm text-gray-700 leading-snug">{DEMO.news.title}</p>
            </div>
          </ScrollReveal>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => { if (user) window.location.href = '/dashboard'; }}
            disabled={!user}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              user ? 'bg-agri-green hover:bg-agri-dark text-white shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-arrow-right"></i>
            {user ? t('dashboard.open', 'Open Full Dashboard') : t('dashboard.loginToView', 'Login to see your dashboard')}
          </button>
        </div>
      </div>
    </section>
  );
}
