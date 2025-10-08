import { Refund } from '../entity/Refund';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Repository Port cho Refund Entity
 */
export interface RefundRepositoryPort {
  save(refund: Refund): Promise<Refund>;
  
  findById(id: string): Promise<Nullable<Refund>>;
  
  findByPaymentId(paymentId: string): Promise<Refund[]>;
  
  findByUserId(userId: string): Promise<Refund[]>;
  
  update(refund: Refund): Promise<Refund>;
}
