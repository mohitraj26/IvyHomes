'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ListingCard from '@/components/ListingCard';
import ListingsFilter from '@/components/ListingsFilter';
import { useRouter } from 'next/navigation';

export default function ListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...filters
        });
        
        const res = await fetch(`/api/listings?${queryParams.toString()}`);
        if (res.status === 401) {
          // session might be expired
          router.push('/login');
          return;
        }
        
        if (!res.ok) throw new Error('Failed to fetch listings');
        const data = await res.json();
        setListings(data.results);
        setTotal(data.total);
      } catch (err) {
        setError('An error occurred while fetching properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, page, filters, router]);

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen" />;
  }

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 on new filter
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Properties</h1>
          <p className="mt-1 text-sm text-gray-500">Find your dream home from our verified listings.</p>
        </div>
      </div>

      <ListingsFilter onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 font-medium">
            Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total} results
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.listing_id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="mt-10 flex justify-center items-center space-x-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <button
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
