export default function RentalCard({ rental }: { rental: any }) {
  const formatMoney = (amount: number) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
      <div className="h-40 bg-gradient-to-r from-emerald-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        <svg className="w-12 h-12 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
          {formatMoney(rental.monthly_rent)}<span className="text-xs font-normal text-emerald-600"> /mo</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors capitalize line-clamp-1">
            {rental.bedroom} BHK {rental.property_type}
          </h3>
          <p className="text-sm text-gray-500 capitalize line-clamp-1 mt-0.5">
            {rental.apartment_name}, {rental.locality}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-auto text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="truncate">Dep: {formatMoney(rental.deposit)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            <span className="truncate">{rental.super_built_up_area} sqft</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            <span className="capitalize truncate">{rental.furnishing.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <span>{rental.bathroom} Baths</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">ID: {rental.rental_id}</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium capitalize truncate flex-1 ml-4 text-right">
            By {rental.posted_by}
          </span>
        </div>
      </div>
    </div>
  );
}
