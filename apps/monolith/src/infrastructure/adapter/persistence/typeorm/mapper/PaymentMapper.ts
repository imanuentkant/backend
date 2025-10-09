import { Payment } from '@core/domain/payment/entity/Payment';
import { TypeOrmPayment } from '../entity/payment/TypeOrmPayment';

export class PaymentMapper {
  public static toDomain(ormEntity: TypeOrmPayment): Payment {
    return new Payment({
      id: ormEntity.id,
      bookingId: ormEntity.booking_id,
      userId: ormEntity.user_id,
      amount: Number(ormEntity.amount),
      currency: ormEntity.currency,
      status: ormEntity.status,
      paymentMethod: ormEntity.payment_method,
      stripePaymentIntentId: ormEntity.stripe_payment_intent_id || undefined,
      breakdown: ormEntity.breakdown,
      metadata: ormEntity.metadata || {},
      completedAt: ormEntity.completed_at || undefined,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: Payment): TypeOrmPayment {
    const ormEntity = new TypeOrmPayment();
    ormEntity.id = domainEntity.getId();
    ormEntity.booking_id = domainEntity.getBookingId();
    ormEntity.user_id = domainEntity.getUserId();
    ormEntity.amount = domainEntity.getAmount();
    ormEntity.currency = domainEntity.getCurrency();
    ormEntity.status = domainEntity.getStatus();
    ormEntity.payment_method = domainEntity.getPaymentMethod();
    ormEntity.stripe_payment_intent_id = domainEntity.getStripePaymentIntentId() || null;
    ormEntity.breakdown = domainEntity.getBreakdown();
    ormEntity.metadata = domainEntity.getMetadata();
    ormEntity.completed_at = domainEntity.getCompletedAt() || null;
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}
