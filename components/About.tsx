
import React from 'react';
import { Section } from '../types';

const About: React.FC = () => {
  return (
    <section id={Section.ABOUT} className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src="https://picsum.photos/600/400?image=292" alt="Farming" className="rounded-lg shadow-2xl w-full" />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              About <span className="text-green-600">GROWSMART</span>
            </h2>
            <h3 className="text-xl font-semibold text-gray-600 mb-6">Complete Solution For Farmers</h3>
            <p className="text-gray-700 leading-relaxed">
              Growsmart is a web application for helping farmers with weather details, crop registration, and market access. It provides an online platform for registering crops, saving farmers time from visiting Agricultural Produce Market Committees (APMC) for registering crops and booking slots for selling. Growsmart helps you to know the weather parameters like temperature, wind speed, and humidity based on your city. This enables farmers to make better decisions for selecting crops for farming and managing water requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
