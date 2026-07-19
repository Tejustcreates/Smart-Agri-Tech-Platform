import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Wrench, IndianRupee, Calendar, Upload, Loader2, Fuel, UserCheck, Navigation, RefreshCw } from 'lucide-react';
import { RegistrationForm, EquipmentCategory, EquipmentCondition, GpsLocation } from '../../types/equipment';
import { registerEquipment, reverseGeocode } from '../../services/equipment/equipmentService';
import RegistrationSuccess from './RegistrationSuccess';

const CATEGORIES: EquipmentCategory[] = ['Tractor', 'Harvester', 'Rotavator', 'Seeder', 'Sprayer', 'Cultivator', 'Thresher', 'Plough', 'Others'];
const CONDITIONS: EquipmentCondition[] = ['Excellent', 'Good', 'Average'];

const INITIAL_FORM: RegistrationForm = {
  ownerName: '', phone: '', lat: 0, lng: 0, fullAddress: '', village: '', pincode: '',
  equipmentName: '', category: '', brand: '', model: '', horsepower: '', year: '', condition: '',
  coverPhoto: '', additionalPhotos: [], pricePerHour: '', pricePerDay: '', deposit: '',
  fuelIncluded: false, operatorIncluded: false, minRental: '', workingRadius: 20, description: '',
};

const RegisterEquipment: React.FC = () => {
  const [form, setForm] = useState<RegistrationForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [locationInfo, setLocationInfo] = useState<GpsLocation | null>(null);

  const update = <K extends keyof RegistrationForm>(key: K, val: RegistrationForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { setGpsStatus('denied'); return; }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        update('lat', lat);
        update('lng', lng);
        const geo = await reverseGeocode(lat, lng);
        setLocationInfo(geo);
        update('village', geo.village);
        update('fullAddress', geo.address);
        update('pincode', geo.pincode);
        setGpsStatus('granted');
      },
      () => setGpsStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => { detectLocation(); }, []);

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const lat = Math.round((19.5 - y * 5) * 1000) / 1000;
    const lng = Math.round((73.0 + x * 5) * 1000) / 1000;
    update('lat', lat);
    update('lng', lng);
    const geo = await reverseGeocode(lat, lng);
    setLocationInfo(geo);
    update('village', geo.village);
    update('fullAddress', geo.address);
    update('pincode', geo.pincode);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerEquipment(form);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) return <RegistrationSuccess onDone={() => { setSuccess(false); setForm(INITIAL_FORM); setGpsStatus('idle'); }} />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Owner Details */}
        <SectionHeader icon={<User size={18} />} title="Owner Details" color="bg-brand-50 text-brand-600" />
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input icon={<User size={14} />} label="Full Name *" value={form.ownerName} onChange={(v) => update('ownerName', v)} placeholder="e.g. Rajesh Patil" />
          <Input icon={<Phone size={14} />} label="Mobile Number *" value={form.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" type="tel" />
        </div>

        {/* GPS Location */}
        <SectionHeader icon={<MapPin size={18} />} title="Equipment Location" color="bg-blue-50 text-blue-600" />
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={detectLocation}
              disabled={gpsStatus === 'loading'}
              className="tap-target flex items-center gap-1.5 px-3 py-2 bg-brand-50 text-brand-700 rounded-xl text-xs font-semibold hover:bg-brand-100 transition-all"
            >
              {gpsStatus === 'loading' ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
              {gpsStatus === 'loading' ? 'Detecting GPS...' : 'Auto-Detect My Location'}
            </button>
            <button
              onClick={detectLocation}
              className="tap-target flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-all"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>

          {locationInfo && (
            <div className="bg-brand-50 rounded-xl px-4 py-3 mb-3">
              <p className="text-sm font-bold text-brand-700">{locationInfo.village || 'Location Detected'}</p>
              <p className="text-xs text-brand-600 line-clamp-1">{locationInfo.address}</p>
              <p className="text-[10px] text-brand-500 mt-1">Lat: {form.lat.toFixed(4)}, Lng: {form.lng.toFixed(4)} {locationInfo.pincode && `• PIN: ${locationInfo.pincode}`}</p>
            </div>
          )}

          {/* Map with clickable marker */}
          <div
            onClick={handleMapClick}
            className="bg-gradient-to-br from-brand-50 to-emerald-50 rounded-xl border border-brand-100 h-40 overflow-hidden relative cursor-crosshair"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#173404 1px, transparent 1px), linear-gradient(90deg, #173404 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            {form.lat !== 0 && form.lng !== 0 && (
              <div
                className="absolute z-10"
                style={{ left: `${((form.lng - 73) / 5) * 100}%`, top: `${((19.5 - form.lat) / 5) * 100}%`, transform: 'translate(-50%, -100%)', cursor: 'grab' }}
              >
                <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin size={14} className="text-white" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-[10px] font-semibold text-gray-600 shadow">
              Click map to adjust location — drag pin to fine-tune
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Input label="Village" value={form.village} onChange={(v) => update('village', v)} placeholder="Auto-detected" />
            <Input label="Pincode" value={form.pincode} onChange={(v) => update('pincode', v)} placeholder="Auto-detected" />
          </div>
        </div>

        {/* Equipment Details */}
        <SectionHeader icon={<Wrench size={18} />} title="Equipment Details" color="bg-purple-50 text-purple-600" />
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Equipment Name *" value={form.equipmentName} onChange={(v) => update('equipmentName', v)} placeholder="e.g. Mahindra Arjun 555" />
          <Select label="Category *" value={form.category} onChange={(v) => update('category', v)} options={CATEGORIES} placeholder="Select Category" />
          <Input label="Brand" value={form.brand} onChange={(v) => update('brand', v)} placeholder="e.g. Mahindra" />
          <Input label="Model" value={form.model} onChange={(v) => update('model', v)} placeholder="e.g. Arjun 555 DI" />
          <Input label="Horsepower" value={form.horsepower} onChange={(v) => update('horsepower', v)} placeholder="e.g. 52" type="number" />
          <Input label="Manufacturing Year" value={form.year} onChange={(v) => update('year', v)} placeholder="e.g. 2021" type="number" />
          <Select label="Condition" value={form.condition} onChange={(v) => update('condition', v)} options={CONDITIONS} placeholder="Select Condition" />
          <Input label="Description" value={form.description} onChange={(v) => update('description', v)} placeholder="Brief description..." />
        </div>

        {/* Uploads */}
        <SectionHeader icon={<Upload size={18} />} title="Uploads" color="bg-amber-50 text-amber-600" />
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UploadBox label="Cover Photo *" required />
            <UploadBox label="Additional Photos" />
            <UploadBox label="Video (Optional)" />
          </div>
        </div>

        {/* Rental Details */}
        <SectionHeader icon={<IndianRupee size={18} />} title="Rental Details" color="bg-brand-50 text-brand-600" />
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input icon={<IndianRupee size={14} />} label="Price Per Hour (₹)" value={form.pricePerHour} onChange={(v) => update('pricePerHour', v)} placeholder="e.g. 500" type="number" />
          <Input icon={<IndianRupee size={14} />} label="Price Per Day (₹) *" value={form.pricePerDay} onChange={(v) => update('pricePerDay', v)} placeholder="e.g. 3500" type="number" />
          <Input icon={<IndianRupee size={14} />} label="Security Deposit (₹)" value={form.deposit} onChange={(v) => update('deposit', v)} placeholder="e.g. 10000" type="number" />
          <Input icon={<Calendar size={14} />} label="Minimum Rental Duration" value={form.minRental} onChange={(v) => update('minRental', v)} placeholder="e.g. 4 hours" />
          <div className="flex items-center gap-6 pt-6">
            <Toggle label="Fuel Included" checked={form.fuelIncluded} onChange={(v) => update('fuelIncluded', v)} icon={<Fuel size={14} />} />
            <Toggle label="Operator Included" checked={form.operatorIncluded} onChange={(v) => update('operatorIncluded', v)} icon={<UserCheck size={14} />} />
          </div>
        </div>

        {/* Availability */}
        <SectionHeader icon={<Calendar size={18} />} title="Availability & Radius" color="bg-teal-50 text-teal-600" />
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <button key={d} className="tap-target bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-all">
                {d}
              </button>
            ))}
          </div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Working Radius: {form.workingRadius} km</label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={form.workingRadius}
            onChange={(e) => update('workingRadius', Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>5 km</span><span>100 km</span>
          </div>
        </div>

        {/* Submit — solid brand button, full-width */}
        <div className="px-6 pb-6 sticky bottom-0 bg-white/80 backdrop-blur-sm pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !form.ownerName || !form.phone || !form.equipmentName || !form.category || !form.pricePerDay || !form.condition || form.lat === 0}
            className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 disabled:bg-brand-400 transition-all shadow-sm shadow-brand-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Registering...</> : 'Register Equipment'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
    <h3 className="text-sm font-bold text-gray-700">{title}</h3>
  </div>
);

const Input: React.FC<{
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; icon?: React.ReactNode;
}> = ({ label, value, onChange, placeholder, type = 'text', icon }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`tap-target w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all`}
      />
    </div>
  </div>
);

const Select: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}> = ({ label, value, onChange, options, placeholder = 'Select...' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="tap-target w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Toggle: React.FC<{
  label: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode;
}> = ({ label, checked, onChange, icon }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-gray-300'}`} onClick={() => onChange(!checked)}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">{icon} {label}</span>
  </label>
);

const UploadBox: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-400 hover:bg-brand-50/50 transition-all cursor-pointer">
    <Upload size={20} className="text-gray-400 mx-auto mb-2" />
    <p className="text-xs font-semibold text-gray-600">{label}</p>
    <p className="text-[10px] text-gray-400 mt-1">{required ? 'Required' : 'Optional'}</p>
  </div>
);

export default RegisterEquipment;
