import { Payout } from '@core/domain/payment/entity/Payout';
import { TypeOrmPayout } from '../entity/payment/TypeOrmPayout';

export class PayoutMapper {
  public static toDomain(ormEntity: TypeOrmPayout): Payout {
    return new Payout({
      id: ormEntity.id,
      hostId: ormEntity.host_id,
      amount: Number(ormEntity.amount),
      currency: ormEntity.currency,
      status: ormEntity.status,
      description: ormEntity.description,
      bookingIds: ormEntity.booking_ids,
      expectedArrivalDate: ormEntity.expected_arrival_date || undefined,
      paidAt: ormEntity.paid_at || undefined,
      stripePayoutId: ormEntity.stripe_payout_id || undefined,
      metadata: ormEntity.metadata || {},
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: Payout): TypeOrmPayout {
    const ormEntity = new TypeOrmPayout();
    ormEntity.id = domainEntity.getId();
    ormEntity.host_id = domainEntity.getHostId();
    ormEntity.amount = domainEntity.getAmount();
    ormEntity.currency = domainEntity.getCurrency();
    ormEntity.status = domainEntity.getStatus();
    ormEntity.description = domainEntity.getDescription();
    ormEntity.booking_ids = domainEntity.getBookingIds();
    ormEntity.expected_arrival_date = domainEntity.getExpectedArrivalDate() || null;
    ormEntity.paid_at = domainEntity.getPaidAt() || null;
    ormEntity.stripe_payout_id = domainEntity.getStripePayoutId() || null;
    ormEntity.metadata = domainEntity.getMetadata();
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}
