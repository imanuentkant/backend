'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProperties } from '@/lib/api/properties';
import PropertyCard from '@/components/PropertyCard';

export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    guests: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['properties', searchParams],
    queryFn: () => searchProperties(searchParams),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-pink-500 to-red-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">
              Tìm chỗ ở tiếp theo của bạn
            </h1>
            <p className="text-xl mb-8">
              Hàng ngàn properties và vehicles đang chờ đón bạn
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-full shadow-xl p-2 flex items-center gap-2 max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Địa điểm"
                className="flex-1 px-6 py-3 text-gray-800 outline-none rounded-full"
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
              <input
                type="number"
                placeholder="Số khách"
                className="w-32 px-4 py-3 text-gray-800 outline-none"
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
              />
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Properties</h2>
        
        {isLoading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}