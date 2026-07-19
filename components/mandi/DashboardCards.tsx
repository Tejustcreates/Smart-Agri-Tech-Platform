import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, IndianRupee, MapPin, BarChart3, Wheat } from 'lucide-react';
import { MandiDashboardSummary } from '../../types/mandi';

interface DashboardCardsProps {
  summary: MandiDashboardSummary | null;
  loading: boolean;
}

const trendIcon = (t: string) => {
  if (t === 'bullish') return <TrendingUp size={16} className="text-emerald-500" />;
  if (t === 'bearish') return <TrendingDown size={16} className="text-red-500" />;
  return <Minus size={16} className="text-gray-400" />;
};

const trendLabel = (t: string) => {
  if (t === 'bullish') return 'Bullish';
  if (t === 'bearish') return 'Bearish';
  return 'Stable';
};

const trendColor = (t: string) => {
  if (t === 'bullish') return 'bg-emerald-50 text-emerald-700';
  if (t === 'bearish') return 'bg-red-50 text-red-700';
  return 'bg-gray-50 text-gray-600';
};

const SkeletonCard = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-4 sm:p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      <div className="h-3 bg-gray-200 rounded w-24" />
    </div>
    <div className="h-7 bg-gray-200 rounded w-20 mb-1" />
    <div className="h-2.5 bg-gray-100 rounded w-32" />
  </div>
);

const CARDS = [
  {
    key: 'highest',
    icon: <Wheat size={20} className="text-brand-600" />,
    bg: 'bg-brand-50',
    label: "Today's Highest",
    getValue: (s: MandiDashboardSummary) => `₹${s.highestPriceValue.toLocaleString()}`,
    getDesc: (s: MandiDashboardSummary) => `${s.highestPriceCrop} at ${s.highestPriceMandi}`,
  },
  {
    key: 'avg',
    icon: <IndianRupee size={20} className="text-blue-600" />,
    bg: 'bg-blue-50',
    label: 'Average Price',
    getValue: (s: MandiDashboardSummary) => `₹${s.avgMarketPrice.toLocaleString()}`,
    getDesc: (_s: MandiDashboardSummary) => 'Across all mandis today',
  },
  {
    key: 'best',
    icon: <MapPin size={20} className="text-purple-600" />,
    bg: 'bg-purple-50',
    label: 'Best Mandi',
    getValue: (s: MandiDashboardSummary) => s.bestMandi,
    getDesc: (_s: MandiDashboardSummary) => 'Highest average returns',
  },
  {
    key: 'trend',
    icon: <BarChart3 size={20} className="text-amber-600" />,
    bg: 'bg-amber-50',
    label: 'Price Trend',
    getValue: (s: MandiDashboardSummary, el: React.ReactNode) => (
      <div className="flex items-center gap-2">
        {el}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${trendColor(s.priceTrend)}`}>
          {trendLabel(s.priceTrend)}
        </span>
      </div>
    ),
    getDesc: (s: MandiDashboardSummary) => `${s.trendChange > 0 ? '+' : ''}${s.trendChange}% from yesterday`,
  },
];

const DashboardCards: React.FC<DashboardCardsProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 sm:p-5"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
              {card.icon}
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{card.label}</p>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-1">
            {card.getValue(summary, trendIcon(summary.priceTrend))}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{card.getDesc(summary)}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
