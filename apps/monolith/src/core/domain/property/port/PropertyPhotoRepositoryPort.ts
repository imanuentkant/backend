import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';

export interface PropertyPhotoRepositoryPort {
  save(photo: PropertyPhoto): Promise<PropertyPhoto>;
  findById(id: string): Promise<PropertyPhoto | null>;
  findByPropertyId(propertyId: string): Promise<PropertyPhoto[]>;
  update(photo: PropertyPhoto): Promise<PropertyPhoto>;
  delete(id: string): Promise<void>;
  setCover(propertyId: string, photoId: string): Promise<void>;
  reorder(propertyId: string, photoIds: string[]): Promise<void>;
}
