import { UseCase } from '@core/common/usecase/UseCase';
import { Payment } from '@core/domain/payment/entity/Payment';
import { PaymentRepositoryPort } from '@core/domain/payment/port/PaymentRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface GetPaymentUseCasePayload {
  paymentId: string;
  userId: string; // để verify ownership
}

/**
 * Use Case: Lấy chi tiết payment
 */
export class GetPaymentUseCase implements UseCase<GetPaymentUseCasePayload, Payment> {
  constructor(private readonly paymentRepository: PaymentRepositoryPort) {}

  public async execute(payload: GetPaymentUseCasePayload): Promise<Payment> {
    const payment = await this.paymentRepository.findById(payload.paymentId);

    if (!payment) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Payment ${payload.paymentId} not found`,
      });
    }

    // Verify ownership
    if (payment.getUserId() !== payload.userId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You do not have permission to view this payment',
      });
    }

    return payment;
  }
}
