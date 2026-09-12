'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ListingCard from '@/components/ListingCard';

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [favourites, setFavourites] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchFavs = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/favourites');
        if (res.status === 401) return router.push('/login');
        if (!res.ok) throw new Error('Failed to fetch favourites');
        
        const favIds = await res.json();
        setFavourites(favIds);
        
        // Fetch details for these items (just listings for now for demonstration)
        // In a real app we would batch this or the backend would return populated items
        const populated = await Promise.all(
          favIds.map(async (id: string) => {
            // We don't know if it's a listing, rental, or project. Try listing.
            try {
              const res = await fetch(`/api/listings/${id}`);
              if (res.ok) return await res.json();
            } catch (e) {}
            return null;
          })
        );
        
        setItems(populated.filter(Boolean));
      } catch (err) {
        setError('An error occurred while fetching favourites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [user, router]);

  if (authLoading || (!user && !authLoading)) return <div className="min-h-screen" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
        <p className="mt-1 text-sm text-gray-500">Your curated list of favourite properties.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100">
          <p className="text-gray-500 mb-4">You haven't saved any properties yet.</p>
          <Link href="/listings" className="text-indigo-600 font-medium hover:underline">
            Browse Listings &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
             <ListingCard key={item.listing_id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
}
