import { UseCase } from '@core/common/usecase/UseCase';
import { Subscription } from '@core/domain/dating/entity/Subscription';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface CancelSubscriptionUseCasePayload {
  customerId: string;
}

export class CancelSubscriptionUseCase implements UseCase<CancelSubscriptionUseCasePayload, Subscription> {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
  ) {}

  public async execute(payload: CancelSubscriptionUseCasePayload): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findActiveByCustomerId(payload.customerId);

    if (!subscription) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'No active subscription found',
      });
    }

    subscription.cancel();
    return this.subscriptionRepository.update(subscription);
  }
}

