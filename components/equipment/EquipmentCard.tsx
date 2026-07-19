import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Phone, MessageCircle, Eye, MapPin, Fuel, UserCheck, Zap, Tag, Clock, Navigation, ExternalLink } from 'lucide-react';
import { EquipmentListing } from '../../types/equipment';

interface EquipmentCardProps {
  listing: EquipmentListing;
  onViewDetails: (l: EquipmentListing) => void;
  index: number;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ listing, onViewDetails, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.verified && (
            <span className="flex items-center gap-1 bg-brand-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
              <Shield size={9} /> Verified
            </span>
          )}
          {listing.featured && (
            <span className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
              <Zap size={9} /> Featured
            </span>
          )}
          {listing.recentlyAdded && (
            <span className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
              <Clock size={9} /> New
            </span>
          )}
          {listing.lowPrice && (
            <span className="flex items-center gap-1 bg-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
              <Tag size={9} /> Low Price
            </span>
          )}
        </div>
        {/* Match Score */}
        <div className="absolute top-3 right-3 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow">
          <span className="text-xs font-extrabold text-brand-700">{listing.matchScore}%</span>
        </div>
        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow">
          <span className="text-sm font-extrabold text-brand-700">₹{listing.pricePerDay.toLocaleString()}</span>
          <span className="text-[10px] text-gray-500">/day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-800 truncate group-hover:text-brand-700 transition-colors">
              {listing.name}
            </h3>
            <p className="text-xs text-gray-400">{listing.brand} • {listing.horsepower} HP • {listing.year}</p>
          </div>
          <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">{listing.rating}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{listing.description}</p>

        {/* Location & Distance */}
        <div className="bg-brand-50 rounded-xl px-3 py-2.5 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={12} className="text-brand-600" />
              <span className="text-sm font-bold text-brand-700">{listing.distance} KM Away</span>
            </div>
            <span className="text-[10px] text-brand-600 font-medium">~{listing.travelTime}</span>
          </div>
          <p className="text-[10px] text-brand-600 mt-1 flex items-center gap-1">
            <MapPin size={9} /> Near {listing.village}
          </p>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {listing.operatorIncluded && <span className="flex items-center gap-1 text-brand-600"><UserCheck size={11} /> Operator</span>}
          {listing.fuelIncluded && <span className="flex items-center gap-1 text-blue-600"><Fuel size={11} /> Fuel</span>}
        </div>

        {/* Condition & Deposit */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            listing.condition === 'Excellent' ? 'bg-emerald-50 text-emerald-700' :
            listing.condition === 'Good' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
          }`}>{listing.condition}</span>
          <span className="text-[10px] text-gray-400">Deposit: ₹{listing.deposit.toLocaleString()}</span>
        </div>

        {/* Action Buttons — Call is primary, large */}
        <div className="flex gap-2">
          <a
            href={`tel:${listing.ownerPhone}`}
            className="tap-target flex-[2] py-3 bg-brand-600 text-white rounded-xl text-sm font-bold text-center hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-200 active:scale-[0.98]"
          >
            <Phone size={16} /> Call Owner
          </a>
          <a
            href={`https://wa.me/${listing.ownerPhone.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target flex-1 py-3 bg-emerald-500 text-white rounded-xl text-xs font-semibold text-center hover:bg-emerald-600 transition-all flex items-center justify-center gap-1"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target py-3 px-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-all flex items-center justify-center"
            title="Open in Google Maps"
          >
            <ExternalLink size={12} />
          </a>
          <button
            onClick={() => onViewDetails(listing)}
            className="tap-target py-3 px-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-all flex items-center justify-center"
          >
            <Eye size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EquipmentCard;
