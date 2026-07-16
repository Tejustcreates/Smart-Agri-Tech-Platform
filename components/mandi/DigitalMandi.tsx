import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MapPin, TrendingUp, Sparkles, Store } from 'lucide-react';
import { MandiTab, MandiDashboardSummary } from '../../types/mandi';
import { getDashboardSummary } from '../../services/mandi/mandiApi';
import DashboardCards from './DashboardCards';
import LiveMandiTable from './LiveMandiTable';
import NearbyMandis from './NearbyMandis';
import PricePrediction from './PricePrediction';
import BestRecommendation from './BestRecommendation';

const TABS: { key: MandiTab; label: string; icon: React.ReactNode }[] = [
  { key: 'prices', label: 'Live Mandi Prices', icon: <BarChart3 size={16} /> },
  { key: 'nearby', label: 'Nearby Mandi Rates', icon: <MapPin size={16} /> },
  { key: 'prediction', label: 'Price Prediction', icon: <TrendingUp size={16} /> },
  { key: 'recommendation', label: 'Best Mandi Recommendation', icon: <Sparkles size={16} /> },
];

const DigitalMandi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MandiTab>('prices');
  const [summary, setSummary] = useState<MandiDashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary().then(setSummary).finally(() => setSummaryLoading(false));
  }, []);

  return (
    <section className="min-h-screen snap-section flex flex-col py-16 px-4" id="mandi">
      <div className="max-w-6xl mx-auto w-full">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            <Store size={14} />
            Digital Mandi Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            Smart <span className="text-green-600">Mandi</span> Information System
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Smart market intelligence to help farmers sell their crops at the best possible mandi.
          </p>
        </motion.div>

        {/* Dashboard Summary Cards */}
        <DashboardCards summary={summary} loading={summaryLoading} />

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-green-600 text-green-700 bg-green-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
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
    </section>
  );
};

export default DigitalMandi;
