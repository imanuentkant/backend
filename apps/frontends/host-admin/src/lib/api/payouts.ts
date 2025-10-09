import apiClient from '../api-client';

export const getHostPayouts = async (params?: { page?: number; limit?: number }) => {
  const { data } = await apiClient.get('/api/payments/host/payouts', { params });
  return data;
};
