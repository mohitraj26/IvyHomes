'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import RentalCard from '@/components/RentalCard';
import { useRouter } from 'next/navigation';

export default function RentalsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [rentals, setRentals] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Basic filters for rentals
  const [filters, setFilters] = useState({
    locality: '',
    bedroom: '',
    furnishing: '',
    sort: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchRentals = async () => {
      setLoading(true);
      setError('');
      try {
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...activeFilters
        });
        
        const res = await fetch(`/api/rentals?${queryParams.toString()}`);
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        
        if (!res.ok) throw new Error('Failed to fetch rentals');
        const data = await res.json();
        setRentals(data.results);
        setTotal(data.total);
      } catch (err) {
        setError('An error occurred while fetching rentals.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user, page, filters, router]);

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen" />;
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Rentals</h1>
        <p className="mt-1 text-sm text-gray-500">Find the perfect rental property.</p>
      </div>

      {/* Simplified Filters for Rentals */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 transition-all hover:shadow-md">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filter Rentals
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Locality</label>
            <input type="text" name="locality" className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white" value={filters.locality} onChange={handleFilterChange} placeholder="e.g. Powai" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bedrooms</label>
            <select name="bedroom" className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white" value={filters.bedroom} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sort By</label>
            <select name="sort" className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white" value={filters.sort} onChange={handleFilterChange}>
              <option value="">Relevance</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse" />
          ))}
        </div>
      ) : rentals.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100">No rentals found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map(rental => (
              <RentalCard key={rental.rental_id} rental={rental} />
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="mt-10 flex justify-center items-center space-x-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md">Previous</button>
              <span className="text-sm">Page {page} of {Math.ceil(total / 20)}</span>
              <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
