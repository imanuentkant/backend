import { Refund } from '@core/domain/payment/entity/Refund';
import { TypeOrmRefund } from '../entity/payment/TypeOrmRefund';

export class RefundMapper {
  public static toDomain(ormEntity: TypeOrmRefund): Refund {
    return new Refund({
      id: ormEntity.id,
      paymentId: ormEntity.payment_id,
      userId: ormEntity.user_id,
      amount: Number(ormEntity.amount),
      currency: ormEntity.currency,
      status: ormEntity.status,
      reason: ormEntity.reason || undefined,
      stripeRefundId: ormEntity.stripe_refund_id || undefined,
      processedAt: ormEntity.processed_at || undefined,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: Refund): TypeOrmRefund {
    const ormEntity = new TypeOrmRefund();
    ormEntity.id = domainEntity.getId();
    ormEntity.payment_id = domainEntity.getPaymentId();
    ormEntity.user_id = domainEntity.getUserId();
    ormEntity.amount = domainEntity.getAmount();
    ormEntity.currency = domainEntity.getCurrency();
    ormEntity.status = domainEntity.getStatus();
    ormEntity.reason = domainEntity.getReason() || null;
    ormEntity.stripe_refund_id = domainEntity.getStripeRefundId() || null;
    ormEntity.processed_at = domainEntity.getProcessedAt() || null;
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}
