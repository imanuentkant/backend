import { Payout } from '../entity/Payout';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Repository Port cho Payout Entity
 */
export interface PayoutRepositoryPort {
  save(payout: Payout): Promise<Payout>;
  
  findById(id: string): Promise<Nullable<Payout>>;
  
  findByHostId(hostId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Payout[]>;
  
  update(payout: Payout): Promise<Payout>;
  
  getTotalEarnings(hostId: string): Promise<number>;
  
  getPendingPayouts(hostId: string): Promise<number>;
  
  getAvailableForPayout(hostId: string): Promise<number>;
}
