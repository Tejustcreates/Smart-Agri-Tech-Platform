import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudSun } from 'lucide-react';
import { ROUTES } from '../../constants';
import Weather from '../Weather';

const WeatherPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-xs"
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200">
          <CloudSun size={13} /> Weather & Rain Intelligence
        </span>
      </div>
    </div>
    <Weather />
  </div>
);

export default WeatherPage;
