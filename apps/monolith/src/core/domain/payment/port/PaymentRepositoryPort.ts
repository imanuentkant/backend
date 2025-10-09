import { Payment } from '../entity/Payment';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Repository Port cho Payment Entity
 */
export interface PaymentRepositoryPort {
  save(payment: Payment): Promise<Payment>;
  
  findById(id: string): Promise<Nullable<Payment>>;
  
  findByBookingId(bookingId: string): Promise<Nullable<Payment>>;
  
  findByUserId(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Payment[]>;
  
  findByStripePaymentIntentId(intentId: string): Promise<Nullable<Payment>>;
  
  update(payment: Payment): Promise<Payment>;
  
  countByUserId(userId: string): Promise<number>;
}
