import { Property } from '@core/domain/property/entity/Property';
import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';

export interface PropertyRepositoryPort {
  
  /**
   * Tìm property theo ID
   */
  findById(id: string): Promise<Property | null>;
  
  /**
   * Tìm tất cả properties với options
   */
  findAll(options?: RepositoryFindOptions): Promise<Property[]>;
  
  /**
   * Tìm properties theo host ID
   */
  findByHostId(hostId: string, options?: RepositoryFindOptions): Promise<Property[]>;
  
  /**
   * Lưu property (create hoặc update)
   */
  save(property: Property): Promise<Property>;
  
  /**
   * Xóa property
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Count tổng số properties
   */
  count(filters?: any): Promise<number>;
  
  /**
   * Search properties với criteria
   */
  search(criteria: PropertySearchCriteria): Promise<{
    properties: Property[];
    total: number;
  }>;
}

export interface PropertySearchCriteria {
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  instantBooking?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

