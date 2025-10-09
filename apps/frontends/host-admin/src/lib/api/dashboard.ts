import apiClient from '../api-client';

export interface DashboardOverview {
  totalEarnings: number;
  monthlyEarnings: number;
  activeProperties: number;
  totalBookings: number;
  occupancyRate: number;
  averageRating: number;
  recentBookings: any[];
}

export const getDashboardOverview = async () => {
  const { data } = await apiClient.get('/api/host/dashboard');
  return data;
};

export const getEarningsReport = async (params: {
  period: 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await apiClient.get('/api/host/dashboard/earnings', { params });
  return data;
};

export const getOccupancyReport = async (params: {
  period: 'month' | 'year';
}) => {
  const { data } = await apiClient.get('/api/host/dashboard/occupancy', { params });
  return data;
};

export const getPerformanceMetrics = async () => {
  const { data } = await apiClient.get('/api/host/dashboard/performance');
  return data;
};

export const getRevenueProjection = async () => {
  const { data } = await apiClient.get('/api/host/dashboard/projection');
  return data;
};
