import React from 'react';

const ALERTS = [
  { id: 1, emoji: '⚠️', title: 'Heavy Rain Alert', desc: 'IMD warns of heavy rainfall in Maharashtra, Gujarat next 48 hours', color: 'border-blue-500', bg: 'bg-blue-50' },
  { id: 2, emoji: '📈', title: 'MSP Updated', desc: 'Kharif MSP increased by 5-8%. Check new rates for your crops', color: 'border-green-500', bg: 'bg-green-50' },
  { id: 3, emoji: '🏛', title: 'New Scheme', desc: 'PM-KISAN 16th installment releasing soon. Verify your status', color: 'border-purple-500', bg: 'bg-purple-50' },
  { id: 4, emoji: '🐛', title: 'Pest Warning', desc: 'Pink bollworm alert for cotton farmers in Gujarat and Rajasthan', color: 'border-red-500', bg: 'bg-red-50' },
  { id: 5, emoji: '🌾', title: 'Sowing Advisory', desc: 'Optimal wheat sowing window starts next week for North India', color: 'border-amber-500', bg: 'bg-amber-50' },
];

const QuickAlerts: React.FC = () => (
  <div className="mb-8">
    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
      <span>🔔</span> Quick Agriculture Alerts
    </h3>
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {ALERTS.map((alert) => (
        <div
          key={alert.id}
          className={`flex-shrink-0 w-64 bg-white rounded-xl p-4 border-l-4 ${alert.color} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{alert.emoji}</span>
            <div>
              <p className="text-sm font-bold text-gray-800">{alert.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuickAlerts;
