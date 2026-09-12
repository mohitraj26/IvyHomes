'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function InsightsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/insights');
        if (res.status === 401) return router.push('/login');
        if (!res.ok) throw new Error('Failed to fetch insights');
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError('An error occurred while loading insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user, router]);

  if (authLoading || (!user && !authLoading)) return <div className="min-h-screen" />;

  const formatMoney = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    return `₹${(amount / 100000).toFixed(2)} L`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Market Insights & Analytics</h1>
        <p className="mt-2 text-sm text-gray-600 max-w-3xl">
          Deep dive into real-estate trends calculated directly from live API data, completely detached from documentation assumptions.
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">{error}</div>}

      {loading ? (
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-32 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : data ? (
        <div className="space-y-8">
          
          {/* Section 1: Application Calculated Stats */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">Computed</span>
              Core Market Statistics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Available Listings</p>
                <p className="text-3xl font-bold text-gray-900">{data.calculated_stats.total_listings.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Median Property Price</p>
                <p className="text-3xl font-bold text-green-600">{formatMoney(data.calculated_stats.median_price)}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Median Price per Sq.Ft</p>
                <p className="text-3xl font-bold text-indigo-600">₹{Math.round(data.calculated_stats.median_price_per_sqft).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* BHK Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Listings by Configuration (BHK)</h3>
                <div className="space-y-4">
                  {data.calculated_stats.bhk_stats.map((stat: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{stat.name}</span>
                        <span className="text-gray-500">{stat.count} units</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-500 h-2.5 rounded-full" 
                          style={{ width: `${(stat.count / data.calculated_stats.total_listings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Localities */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Most Active Localities</h3>
                <div className="space-y-4">
                  {data.calculated_stats.top_localities.map((loc: any, i: number) => {
                    const maxCount = data.calculated_stats.top_localities[0].count;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 capitalize">{loc.name}</span>
                          <span className="text-gray-500">{loc.count} units</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className="bg-teal-500 h-2.5 rounded-full" 
                            style={{ width: `${(loc.count / maxCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Data Quality & Discrepancies */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Data Quality</span>
              Integrity & Discrepancy Report
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <p className="text-sm font-medium text-red-800 mb-1">Corrupt Area Metrics</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-red-600">{data.data_quality.corrupt_area_listings}</p>
                  <p className="text-sm text-red-500 mb-1">listings</p>
                </div>
                <p className="text-xs text-red-500 mt-2">Carpet area &gt; Super built-up area</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <p className="text-sm font-medium text-orange-800 mb-1">Project Count Mismatches</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-orange-600">{data.data_quality.project_count_inconsistencies}</p>
                  <p className="text-sm text-orange-500 mb-1">projects</p>
                </div>
                <p className="text-xs text-orange-500 mt-2">API reported total_listings mismatches actual data</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <p className="text-sm font-medium text-yellow-800 mb-1">Suspicious Pricing</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-yellow-600">{data.data_quality.suspicious_price_listings}</p>
                  <p className="text-sm text-yellow-500 mb-1">listings</p>
                </div>
                <p className="text-xs text-yellow-500 mt-2">Price stated as below ₹1L</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Verified API Documentation Findings</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Behavior</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.investigation_findings.map((f: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.endpoint}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{f.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">{f.actual}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            f.impact.toLowerCase().includes('high') || f.impact.toLowerCase().includes('critical') 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {f.impact}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
}
