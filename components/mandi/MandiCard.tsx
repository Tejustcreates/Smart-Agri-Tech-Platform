import React from 'react';
import { MapPin, Navigation, TrendingUp, Package } from 'lucide-react';
import { NearbyMandi } from '../../types/mandi';

interface MandiCardProps {
  mandi: NearbyMandi;
  sortBy: string;
}

const MandiCard: React.FC<MandiCardProps> = ({ mandi, sortBy }) => {
  const netPrice = mandi.todayPrice - mandi.transportCost;
  const profitVsAvg = netPrice - mandi.averagePrice;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-800 group-hover:text-brand-700 transition-colors">
            {mandi.name}
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {mandi.district}, {mandi.state}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold">
          <Navigation size={11} />
          {mandi.distance} km
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-brand-50 rounded-xl p-3">
          <p className="text-[10px] text-brand-600 font-semibold uppercase">Today's Price</p>
          <p className="text-lg font-bold text-brand-700">₹{mandi.todayPrice.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-500 font-semibold uppercase">Avg Price</p>
          <p className="text-lg font-bold text-gray-700">₹{mandi.averagePrice.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Package size={12} className="text-gray-400" />
          {mandi.arrivalQty} Quintals
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp size={12} className="text-gray-400" />
          Net: ₹{netPrice.toLocaleString()}
        </span>
      </div>

      <div className={`flex items-center justify-between p-2.5 rounded-xl ${
        profitVsAvg >= 0 ? 'bg-emerald-50' : 'bg-red-50'
      }`}>
        <span className="text-xs font-medium text-gray-600">Transport Cost</span>
        <span className="text-xs font-bold text-gray-700">₹{mandi.transportCost}</span>
      </div>

      <div className={`mt-2 flex items-center justify-between p-2.5 rounded-xl ${
        profitVsAvg >= 0 ? 'bg-emerald-100' : 'bg-red-100'
      }`}>
        <span className="text-xs font-semibold text-gray-700">Potential Profit</span>
        <span className={`text-sm font-bold ${profitVsAvg >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
          {profitVsAvg >= 0 ? '+' : ''}₹{profitVsAvg.toLocaleString()}/qtl
        </span>
      </div>
    </div>
  );
};

export default MandiCard;
