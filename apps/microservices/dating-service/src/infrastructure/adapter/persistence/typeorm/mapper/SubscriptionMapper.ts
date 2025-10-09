import { Subscription, SubscriptionPlan, SubscriptionStatus } from '@core/domain/dating/entity/Subscription';
import { TypeOrmSubscription } from '../entity/dating/TypeOrmSubscription';

export class SubscriptionMapper {
  public static toDomain(ormSub: TypeOrmSubscription): Subscription {
    return new Subscription({
      id: ormSub.id,
      customerId: ormSub.customerId,
      plan: ormSub.plan as SubscriptionPlan,
      status: ormSub.status as SubscriptionStatus,
      startDate: ormSub.startDate,
      endDate: ormSub.endDate,
      autoRenew: ormSub.autoRenew,
      stripeSubscriptionId: ormSub.stripeSubscriptionId || undefined,
      stripeCustomerId: ormSub.stripeCustomerId || undefined,
      cancelledAt: ormSub.cancelledAt || undefined,
      createdAt: ormSub.createdAt,
      updatedAt: ormSub.updatedAt,
    });
  }

  public static toORM(domainSub: Subscription): TypeOrmSubscription {
    const ormSub = new TypeOrmSubscription();
    
    if (domainSub.getId()) {
      ormSub.id = domainSub.getId();
    }
    
    ormSub.customerId = domainSub.getCustomerId();
    ormSub.plan = domainSub.getPlan();
    ormSub.status = domainSub.getStatus();
    ormSub.startDate = domainSub.getStartDate();
    ormSub.endDate = domainSub.getEndDate();
    ormSub.autoRenew = domainSub.getAutoRenew();
    ormSub.stripeSubscriptionId = domainSub.getStripeSubscriptionId();
    ormSub.stripeCustomerId = domainSub.getStripeCustomerId();
    ormSub.cancelledAt = domainSub.getCancelledAt();
    ormSub.createdAt = domainSub.getCreatedAt();
    ormSub.updatedAt = domainSub.getUpdatedAt();

    return ormSub;
  }
}

