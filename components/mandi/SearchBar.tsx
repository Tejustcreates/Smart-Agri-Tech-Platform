import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-9 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <X size={14} />
      </button>
    )}
  </div>
);

export default SearchBar;
