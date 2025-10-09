import { Subscription } from '../entity/Subscription';
import { Nullable } from '@core/common/type/CommonTypes';

export interface SubscriptionRepositoryPort {
  save(subscription: Subscription): Promise<Subscription>;
  
  findById(id: string): Promise<Nullable<Subscription>>;
  
  findByCustomerId(customerId: string): Promise<Nullable<Subscription>>;
  
  findActiveByCustomerId(customerId: string): Promise<Nullable<Subscription>>;
  
  update(subscription: Subscription): Promise<Subscription>;
}

