import apiClient from '../api-client';

export const getHostReservations = async (params?: { status?: string; page?: number; limit?: number }) => {
  const { data } = await apiClient.get('/api/bookings/host/reservations', { params });
  return data;
};

export const getReservation = async (id: string) => {
  const { data } = await apiClient.get(`/api/bookings/${id}`);
  return data;
};

export const confirmReservation = async (id: string) => {
  const { data } = await apiClient.put(`/api/bookings/${id}/confirm`);
  return data;
};

export const cancelReservation = async (id: string, reason: string) => {
  const { data } = await apiClient.put(`/api/bookings/${id}/cancel`, { reason });
  return data;
};
