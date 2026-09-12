'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !id) return;
    
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.status === 401) return router.push('/login');
        if (res.status === 404) return setError('Project not found.');
        if (!res.ok) throw new Error('Failed to fetch details');
        
        const data = await res.json();
        setProject(data);

        // Check favourite status
        const favRes = await fetch('/api/favourites');
        if (favRes.ok) {
          const favs = await favRes.json();
          if (favs.includes(id)) setIsFavourite(true);
        }
      } catch (err) {
        setError('An error occurred while fetching project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user, router]);

  if (authLoading || (!user && !authLoading) || loading) {
    return <div className="min-h-screen animate-pulse bg-gray-50 p-8" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl">{error}</div>
      </div>
    );
  }

  if (!project) return null;

  const toggleFavourite = async () => {
    setIsFavourite(!isFavourite);
    // Persist to backend
    await fetch('/api/favourites', {
      method: isFavourite ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/projects" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          &larr; Back to projects
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                {project.project_status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {project.apartment_name}
            </h1>
            <p className="text-gray-500 mt-2 text-lg capitalize">{project.locality} • By {project.developer_name}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-indigo-600">
              ₹{project.price_min} Cr - ₹{project.price_max} Cr
            </div>
            <button 
              onClick={toggleFavourite}
              className={`mt-4 px-6 py-2 rounded-lg font-medium border transition-colors ${
                isFavourite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {isFavourite ? 'Saved' : 'Save Project'}
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Overview</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Units</p>
                <p className="font-semibold text-gray-900">{project.total_units}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Towers</p>
                <p className="font-semibold text-gray-900">{project.total_towers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Floors</p>
                <p className="font-semibold text-gray-900">{project.total_floors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Area Range</p>
                <p className="font-semibold text-gray-900">{project.min_area_sqft} - {project.max_area_sqft} sqft</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Launch Date</p>
                <p className="font-semibold text-gray-900">{project.launch_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Possession Date</p>
                <p className="font-semibold text-gray-900">{project.possession_date}</p>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
              <h4 className="text-indigo-900 font-bold mb-2">Current Availability</h4>
              <p className="text-indigo-700">
                There are <span className="font-extrabold">{project.calculated_listings_count}</span> active listings in this project.
              </p>
              <Link href={`/listings?locality=${project.locality}`} className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">
                View properties in this area &rarr;
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {project.amenities?.map((am: string, i: number) => (
                <span key={i} className="bg-gray-100 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium capitalize">
                  {am}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
