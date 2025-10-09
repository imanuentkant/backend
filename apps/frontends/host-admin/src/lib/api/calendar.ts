import apiClient from '../api-client';

export const getCalendar = async (propertyId: string, month: number, year: number) => {
  const { data } = await apiClient.get(`/api/properties/${propertyId}/calendar`, {
    params: { month, year },
  });
  return data;
};

export const updateDatePricing = async (propertyId: string, date: string, pricePerNight: number) => {
  const { data } = await apiClient.put(
    `/api/properties/${propertyId}/calendar/pricing/date`,
    { date, pricePerNight }
  );
  return data;
};

export const bulkUpdatePricing = async (
  propertyId: string,
  startDate: string,
  endDate: string,
  pricePerNight: number
) => {
  const { data } = await apiClient.put(
    `/api/properties/${propertyId}/calendar/pricing/bulk`,
    { startDate, endDate, pricePerNight }
  );
  return data;
};

export const blockDates = async (
  propertyId: string,
  startDate: string,
  endDate: string,
  reason?: string
) => {
  const { data } = await apiClient.post(`/api/properties/${propertyId}/calendar/block`, {
    startDate,
    endDate,
    reason,
  });
  return data;
};

export const unblockDates = async (propertyId: string, startDate: string, endDate: string) => {
  const { data } = await apiClient.post(`/api/properties/${propertyId}/calendar/unblock`, {
    startDate,
    endDate,
  });
  return data;
};

export const getAvailabilityRules = async (propertyId: string) => {
  const { data } = await apiClient.get(`/api/properties/${propertyId}/calendar/rules`);
  return data;
};

export const updateAvailabilityRules = async (propertyId: string, rules: any) => {
  const { data } = await apiClient.put(`/api/properties/${propertyId}/calendar/rules`, rules);
  return data;
};
