import apiClient from '../api-client';

export interface CreatePropertyParams {
  title: string;
  description: string;
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  currency?: string;
  cleaningFee?: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export const getMyProperties = async (params?: { status?: string }) => {
  const { data } = await apiClient.get('/api/properties/host/my-properties', { params });
  return data;
};

export const createProperty = async (params: CreatePropertyParams) => {
  const { data } = await apiClient.post('/api/properties', params);
  return data;
};

export const getProperty = async (id: string) => {
  const { data } = await apiClient.get(`/api/properties/${id}`);
  return data;
};

export const updateProperty = async (id: string, params: Partial<CreatePropertyParams>) => {
  const { data } = await apiClient.put(`/api/properties/${id}`, params);
  return data;
};

export const activateProperty = async (id: string) => {
  const { data } = await apiClient.put(`/api/properties/${id}/activate`);
  return data;
};

export const deactivateProperty = async (id: string) => {
  const { data } = await apiClient.put(`/api/properties/${id}/deactivate`);
  return data;
};

export const deleteProperty = async (id: string) => {
  const { data } = await apiClient.delete(`/api/properties/${id}`);
  return data;
};
