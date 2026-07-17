import React from 'react';
import { Section } from '../types';
import WeatherDashboard from './weather/WeatherDashboard';

const FloatingCloud: React.FC<{ className: string; delay: number }> = ({ className, delay }) => (
  <div
    className={`absolute opacity-20 pointer-events-none select-none ${className}`}
    style={{ animation: `floatCloud 20s ease-in-out ${delay}s infinite alternate` }}
  >
    ☁️
  </div>
);

const Weather: React.FC = () => {
  return (
    <section
      id={Section.WEATHER}
      className="snap-section min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 25%, #ffffff 50%, #f0fdf4 80%, #ecfdf5 100%)' }}
    >
      {/* Floating Clouds */}
      <FloatingCloud className="text-5xl top-[8%] left-[5%]" delay={0} />
      <FloatingCloud className="text-3xl top-[15%] right-[10%]" delay={3} />
      <FloatingCloud className="text-4xl top-[5%] left-[60%]" delay={6} />
      <FloatingCloud className="text-2xl top-[20%] left-[25%]" delay={9} />
      <FloatingCloud className="text-3xl top-[12%] right-[30%]" delay={12} />

      {/* Wave Divider Top */}
      <div className="w-full overflow-hidden leading-none relative z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20 sm:h-28" preserveAspectRatio="none">
          <path d="M0,60 C240,100 480,20 720,70 C960,120 1200,30 1440,60 L1440,0 L0,0 Z" fill="#f0fdf4" fillOpacity="0.6" />
          <path d="M0,40 C360,90 720,10 1080,50 C1260,70 1380,20 1440,40 L1440,0 L0,0 Z" fill="#f0fdf4" />
        </svg>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-14">
          <WeatherDashboard />
        </div>
      </div>

      {/* Wave Divider Bottom */}
      <div className="w-full overflow-hidden leading-none rotate-180 relative z-10">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-20" preserveAspectRatio="none">
          <path d="M0,30 C480,80 960,0 1440,40 L1440,0 L0,0 Z" fill="#f0fdf4" fillOpacity="0.6" />
          <path d="M0,50 C360,10 720,80 1080,30 C1260,10 1380,50 1440,50 L1440,0 L0,0 Z" fill="#f0fdf4" />
        </svg>
      </div>
    </section>
  );
};

export default Weather;
