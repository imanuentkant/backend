import { Swipe } from '../entity/Swipe';
import { Nullable } from '@core/common/type/CommonTypes';

export interface SwipeRepositoryPort {
  save(swipe: Swipe): Promise<Swipe>;
  
  findById(id: string): Promise<Nullable<Swipe>>;
  
  findByCustomers(fromCustomerId: string, toProfileId: string): Promise<Nullable<Swipe>>;
  
  findLikedProfiles(customerId: string): Promise<Swipe[]>;
  
  checkMutualLike(customer1Id: string, customer2Id: string): Promise<boolean>;
}
