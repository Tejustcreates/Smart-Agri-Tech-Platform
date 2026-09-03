import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MapPin, TrendingUp, Sparkles, Store, Trophy } from 'lucide-react';
import { MandiTab, MandiDashboardSummary } from '../../types/mandi';
import { getDashboardSummary } from '../../services/mandi/mandiApi';
import Section from '../../components/Section';
import DashboardCards from './DashboardCards';
import LiveMandiTable from './LiveMandiTable';
import NearbyMandis from './NearbyMandis';
import PricePrediction from './PricePrediction';
import BestRecommendation from './BestRecommendation';

const TABS: { key: MandiTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { key: 'prices', label: 'Live Mandi Prices', shortLabel: 'Prices', icon: <BarChart3 size={14} /> },
  { key: 'nearby', label: 'Nearby Mandi Rates', shortLabel: 'Nearby', icon: <MapPin size={14} /> },
  { key: 'prediction', label: 'Price Prediction', shortLabel: 'Predict', icon: <TrendingUp size={14} /> },
  { key: 'recommendation', label: 'Best Mandi', shortLabel: 'Best Mandi', icon: <Sparkles size={14} /> },
];

const DigitalMandi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MandiTab>('prices');
  const [summary, setSummary] = useState<MandiDashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary().then(setSummary).finally(() => setSummaryLoading(false));
  }, []);

  return (
    <Section
      id="mandi"
      tone="violet"
      icon="fas fa-store"
      eyebrow="Digital Mandi Intelligence"
      title="Smart Mandi Information System"
      subtitle="Smart market intelligence to help farmers sell their crops at the best possible mandi."
      className=""
    >
      <div className="mx-auto w-full">

        {/* Dashboard Summary Cards */}
        <DashboardCards summary={summary} loading={summaryLoading} />

        {/* Best Recommendation — always visible as prominent card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-amber-300" />
              <h3 className="text-base sm:text-lg font-bold">Where Should I Sell?</h3>
            </div>
            <p className="text-white/80 text-sm mb-4 max-w-lg">
              Enter your crop and quantity to find the best mandi — we compare prices, transport costs, and distances to maximise your profit.
            </p>
            <button
              onClick={() => setActiveTab('recommendation')}
              className="tap-target px-6 py-3 bg-white text-brand-700 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles size={16} /> Get Best Mandi Recommendation
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation — tap-target pills, scrollable */}
        <div className="mb-6 -mx-1 px-1">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tap-target flex-shrink-0 flex items-center gap-1.5 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
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
          {activeTab === 'prices' && <LiveMandiTable />}
          {activeTab === 'nearby' && <NearbyMandis />}
          {activeTab === 'prediction' && <PricePrediction />}
          {activeTab === 'recommendation' && <BestRecommendation />}
        </motion.div>
      </div>
    </Section>
  );
};

export default DigitalMandi;
