import apiClient from '../api-client';

export const getPropertyPhotos = async (propertyId: string) => {
  const { data } = await apiClient.get(`/api/properties/${propertyId}/photos`);
  return data;
};

export const uploadPhoto = async (propertyId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post(
    `/api/properties/${propertyId}/photos`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

export const updatePhoto = async (propertyId: string, photoId: string, caption: string) => {
  const { data } = await apiClient.put(
    `/api/properties/${propertyId}/photos/${photoId}`,
    { caption }
  );
  return data;
};

export const deletePhoto = async (propertyId: string, photoId: string) => {
  const { data } = await apiClient.delete(`/api/properties/${propertyId}/photos/${photoId}`);
  return data;
};

export const setCoverPhoto = async (propertyId: string, photoId: string) => {
  const { data } = await apiClient.put(
    `/api/properties/${propertyId}/photos/${photoId}/cover`
  );
  return data;
};

export const reorderPhotos = async (propertyId: string, photoIds: string[]) => {
  const { data } = await apiClient.post(
    `/api/properties/${propertyId}/photos/reorder`,
    { photoIds }
  );
  return data;
};
