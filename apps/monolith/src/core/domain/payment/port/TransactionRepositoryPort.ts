import { Transaction } from '../entity/Transaction';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Repository Port cho Transaction Entity
 */
export interface TransactionRepositoryPort {
  save(transaction: Transaction): Promise<Transaction>;
  
  findById(id: string): Promise<Nullable<Transaction>>;
  
  findByUserId(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]>;
  
  countByUserId(userId: string): Promise<number>;
}
