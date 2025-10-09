import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/api/properties';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={property.coverPhotoId || '/placeholder-property.jpg'}
          alt={property.title}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="mt-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-gray-600 text-sm">
              {property.location.city}, {property.location.country}
            </p>
          </div>
          {property.rating > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-sm text-gray-500">({property.reviewCount})</span>
            </div>
          )}
        </div>
        
        <div className="mt-1 text-gray-600 text-sm">
          {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} baths
        </div>
        
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-semibold">${property.pricePerNight}</span>
          <span className="text-gray-600">/ night</span>
        </div>
      </div>
    </Link>
  );
}
