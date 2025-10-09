import { UseCase } from '@core/common/usecase/UseCase';
import { Payment, PaymentBreakdown } from '@core/domain/payment/entity/Payment';
import { PaymentRepositoryPort } from '@core/domain/payment/port/PaymentRepositoryPort';
import { PaymentStatus } from '@core/common/enums/BookingEnums';

export interface CreatePaymentUseCasePayload {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  breakdown: PaymentBreakdown;
  paymentMethod: string;
  stripePaymentIntentId?: string;
}

/**
 * Use Case: Tạo payment record mới
 */
export class CreatePaymentUseCase implements UseCase<CreatePaymentUseCasePayload, Payment> {
  constructor(private readonly paymentRepository: PaymentRepositoryPort) {}

  public async execute(payload: CreatePaymentUseCasePayload): Promise<Payment> {
    const payment = new Payment({
      bookingId: payload.bookingId,
      userId: payload.userId,
      amount: payload.amount,
      currency: payload.currency,
      status: PaymentStatus.PENDING,
      paymentMethod: payload.paymentMethod,
      stripePaymentIntentId: payload.stripePaymentIntentId,
      breakdown: payload.breakdown,
    });

    return this.paymentRepository.save(payment);
  }
}
