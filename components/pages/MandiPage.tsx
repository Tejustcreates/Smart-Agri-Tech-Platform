import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ROUTES } from '../../constants';
import Mandi from '../Mandi';

interface MandiPageProps {
  onAddToCart: (product: Product, type: any) => void;
}

const MandiPage: React.FC<MandiPageProps> = ({ onAddToCart }) => (
  <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
        <i className="fas fa-arrow-left"></i> Back to Home
      </Link>
    </div>
    <Mandi onAddToCart={onAddToCart} />
  </div>
);

export default MandiPage;
