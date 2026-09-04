import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import CommunityEquipment from '../equipment/CommunityEquipment';

const EquipmentPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-xs"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-bold text-teal-700 bg-teal-100/80 px-3 py-1 rounded-full border border-teal-200">
          <i className="fas fa-tractor mr-1.5"></i> Farm Equipment Sharing
        </span>
      </div>
    </div>
    <CommunityEquipment />
  </div>
);

export default EquipmentPage;
