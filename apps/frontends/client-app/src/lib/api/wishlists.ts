import apiClient from '../api-client';

export const getWishlist = async () => {
  const { data } = await apiClient.get('/api/wishlists');
  return data;
};

export const addToWishlist = async (propertyId: string) => {
  const { data } = await apiClient.post(`/api/wishlists/properties/${propertyId}`);
  return data;
};

export const removeFromWishlist = async (propertyId: string) => {
  const { data } = await apiClient.delete(`/api/wishlists/properties/${propertyId}`);
  return data;
};

export const checkWishlist = async (propertyId: string) => {
  const { data } = await apiClient.get(`/api/wishlists/properties/${propertyId}/check`);
  return data;
};
