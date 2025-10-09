import apiClient from '../api-client';

export const getConversations = async () => {
  const { data } = await apiClient.get('/api/messages');
  return data;
};

export const getConversation = async (id: string) => {
  const { data } = await apiClient.get(`/api/messages/${id}`);
  return data;
};

export const sendMessage = async (params: {
  conversationId: string;
  content: string;
  attachmentUrl?: string;
}) => {
  const { data } = await apiClient.post('/api/messages', params);
  return data;
};

export const startConversation = async (params: {
  bookableType: 'property' | 'vehicle';
  bookableId: string;
  initialMessage: string;
}) => {
  const { data } = await apiClient.post('/api/messages/start', params);
  return data;
};

export const markAsRead = async (conversationId: string) => {
  const { data } = await apiClient.put(`/api/messages/${conversationId}/read`);
  return data;
};
