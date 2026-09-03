import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Tractor } from 'lucide-react';
import { EquipmentTab } from '../../types/equipment';
import Section from '../../components/Section';
import FindEquipment from './FindEquipment';
import RegisterEquipment from './RegisterEquipment';

const TABS: { key: EquipmentTab; label: string; icon: React.ReactNode }[] = [
  { key: 'find', label: 'Find Equipment', icon: <Search size={16} /> },
  { key: 'register', label: 'Register Equipment', icon: <Plus size={16} /> },
];

const CommunityEquipment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EquipmentTab>('find');

  return (
    <Section
      id="equipment-recommender"
      tone="teal"
      icon="fas fa-tractor"
      eyebrow="Community Marketplace"
      title="Community Equipment Rental Marketplace"
      subtitle="Rent farming equipment directly from nearby farmers in your area."
      className=""
    >
      <div className="mx-auto w-full">

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-brand-600 text-brand-700 bg-brand-50/50'
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
    </Section>
  );
};

export default CommunityEquipment;
