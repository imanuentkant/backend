import { Property } from '../entity/Property';
import { Optional } from '@core/common/type/CommonTypes';

export interface PropertyRepositoryPort {
  findById(id: string): Promise<Optional<Property>>;
  findByHostId(hostId: string): Promise<Property[]>;
  findAll(filters?: { 
    city?: string; 
    propertyType?: string; 
    minPrice?: number; 
    maxPrice?: number;
    status?: string;
  }): Promise<Property[]>;
  save(property: Property): Promise<Property>;
  delete(id: string): Promise<boolean>;
  count(filters?: { hostId?: string; status?: string }): Promise<number>;
}

