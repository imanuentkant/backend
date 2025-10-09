import { UseCase } from '@core/common/usecase/UseCase';
import { Refund, RefundStatus } from '@core/domain/payment/entity/Refund';
import { RefundRepositoryPort } from '@core/domain/payment/port/RefundRepositoryPort';
import { PaymentRepositoryPort } from '@core/domain/payment/port/PaymentRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Nullable } from '@core/common/type/CommonTypes';

export interface CreateRefundUseCasePayload {
  paymentId: string;
  userId: string;
  amount?: number; // nếu không có sẽ refund full
  reason?: string;
}

/**
 * Use Case: Tạo refund cho payment
 */
export class CreateRefundUseCase implements UseCase<CreateRefundUseCasePayload, Refund> {
  constructor(
    private readonly refundRepository: RefundRepositoryPort,
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  public async execute(payload: CreateRefundUseCasePayload): Promise<Refund> {
    // Verify payment exists và thuộc về user
    const payment = await this.paymentRepository.findById(payload.paymentId);

    if (!payment) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Payment ${payload.paymentId} not found`,
      });
    }

    if (payment.getUserId() !== payload.userId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You do not have permission to refund this payment',
      });
    }

    if (!payment.canBeRefunded()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Payment cannot be refunded',
      });
    }

    const refundAmount = payload.amount || payment.getAmount();

    const refund = new Refund({
      paymentId: payload.paymentId,
      userId: payload.userId,
      amount: refundAmount,
      currency: payment.getCurrency(),
      status: RefundStatus.PENDING,
      reason: payload.reason,
    });

    return this.refundRepository.save(refund);
  }
}
