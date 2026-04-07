
import React from 'react';
import { Section } from '../types';

interface HeroProps {
  onKnowMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onKnowMore }) => {
  return (
    <section id={Section.HERO} className="relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')" }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-wider mb-4 animate-fade-in-down">
          Single App For <br /> All Your Needs
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-green-400 mb-8 animate-fade-in-up">
          GROWSMART
        </h2>
        <button
          onClick={onKnowMore}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider transition-transform transform hover:scale-105 duration-300"
        >
          Know More
        </button>
      </div>
    </section>
  );
};

export default Hero;