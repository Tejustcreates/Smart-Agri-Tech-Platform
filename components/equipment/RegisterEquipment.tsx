import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Wrench, IndianRupee, Calendar, Upload, Loader2, Fuel, UserCheck } from 'lucide-react';
import { RegistrationForm, EquipmentCategory, EquipmentCondition } from '../../types/equipment';
import { registerEquipment } from '../../services/equipment/equipmentService';
import { INDIAN_STATES } from '../../constants';
import RegistrationSuccess from './RegistrationSuccess';

const CATEGORIES: EquipmentCategory[] = ['Tractor', 'Harvester', 'Rotavator', 'Seeder', 'Sprayer', 'Cultivator', 'Thresher', 'Plough', 'Others'];
const CONDITIONS: EquipmentCondition[] = ['Excellent', 'Good', 'Average'];

const INITIAL_FORM: RegistrationForm = {
  ownerName: '', phone: '', village: '', taluka: '', district: '', state: '',
  lat: 0, lng: 0, equipmentName: '', category: '', brand: '', model: '',
  horsepower: '', year: '', condition: '', coverPhoto: '', additionalPhotos: [],
  pricePerHour: '', pricePerDay: '', deposit: '', fuelIncluded: false,
  operatorIncluded: false, minRental: '', workingRadius: 20, description: '',
};

const RegisterEquipment: React.FC = () => {
  const [form, setForm] = useState<RegistrationForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = <K extends keyof RegistrationForm>(key: K, val: RegistrationForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
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

  if (success) return <RegistrationSuccess onDone={() => { setSuccess(false); setForm(INITIAL_FORM); }} />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Owner Details */}
        <SectionHeader icon={<User size={18} />} title="Owner Details" color="bg-green-50 text-green-600" />
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input icon={<User size={14} />} label="Full Name *" value={form.ownerName} onChange={(v) => update('ownerName', v)} placeholder="e.g. Rajesh Patil" />
          <Input icon={<Phone size={14} />} label="Mobile Number *" value={form.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" type="tel" />
          <Input icon={<MapPin size={14} />} label="Village" value={form.village} onChange={(v) => update('village', v)} placeholder="e.g. Indapur" />
          <Input label="Taluka" value={form.taluka} onChange={(v) => update('taluka', v)} placeholder="e.g. Indapur" />
          <Input label="District" value={form.district} onChange={(v) => update('district', v)} placeholder="e.g. Pune" />
          <Select label="State" value={form.state} onChange={(v) => update('state', v)} options={INDIAN_STATES} />
        </div>

        {/* Equipment Details */}
        <SectionHeader icon={<Wrench size={18} />} title="Equipment Details" color="bg-blue-50 text-blue-600" />
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Equipment Name *" value={form.equipmentName} onChange={(v) => update('equipmentName', v)} placeholder="e.g. Mahindra Arjun 555" />
          <Select label="Category *" value={form.category} onChange={(v) => update('category', v)} options={CATEGORIES} placeholder="Select Category" />
          <Input label="Brand" value={form.brand} onChange={(v) => update('brand', v)} placeholder="e.g. Mahindra" />
          <Input label="Model" value={form.model} onChange={(v) => update('model', v)} placeholder="e.g. Arjun 555 DI" />
          <Input label="Horsepower" value={form.horsepower} onChange={(v) => update('horsepower', v)} placeholder="e.g. 52" type="number" />
          <Input label="Manufacturing Year" value={form.year} onChange={(v) => update('year', v)} placeholder="e.g. 2021" type="number" />
          <Select label="Condition" value={form.condition} onChange={(v) => update('condition', v)} options={CONDITIONS} placeholder="Select Condition" />
          <Input label="Description" value={form.description} onChange={(v) => update('description', v)} placeholder="Brief description of equipment..." />
        </div>

        {/* Uploads */}
        <SectionHeader icon={<Upload size={18} />} title="Uploads" color="bg-purple-50 text-purple-600" />
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UploadBox label="Cover Photo *" required />
            <UploadBox label="Additional Photos" />
            <UploadBox label="Video (Optional)" />
          </div>
        </div>

        {/* Rental Details */}
        <SectionHeader icon={<IndianRupee size={18} />} title="Rental Details" color="bg-amber-50 text-amber-600" />
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
              <button key={d} className="py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all">
                {d}
              </button>
            ))}
          </div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Working Radius: {form.workingRadius} km</label>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={form.workingRadius}
            onChange={(e) => update('workingRadius', Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>5 km</span><span>50 km</span>
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={loading || !form.ownerName || !form.phone || !form.equipmentName || !form.category || !form.pricePerDay || !form.condition}
            className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:bg-green-400 transition-all shadow-sm shadow-green-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Registering...</> : 'Register Equipment'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* Helper sub-components */

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
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
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
      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
    <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => onChange(!checked)}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">{icon} {label}</span>
  </label>
);

const UploadBox: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
    <Upload size={20} className="text-gray-400 mx-auto mb-2" />
    <p className="text-xs font-semibold text-gray-600">{label}</p>
    <p className="text-[10px] text-gray-400 mt-1">{required ? 'Required' : 'Optional'}</p>
  </div>
);

export default RegisterEquipment;
