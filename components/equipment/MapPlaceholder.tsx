import React from 'react';
import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  listings: { id: string; name: string; lat: number; lng: number; distance: number; verified: boolean }[];
  userLat: number;
  userLng: number;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ listings }) => {
  return (
    <div className="bg-gradient-to-br from-brand-50 to-emerald-50 rounded-2xl border border-brand-100 mb-6 overflow-hidden relative">
      {/* Static illustration */}
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
          <MapPin size={28} className="text-brand-600" />
        </div>
        <h4 className="text-sm font-bold text-gray-700 mb-1">Map View Coming Soon</h4>
        <p className="text-xs text-gray-500 max-w-xs">
          Showing {listings.length} equipment in list view below. Interactive map with directions will be available in a future update.
        </p>
      </div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#173404 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
    </div>
  );
};

export default MapPlaceholder;
