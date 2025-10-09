import { DatingProfile } from '../entity/DatingProfile';
import { Nullable } from '@core/common/type/CommonTypes';

export interface DatingProfileRepositoryPort {
  save(profile: DatingProfile): Promise<DatingProfile>;
  
  findById(id: string): Promise<Nullable<DatingProfile>>;
  
  findByCustomerId(customerId: string): Promise<Nullable<DatingProfile>>;
  
  findNearbyProfiles(params: {
    customerId: string;
    latitude: number;
    longitude: number;
    maxDistance: number; // km
    ageMin?: number;
    ageMax?: number;
    gender?: string[];
    limit?: number;
  }): Promise<DatingProfile[]>;
  
  update(profile: DatingProfile): Promise<DatingProfile>;
  
  delete(id: string): Promise<void>;
}
