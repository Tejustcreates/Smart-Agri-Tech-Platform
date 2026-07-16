import React from 'react';
import { MapPin } from 'lucide-react';
import { EquipmentListing } from '../../types/equipment';

interface MapPlaceholderProps {
  listings: EquipmentListing[];
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ listings }) => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 h-48 sm:h-64 mb-6 overflow-hidden relative">
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

    {/* Markers */}
    {listings.slice(0, 6).map((l, i) => {
      const x = 15 + (i % 3) * 30;
      const y = 20 + Math.floor(i / 3) * 40;
      return (
        <div
          key={l.id}
          className="absolute flex flex-col items-center"
          style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${l.verified ? 'bg-green-500' : 'bg-orange-500'}`}>
            <MapPin size={12} className="text-white" />
          </div>
          <span className="mt-1 text-[9px] font-bold text-gray-700 bg-white/80 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
            {l.name.split(' ')[0]} • ₹{l.pricePerDay.toLocaleString()}
          </span>
        </div>
      );
    })}

    {/* Center label */}
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-xs font-semibold text-gray-600">
      📍 {listings.length} equipment nearby — Map integration coming soon
    </div>
  </div>
);

export default MapPlaceholder;
