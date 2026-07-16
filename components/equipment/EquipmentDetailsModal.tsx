import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Star, Shield, MapPin, Calendar, Fuel, UserCheck, IndianRupee, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { EquipmentListing } from '../../types/equipment';

interface EquipmentDetailsModalProps {
  listing: EquipmentListing | null;
  onClose: () => void;
}

const conditionColor = (c: string) => {
  if (c === 'Excellent') return 'bg-emerald-100 text-emerald-700';
  if (c === 'Good') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};

const EquipmentDetailsModal: React.FC<EquipmentDetailsModalProps> = ({ listing, onClose }) => {
  const [imgIdx, setImgIdx] = React.useState(0);
  if (!listing) return null;
  const imgs = listing.images.length ? listing.images : [listing.image];

  return (
    <AnimatePresence>
      {listing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Image Gallery */}
            <div className="relative bg-gray-100 rounded-t-2xl overflow-hidden">
              <img src={imgs[imgIdx]} alt={listing.name} className="w-full h-64 object-cover" />
              {imgs.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setImgIdx((i) => (i + 1) % imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white">
                <X size={16} />
              </button>
              {listing.verified && (
                <span className="absolute top-3 left-3 flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                  <Shield size={10} /> Verified Owner
                </span>
              )}
            </div>

            <div className="px-6 py-5">
              {/* Title */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-800">{listing.name}</h2>
                  <p className="text-sm text-gray-400">{listing.brand} {listing.model} • {listing.horsepower} HP • {listing.year}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{listing.rating}</span>
                  <span className="text-xs text-gray-400">({listing.reviewCount})</span>
                </div>
              </div>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${conditionColor(listing.condition)}`}>{listing.condition}</span>
                {listing.operatorIncluded && <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold flex items-center gap-1"><UserCheck size={10} /> Operator</span>}
                {listing.fuelIncluded && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold flex items-center gap-1"><Fuel size={10} /> Fuel Included</span>}
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold flex items-center gap-1"><Calendar size={10} /> Min {listing.minRental}</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <IndianRupee size={14} className="text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-extrabold text-green-700">₹{listing.pricePerDay.toLocaleString()}</p>
                  <p className="text-[10px] text-green-600">per day</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Hourly</p>
                  <p className="text-lg font-bold text-gray-700">₹{listing.pricePerHour}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Deposit</p>
                  <p className="text-lg font-bold text-gray-700">₹{listing.deposit.toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{listing.description}</p>

              {/* Owner & Location */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{listing.ownerName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {listing.village}, {listing.district} — {listing.distance} km away</p>
                  </div>
                  {listing.verified && <Shield size={18} className="text-green-500" />}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-green-50 rounded-xl h-32 mb-5 flex items-center justify-center">
                <p className="text-xs text-green-600 flex items-center gap-1"><MapPin size={12} /> Google Maps Preview — Coming Soon</p>
              </div>

              {/* Availability */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Availability This Week</p>
                <div className="flex gap-1.5">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => {
                    const full = d === 'mon' ? 'monday' : d === 'tue' ? 'tuesday' : d === 'wed' ? 'wednesday' : d === 'thu' ? 'thursday' : d === 'fri' ? 'friday' : d === 'sat' ? 'saturday' : 'sunday';
                    const avail = listing.availability.includes(full);
                    return (
                      <div key={d} className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase ${avail ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a href={`tel:${listing.ownerPhone}`} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-green-700 transition-all flex items-center justify-center gap-1.5">
                  <Phone size={14} /> Call Owner
                </a>
                <a href={`https://wa.me/${listing.ownerPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm text-center hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5">
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a href={`https://www.google.com/maps?q=${listing.lat},${listing.lng}`} target="_blank" rel="noopener noreferrer" className="py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all flex items-center gap-1.5">
                  <ExternalLink size={14} /> Map
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EquipmentDetailsModal;
