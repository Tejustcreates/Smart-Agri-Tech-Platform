import React from 'react';

const ALERTS = [
  { id: 1, icon: 'fas fa-cloud-rain', title: 'Heavy Rain Alert', desc: 'IMD warns of heavy rainfall in Maharashtra, Gujarat next 48 hours', bar: 'border-blue-500', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 2, icon: 'fas fa-chart-line', title: 'MSP Updated', desc: 'Kharif MSP increased by 5-8%. Check new rates for your crops', bar: 'border-brand-500', bg: 'bg-brand-50', iconColor: 'text-brand-600' },
  { id: 3, icon: 'fas fa-landmark', title: 'New Scheme', desc: 'PM-KISAN 16th installment releasing soon. Verify your status', bar: 'border-purple-500', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { id: 4, icon: 'fas fa-bug', title: 'Pest Warning', desc: 'Pink bollworm alert for cotton farmers in Gujarat and Rajasthan', bar: 'border-red-500', bg: 'bg-red-50', iconColor: 'text-red-600' },
  { id: 5, icon: 'fas fa-wheat-awn', title: 'Sowing Advisory', desc: 'Optimal wheat sowing window starts next week for North India', bar: 'border-amber-500', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
];

const QuickAlerts: React.FC = () => (
  <div className="mb-8">
    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
      <i className="fas fa-bell text-brand-600" /> Quick Agriculture Alerts
    </h3>
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {ALERTS.map((alert) => (
        <div
          key={alert.id}
          className={`tap-target flex-shrink-0 w-64 bg-white rounded-xl p-4 border-l-[5px] ${alert.bar} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
        >
          <div className="flex items-start gap-3">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.bg}`}>
              <i className={`${alert.icon} text-sm ${alert.iconColor}`} />
            </span>
            <div className="min-w-0">
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
