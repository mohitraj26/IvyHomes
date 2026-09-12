'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavourite, setIsFavourite] = useState(false); // To be fully implemented in Phase 9

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !id) return;
    
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 404) {
          setError('Property not found.');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch details');
        const data = await res.json();
        setListing(data);

        // Check favourite status
        const favRes = await fetch('/api/favourites');
        if (favRes.ok) {
          const favs = await favRes.json();
          if (favs.includes(id)) setIsFavourite(true);
        }
      } catch (err) {
        setError('An error occurred while fetching property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user, router]);

  if (authLoading || (!user && !authLoading) || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-10"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-100">
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p>{error}</p>
          <Link href="/listings" className="mt-4 inline-block text-indigo-600 hover:underline">
            &larr; Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const toggleFavourite = async () => {
    setIsFavourite(!isFavourite);
    await fetch('/api/favourites', {
      method: isFavourite ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/listings" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          &larr; Back to search
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {listing.property_type}
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {listing.is_verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {listing.bedroom} BHK in {listing.apartment_name}
            </h1>
            <p className="text-gray-500 mt-2 text-lg capitalize">{listing.locality}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-indigo-600">
              {formatPrice(listing.price)}
            </div>
            <button 
              onClick={toggleFavourite}
              className={`mt-4 px-6 py-2 rounded-lg font-medium border flex items-center gap-2 transition-colors ${
                isFavourite 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className={`w-5 h-5 ${isFavourite ? 'fill-current' : 'none'}`} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isFavourite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="md:col-span-2 p-6 md:p-8 border-r border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Super Built-up Area</p>
                <p className="font-semibold text-gray-900">{listing.super_built_up_area} sqft</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Carpet Area</p>
                <p className="font-semibold text-gray-900">{listing.carpet_area} sqft</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                <p className="font-semibold text-gray-900">{listing.bedroom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                <p className="font-semibold text-gray-900">{listing.bathroom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Balconies</p>
                <p className="font-semibold text-gray-900">{listing.balcony}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Furnishing</p>
                <p className="font-semibold text-gray-900 capitalize">{listing.furnishing.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Floor</p>
                <p className="font-semibold text-gray-900">{listing.floor} of {listing.total_floors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Facing</p>
                <p className="font-semibold text-gray-900 capitalize">{listing.facing_direction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Parking</p>
                <p className="font-semibold text-gray-900">{listing.covered_parking} Covered</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
              {listing.description}
            </p>
          </div>

          {/* Sidebar */}
          <div className="p-6 md:p-8 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Seller Information</h3>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl uppercase">
                  {listing.posted_by_name?.charAt(0) || listing.posted_by.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{listing.posted_by_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500 capitalize">{listing.posted_by}</p>
                </div>
              </div>
              <a 
                href={`tel:${listing.posted_by_contact}`}
                className="w-full block text-center bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {listing.posted_by_contact}
              </a>
            </div>

            {listing.project && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Project: {listing.project.apartment_name}</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><span className="font-medium">Developer:</span> {listing.project.developer_name}</p>
                  <p><span className="font-medium">Status:</span> <span className="capitalize">{listing.project.project_status}</span></p>
                  <p><span className="font-medium">Total Units:</span> {listing.project.total_units}</p>
                  <p><span className="font-medium">Possession:</span> {listing.project.possession_date}</p>
                  <p><span className="font-medium">RERA:</span> {listing.project.rera_number}</p>
                  
                  {listing.project.amenities?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-medium mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {listing.project.amenities.map((am: string, i: number) => (
                          <span key={i} className="bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-md text-xs capitalize">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
