import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Tractor } from 'lucide-react';
import { EquipmentTab } from '../../types/equipment';
import FindEquipment from './FindEquipment';
import RegisterEquipment from './RegisterEquipment';

const TABS: { key: EquipmentTab; label: string; icon: React.ReactNode }[] = [
  { key: 'find', label: 'Find Equipment', icon: <Search size={16} /> },
  { key: 'register', label: 'Register Equipment', icon: <Plus size={16} /> },
];

const CommunityEquipment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EquipmentTab>('find');

  return (
    <section className="min-h-screen snap-section flex flex-col py-16 px-4" id="equipment-recommender">
      <div className="max-w-6xl mx-auto w-full">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            <Tractor size={14} />
            Community Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            Community Equipment <span className="text-green-600">Rental Marketplace</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Rent farming equipment directly from nearby farmers in your area.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-green-600 text-green-700 bg-green-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'find' ? <FindEquipment /> : <RegisterEquipment />}
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityEquipment;
