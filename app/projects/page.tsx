'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ProjectCard from '@/components/ProjectCard';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    locality: '',
    status: '',
    sort: ''
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchProjects = async () => {
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
        
        const res = await fetch(`/api/projects?${queryParams.toString()}`);
        if (res.status === 401) return router.push('/login');
        if (!res.ok) throw new Error('Failed to fetch projects');
        
        const data = await res.json();
        setProjects(data.results);
        setTotal(data.total);
      } catch (err) {
        setError('An error occurred while fetching projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, page, filters, router]);

  if (authLoading || (!user && !authLoading)) return <div className="min-h-screen" />;

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
        <p className="mt-1 text-sm text-gray-500">Find new developer projects and upcoming communities.</p>
      </div>

      {/* Filters for Projects */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 transition-all hover:shadow-md">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filter Projects
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Locality</label>
            <input type="text" name="locality" className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white" value={filters.locality} onChange={handleFilterChange} placeholder="e.g. Bandra" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
            <select name="status" className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white" value={filters.status} onChange={handleFilterChange}>
              <option value="">Any Status</option>
              <option value="under_construction">Under Construction</option>
              <option value="ready_to_move">Ready to Move</option>
              <option value="new_launch">New Launch</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sort By</label>
            <select name="sort" className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3 bg-gray-50 hover:bg-white" value={filters.sort} onChange={handleFilterChange}>
              <option value="">Relevance</option>
              <option value="possession_asc">Possession: Soonest</option>
              <option value="possession_desc">Possession: Latest</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100">No projects found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>

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
