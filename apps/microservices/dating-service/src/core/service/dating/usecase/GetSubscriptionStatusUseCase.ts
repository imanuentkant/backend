import { UseCase } from '@core/common/usecase/UseCase';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { SubscriptionPlan } from '@core/domain/dating/entity/Subscription';

export interface GetSubscriptionStatusUseCasePayload {
  customerId: string;
}

export interface SubscriptionStatusResult {
  isPremium: boolean;
  plan: SubscriptionPlan;
  status: string;
  remainingDays: number;
  features: string[];
  endDate?: Date;
}

export class GetSubscriptionStatusUseCase implements UseCase<GetSubscriptionStatusUseCasePayload, SubscriptionStatusResult> {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
  ) {}

  public async execute(payload: GetSubscriptionStatusUseCasePayload): Promise<SubscriptionStatusResult> {
    const subscription = await this.subscriptionRepository.findByCustomerId(payload.customerId);

    if (!subscription || !subscription.isActive()) {
      return {
        isPremium: false,
        plan: SubscriptionPlan.FREE,
        status: 'free',
        remainingDays: 0,
        features: ['50 swipes per day', '1 Super Like per day'],
      };
    }

    return {
      isPremium: subscription.isPremium(),
      plan: subscription.getPlan(),
      status: subscription.getStatus(),
      remainingDays: subscription.getRemainingDays(),
      features: subscription.getFeatures(),
      endDate: subscription.getEndDate(),
    };
  }
}

