import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { EquipmentListing } from '../../types/equipment';

interface MapPlaceholderProps {
  listings: EquipmentListing[];
  userLat: number;
  userLng: number;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ listings, userLat, userLng }) => {
  // Calculate relative positions for markers
  const allLats = [userLat, ...listings.map((l) => l.lat)];
  const allLngs = [userLng, ...listings.map((l) => l.lng)];
  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);
  const latRange = Math.max(maxLat - minLat, 0.5);
  const lngRange = Math.max(maxLng - minLng, 0.5);

  const getPos = (lat: number, lng: number) => ({
    x: ((lng - minLng) / lngRange) * 80 + 10,
    y: ((maxLat - lat) / latRange) * 80 + 10,
  });

  const userPos = getPos(userLat, userLng);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 h-48 sm:h-64 mb-6 overflow-hidden relative">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* User location marker */}
      {userLat !== 0 && userLng !== 0 && (
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{ left: `${userPos.x}%`, top: `${userPos.y}%`, transform: 'translate(-50%, -100%)' }}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Navigation size={14} className="text-white" />
          </div>
          <span className="mt-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
            You
          </span>
        </div>
      )}

      {/* Equipment markers */}
      {listings.slice(0, 8).map((l, i) => {
        const pos = getPos(l.lat, l.lng);
        return (
          <div
            key={l.id}
            className="absolute z-10 flex flex-col items-center"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${l.verified ? 'bg-green-500' : 'bg-orange-500'}`}>
              <MapPin size={12} className="text-white" />
            </div>
            <span className="mt-1 text-[8px] font-bold text-gray-700 bg-white/80 px-1 py-0.5 rounded shadow-sm whitespace-nowrap max-w-[80px] truncate">
              {l.distance} KM • {l.name.split(' ')[0]}
            </span>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow text-[10px] font-semibold text-gray-600 flex items-center gap-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" /> You</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Verified</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full" /> Other</span>
      </div>

      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow text-[10px] font-semibold text-gray-600">
        📍 {listings.length} equipment • Map integration coming soon
      </div>
    </div>
  );
};

export default MapPlaceholder;
