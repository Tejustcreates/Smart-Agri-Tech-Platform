import React, { useState, useEffect, useMemo } from 'react';
import { Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowUp, ArrowDown, Minus, Loader2 } from 'lucide-react';
import { LivePrice, PriceFilters } from '../../types/mandi';
import { getLivePrices } from '../../services/mandi/mandiApi';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const ChangeBadge: React.FC<{ change: number }> = ({ change }) => {
  const isUp = change > 0;
  const isDown = change < 0;
  return (
    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
      isUp ? 'bg-emerald-50 text-emerald-700' : isDown ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
    }`}>
      {isUp ? <ArrowUp size={10} /> : isDown ? <ArrowDown size={10} /> : <Minus size={10} />}
      {Math.abs(change)}%
    </span>
  );
};

const columns: ColumnsType<LivePrice> = [
  { title: 'Crop', dataIndex: 'crop', key: 'crop', fixed: 'left', width: 110, render: (v) => <span className="font-semibold text-gray-800">{v}</span> },
  { title: 'Mandi', dataIndex: 'mandi', key: 'mandi', width: 140 },
  { title: 'District', dataIndex: 'district', key: 'district', width: 120, render: (v) => <span className="text-gray-500">{v}</span> },
  { title: 'State', dataIndex: 'state', key: 'state', width: 130, render: (v) => <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold">{v}</span> },
  { title: 'Min Price', dataIndex: 'minPrice', key: 'minPrice', width: 110, render: (v: number) => `₹${v.toLocaleString()}` },
  { title: 'Max Price', dataIndex: 'maxPrice', key: 'maxPrice', width: 110, render: (v: number) => `₹${v.toLocaleString()}` },
  { title: 'Modal Price', dataIndex: 'modalPrice', key: 'modalPrice', width: 120, render: (v: number) => <span className="font-bold text-gray-800">₹{v.toLocaleString()}</span> },
  { title: 'Change', dataIndex: 'change', key: 'change', width: 100, render: (v: number) => <ChangeBadge change={v} /> },
  { title: 'Updated', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 110, render: (v) => <span className="text-xs text-gray-400">{v}</span> },
];

const LiveMandiTable: React.FC = () => {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PriceFilters>({
    state: '', district: '', crop: '', date: '', search: '',
  });

  useEffect(() => {
    getLivePrices()
      .then(setPrices)
      .catch(() => message.error('Failed to load live mandi prices. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const stateOptions = useMemo(
    () => Array.from(new Set(prices.map((p) => p.state))).sort(),
    [prices]
  );

  const districtOptions = useMemo(
    () => Array.from(new Set(prices.filter((p) => !filters.state || p.state === filters.state).map((p) => p.district))).sort(),
    [prices, filters.state]
  );

  const filtered = useMemo(() => {
    return prices.filter((p) => {
      if (filters.search && !p.crop.toLowerCase().includes(filters.search.toLowerCase()) && !p.mandi.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.state && p.state !== filters.state) return false;
      if (filters.district && !p.district.toLowerCase().includes(filters.district.toLowerCase())) return false;
      if (filters.crop && p.crop !== filters.crop) return false;
      return true;
    });
  }, [prices, filters]);

  const updateFilter = (key: keyof PriceFilters, val: string) => setFilters((f) => ({ ...f, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-brand-500" />
        <span className="ml-3 text-sm text-gray-500">Loading live prices...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="w-full">
          <SearchBar value={filters.search} onChange={(v) => updateFilter('search', v)} placeholder="Search crop or mandi..." />
        </div>
      </div>
      <FilterPanel
        state={filters.state} onStateChange={(v) => updateFilter('state', v)} stateOptions={stateOptions}
        district={filters.district} onDistrictChange={(v) => updateFilter('district', v)} districtOptions={districtOptions}
        crop={filters.crop} onCropChange={(v) => updateFilter('crop', v)}
        date={filters.date} onDateChange={(v) => updateFilter('date', v)}
      />

      <div className="mt-5">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          scroll={{ x: 1060 }}
          pagination={filtered.length > 10 ? { pageSize: 10 } : false}
          locale={{ emptyText: 'No prices match your filters.' }}
          size="middle"
        />
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">{filtered.length} results found</p>
    </div>
  );
};

export default LiveMandiTable;
