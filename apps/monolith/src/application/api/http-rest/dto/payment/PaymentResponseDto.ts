import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentResponseDto {
  @ApiProperty()
  paymentIntentId: string;

  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  message: string;
}

export class ConfirmPaymentResponseDto {
  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  stripePaymentIntentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  message: string;
}

export class PaymentDetailsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  breakdown: {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
  };

  @ApiProperty()
  payer: {
    id: string;
    name: string;
  };

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  completedAt?: string;
}

export class CreateRefundResponseDto {
  @ApiProperty()
  refundId: string;

  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reason?: string;

  @ApiProperty()
  processedIn: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  message: string;
}

export class TransactionHistoryResponseDto {
  @ApiProperty()
  data: Array<{
    id: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    date: string;
  }>;

  @ApiProperty()
  meta: {
    page: number;
    total: number;
  };
}

export class HostPayoutsResponseDto {
  @ApiProperty()
  data: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    paidAt?: string;
    expectedArrival?: string;
  }>;

  @ApiProperty()
  summary: {
    totalEarnings: number;
    pendingPayouts: number;
    availableForPayout: number;
    nextPayoutDate: string | null;
  };
}
