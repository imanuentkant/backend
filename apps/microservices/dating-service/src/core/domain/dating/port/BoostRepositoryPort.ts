import { Boost } from '../entity/Boost';
import { Nullable } from '@core/common/type/CommonTypes';

export interface BoostRepositoryPort {
  save(boost: Boost): Promise<Boost>;
  
  findById(id: string): Promise<Nullable<Boost>>;
  
  findActiveBoostByCustomerId(customerId: string): Promise<Nullable<Boost>>;
  
  findByCustomerId(customerId: string): Promise<Boost[]>;
  
  findAllActiveBoostedCustomers(): Promise<string[]>;
  
  update(boost: Boost): Promise<Boost>;
}

