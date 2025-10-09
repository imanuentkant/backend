import apiClient from '../api-client';

export interface SearchPropertyParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  instantBooking?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  currency: string;
  cleaningFee: number;
  status: string;
  location: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  coverPhotoId: string;
  instantBooking: boolean;
  rating: number;
  reviewCount: number;
}

export const searchProperties = async (params: SearchPropertyParams) => {
  const { data } = await apiClient.get('/api/properties', { params });
  return data;
};

export const getProperty = async (id: string) => {
  const { data } = await apiClient.get(`/api/properties/${id}`);
  return data;
};

export const getPropertyPhotos = async (propertyId: string) => {
  const { data } = await apiClient.get(`/api/properties/${propertyId}/photos`);
  return data;
};

export const getPropertyReviews = async (propertyId: string, params?: { page?: number; limit?: number }) => {
  const { data } = await apiClient.get(`/api/reviews/property/${propertyId}`, { params });
  return data;
};
