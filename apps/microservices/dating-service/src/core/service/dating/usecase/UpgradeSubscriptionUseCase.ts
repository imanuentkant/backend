import { UseCase } from '@core/common/usecase/UseCase';
import { Subscription, SubscriptionPlan } from '@core/domain/dating/entity/Subscription';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface UpgradeSubscriptionUseCasePayload {
  customerId: string;
  newPlan: SubscriptionPlan;
}

export class UpgradeSubscriptionUseCase implements UseCase<UpgradeSubscriptionUseCasePayload, Subscription> {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
  ) {}

  public async execute(payload: UpgradeSubscriptionUseCasePayload): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findActiveByCustomerId(payload.customerId);

    if (!subscription) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'No active subscription found',
      });
    }

    // Validate upgrade path
    const currentPlan = subscription.getPlan();
    const planHierarchy = [SubscriptionPlan.FREE, SubscriptionPlan.PLUS, SubscriptionPlan.GOLD, SubscriptionPlan.PLATINUM];
    
    const currentIndex = planHierarchy.indexOf(currentPlan);
    const newIndex = planHierarchy.indexOf(payload.newPlan);

    if (newIndex <= currentIndex) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Can only upgrade to a higher plan',
      });
    }

    subscription.upgrade(payload.newPlan);
    return this.subscriptionRepository.update(subscription);
  }
}

