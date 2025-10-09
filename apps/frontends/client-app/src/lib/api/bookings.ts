import apiClient from '../api-client';

export interface CreateBookingParams {
  propertyId?: string;
  vehicleId?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  propertyId?: string;
  vehicleId?: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export const createBooking = async (params: CreateBookingParams) => {
  const { data } = await apiClient.post('/api/bookings', params);
  return data;
};

export const getUserBookings = async (params?: { status?: string; page?: number; limit?: number }) => {
  const { data } = await apiClient.get('/api/bookings/user', { params });
  return data;
};

export const getBooking = async (id: string) => {
  const { data } = await apiClient.get(`/api/bookings/${id}`);
  return data;
};

export const cancelBooking = async (id: string, reason?: string) => {
  const { data } = await apiClient.put(`/api/bookings/${id}/cancel`, { reason });
  return data;
};

export const calculatePrice = async (params: CreateBookingParams) => {
  const { data } = await apiClient.post('/api/bookings/calculate-price', params);
  return data;
};
