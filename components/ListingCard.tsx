import Link from 'next/link';

export default function ListingCard({ listing }: { listing: any }) {
  // Format price nicely
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
      <Link href={`/listings/${listing.listing_id}`} className="flex-1 flex flex-col">
        {/* Placeholder for Image (as API doesn't provide them) */}
        <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-indigo-700 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
            {formatPrice(listing.price)}
          </div>
          {listing.is_verified && (
            <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Verified
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors capitalize line-clamp-1">
              {listing.bedroom} BHK {listing.property_type}
            </h3>
            <p className="text-sm text-gray-500 capitalize line-clamp-1 mt-0.5">
              {listing.apartment_name}, {listing.locality}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-auto text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              <span className="truncate">{listing.super_built_up_area} sqft</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              <span className="capitalize truncate">{listing.furnishing.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span>{listing.bathroom} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="capitalize truncate">{listing.posted_by}</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">ID: {listing.listing_id}</span>
            <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              Details <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
