
import React from 'react';
import { Section } from '../types';

interface HeroProps {
  onKnowMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onKnowMore }) => {
  return (
    <section id={Section.HERO} className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden">
      {/* Background: farm landscape image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')" }}></div>
      {/* Green-tinted overlay for eco feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-900/80"></div>
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Eco badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in-down">
          <i className="fas fa-leaf text-green-300"></i>
          <span className="text-sm font-medium text-green-100">Eco-Friendly Smart Farming</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-down leading-tight">
          Everything a Farmer Needs
          <br />
          <span className="text-green-300">One Smart Platform</span>
        </h1>

        <p className="text-lg md:text-xl text-green-100/80 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed">
          Weather intelligence, crop disease detection, live mandi prices, and government schemes — empowering Indian farmers with technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <button
            onClick={onKnowMore}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 flex items-center justify-center gap-2"
          >
            <i className="fas fa-seedling"></i>
            Explore Features
          </button>
          <button
            onClick={() => {
              document.getElementById(Section.ABOUT)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <i className="fas fa-play-circle"></i>
            Learn More
          </button>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-green-300">10K+</p>
            <p className="text-xs md:text-sm text-green-100/70">Farmers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-green-300">50+</p>
            <p className="text-xs md:text-sm text-green-100/70">Districts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-green-300">100%</p>
            <p className="text-xs md:text-sm text-green-100/70">Free</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
