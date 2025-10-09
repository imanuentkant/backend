import { Match } from '../entity/Match';
import { Nullable } from '@core/common/type/CommonTypes';

export interface MatchRepositoryPort {
  save(match: Match): Promise<Match>;
  
  findById(id: string): Promise<Nullable<Match>>;
  
  findByCustomers(customer1Id: string, customer2Id: string): Promise<Nullable<Match>>;
  
  findByCustomerId(customerId: string): Promise<Match[]>;
  
  update(match: Match): Promise<Match>;
  
  delete(match: Match): Promise<void>;
}
