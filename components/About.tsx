
import React from 'react';
import { Section } from '../types';

const features = [
  { icon: 'fas fa-cloud-sun', title: 'Weather Intelligence', desc: 'Real-time forecasts with ML-powered rain predictions' },
  { icon: 'fas fa-leaf', title: 'Crop Advisor', desc: 'AI recommends best crops based on soil, season & weather' },
  { icon: 'fas fa-bug', title: 'Disease Detection', desc: 'Symptom-based diagnosis with expert treatment advice' },
  { icon: 'fas fa-store', title: 'Smart Mandi', desc: 'Live market prices and direct buyer-seller connection' },
  { icon: 'fas fa-landmark', title: 'Govt Schemes', desc: 'Personalized recommendations for farmer welfare schemes' },
  { icon: 'fas fa-tractor', title: 'Equipment Rental', desc: 'Find and rent farming equipment near you' },
];

const About: React.FC = () => {
  return (
    <section id={Section.ABOUT} className="py-16 md:py-24 bg-gradient-to-b from-green-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <i className="fas fa-leaf text-xs"></i>
            About GROWSMART
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Empowering Indian Farmers with <span className="text-green-600">Smart Technology</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            GROWSMART is a complete digital platform helping farmers with weather details, crop disease detection, market access, and government schemes — all in one place.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
                <i className={`${f.icon} text-green-600 text-xl group-hover:text-white transition-colors duration-300`}></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <i className="fas fa-seedling text-4xl text-green-200 mb-4"></i>
          <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
          <p className="text-green-100 max-w-xl mx-auto leading-relaxed">
            To bridge the gap between technology and agriculture, making smart farming tools accessible to every Indian farmer — for free.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
