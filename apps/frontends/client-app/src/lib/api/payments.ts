import apiClient from '../api-client';

export interface CreatePaymentIntentParams {
  bookingId: string;
  amount: number;
  currency?: string;
  breakdown: {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
  };
}

export const createPaymentIntent = async (params: CreatePaymentIntentParams) => {
  const { data } = await apiClient.post('/api/payments/intent', params);
  return data;
};

export const confirmPayment = async (intentId: string) => {
  const { data } = await apiClient.post(`/api/payments/${intentId}/confirm`);
  return data;
};

export const getPayment = async (id: string) => {
  const { data } = await apiClient.get(`/api/payments/${id}`);
  return data;
};

export const getTransactionHistory = async (params?: { page?: number; limit?: number }) => {
  const { data } = await apiClient.get('/api/payments/user/transactions', { params });
  return data;
};
