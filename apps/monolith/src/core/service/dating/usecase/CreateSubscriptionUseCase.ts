import { UseCase } from '@core/common/usecase/UseCase';
import { Subscription, SubscriptionPlan } from '@core/domain/dating/entity/Subscription';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface CreateSubscriptionUseCasePayload {
  customerId: string;
  plan: SubscriptionPlan;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export class CreateSubscriptionUseCase implements UseCase<CreateSubscriptionUseCasePayload, Subscription> {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
  ) {}

  public async execute(payload: CreateSubscriptionUseCasePayload): Promise<Subscription> {
    // Check if user already has an active subscription
    const existingSub = await this.subscriptionRepository.findActiveByCustomerId(payload.customerId);
    
    if (existingSub) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'You already have an active subscription',
      });
    }

    const subscription = new Subscription({
      customerId: payload.customerId,
      plan: payload.plan,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      stripeCustomerId: payload.stripeCustomerId,
    });

    return this.subscriptionRepository.save(subscription);
  }
}

