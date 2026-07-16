import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import DiseaseDetection from '../DiseaseDetection';

const DiseasePage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
        <i className="fas fa-arrow-left"></i> Back to Home
      </Link>
    </div>
    <DiseaseDetection />
  </div>
);

export default DiseasePage;
