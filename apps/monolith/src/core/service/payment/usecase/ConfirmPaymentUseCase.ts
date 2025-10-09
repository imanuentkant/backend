import { UseCase } from '@core/common/usecase/UseCase';
import { Payment } from '@core/domain/payment/entity/Payment';
import { PaymentRepositoryPort } from '@core/domain/payment/port/PaymentRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface ConfirmPaymentUseCasePayload {
  stripePaymentIntentId: string;
}

/**
 * Use Case: Confirm payment sau khi Stripe xử lý thành công
 */
export class ConfirmPaymentUseCase implements UseCase<ConfirmPaymentUseCasePayload, Payment> {
  constructor(private readonly paymentRepository: PaymentRepositoryPort) {}

  public async execute(payload: ConfirmPaymentUseCasePayload): Promise<Payment> {
    const payment = await this.paymentRepository.findByStripePaymentIntentId(
      payload.stripePaymentIntentId,
    );

    if (!payment) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Payment with Stripe intent ${payload.stripePaymentIntentId} not found`,
      });
    }

    payment.markAsCompleted();

    return this.paymentRepository.update(payment);
  }
}
