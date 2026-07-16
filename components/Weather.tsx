import React from 'react';
import { Section } from '../types';
import WeatherDashboard from './weather/WeatherDashboard';

const Weather: React.FC = () => {
  return (
    <section id={Section.WEATHER} className="snap-section min-h-screen flex flex-col justify-center items-center border-t border-gray-100 bg-gradient-to-b from-blue-50/40 via-white to-gray-50/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <WeatherDashboard />
      </div>
    </section>
  );
};

export default Weather;
