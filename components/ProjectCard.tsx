import Link from 'next/link';

export default function ProjectCard({ project }: { project: any }) {
  const formatStatus = (status: string) => status.replace('_', ' ');

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
      <Link href={`/projects/${project.project_id}`} className="flex-1 flex flex-col">
        <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
          <svg className="w-12 h-12 text-indigo-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-indigo-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
            {formatStatus(project.project_status)}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors capitalize line-clamp-1">
              {project.apartment_name}
            </h3>
            <p className="text-sm text-gray-500 capitalize line-clamp-1 mt-0.5">
              {project.locality} • By {project.developer_name}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-auto text-sm text-gray-600">
            <div className="col-span-2 flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-medium text-gray-900">₹{project.price_min} Cr - ₹{project.price_max} Cr</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              <span className="truncate">{project.min_area_sqft} - {project.max_area_sqft} sqft</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span className="truncate">{project.total_units} Units</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Possession: {new Date(project.possession_date).getFullYear()}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{project.total_listings} Listings</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-1 group-hover:text-indigo-600 group-hover:gap-2 transition-all">
              Explore <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
