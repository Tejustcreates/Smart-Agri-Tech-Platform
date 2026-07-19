import React from 'react';
import { Section } from '../types';
import WeatherDashboard from './weather/WeatherDashboard';

const Weather: React.FC = () => {
  return (
    <section
      id={Section.WEATHER}
      className="snap-section min-h-screen flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-brand-50"
    >
      <div className="w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-14">
          <WeatherDashboard />
        </div>
      </div>
    </section>
  );
};

export default Weather;
