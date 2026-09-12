'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Ivy Homes
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!loading && user ? (
              <>
                <Link href="/listings" className="text-gray-600 hover:text-gray-900 font-medium">
                  Listings
                </Link>
                <Link href="/rentals" className="text-gray-600 hover:text-gray-900 font-medium hidden md:block">
                  Rentals
                </Link>
                <Link href="/projects" className="text-gray-600 hover:text-gray-900 font-medium hidden md:block">
                  Projects
                </Link>
                <Link href="/favourites" className="text-gray-600 hover:text-gray-900 font-medium">
                  Saved
                </Link>
                <Link href="/insights" className="text-indigo-600 hover:text-indigo-800 font-bold">
                  Insights
                </Link>
                <span className="text-sm text-gray-500 border-l pl-6 border-gray-200">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : !loading && !user ? (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                Login
              </Link>
            ) : (
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-md" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!loading && user ? (
              <>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signed in as {user.email}
                </div>
                <Link href="/listings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                  Listings
                </Link>
                <Link href="/rentals" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                  Rentals
                </Link>
                <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                  Projects
                </Link>
                <Link href="/favourites" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                  Saved
                </Link>
                <Link href="/insights" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-indigo-600 hover:bg-indigo-50">
                  Insights
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left mt-2 block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : !loading && !user ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Login to Ivy Homes
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
