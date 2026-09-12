'use client';

import { useState } from 'react';

type FilterProps = {
  onFilterChange: (filters: Record<string, string>) => void;
};

export default function ListingsFilter({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    locality: '',
    bedroom: '',
    price_min: '',
    price_max: '',
    furnishing: '',
    sort: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    // Only pass non-empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onFilterChange(activeFilters);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        Filter Properties
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Locality</label>
          <input 
            type="text" 
            name="locality"
            placeholder="e.g. Bandra East" 
            className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white"
            value={filters.locality}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bedrooms</label>
          <select 
            name="bedroom" 
            className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white"
            value={filters.bedroom}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Furnishing</label>
          <select 
            name="furnishing" 
            className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white"
            value={filters.furnishing}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="fully-furnished">Fully Furnished</option>
            <option value="semi-furnished">Semi Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Min Price (₹)</label>
          <input 
            type="number" 
            name="price_min"
            placeholder="e.g. 10000000" 
            className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white"
            value={filters.price_min}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sort By</label>
          <select 
            name="sort" 
            className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white"
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={applyFilters}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Apply 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
