import React from 'react';
import { Section } from '../types';
import WeatherDashboard from './weather/WeatherDashboard';

const Weather: React.FC = () => {
  return (
    <section
      id={Section.WEATHER}
      className="snap-section min-h-screen flex flex-col items-center border-t border-gray-100 relative"
    >
      {/* Wave Divider Top */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-20" preserveAspectRatio="none">
          <path d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,20 1440,40 L1440,0 L0,0 Z" fill="#f0fdf4" />
        </svg>
      </div>

      <div className="w-full flex-1 bg-gradient-to-b from-sky-50/50 via-white to-green-50/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <WeatherDashboard />
        </div>
      </div>

      {/* Wave Divider Bottom */}
      <div className="w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16" preserveAspectRatio="none">
          <path d="M0,30 C480,80 960,0 1440,40 L1440,0 L0,0 Z" fill="#f0fdf4" />
        </svg>
      </div>
    </section>
  );
};

export default Weather;
