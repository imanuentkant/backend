import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';
import { PaymentStatus } from '@core/common/enums/BookingEnums';

export class Payment extends TimestampedEntity<string> {
  
  private bookingId: string;
  private payerId: string;    // guest
  private payeeId: string;    // host
  private amount: number;
  private currency: string;
  private paymentMethod: string;  // stripe, paypal
  private transactionId?: string;
  private stripePaymentIntentId?: string;
  private status: PaymentStatus;
  private completedAt?: Date;
  private refundedAt?: Date;
  private refundAmount?: number;
  private metadata?: Record<string, any>;
  
  constructor(payload: {
    id?: string,
    bookingId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    currency?: string,
    paymentMethod?: string,
    status?: PaymentStatus,
    stripePaymentIntentId?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.bookingId = payload.bookingId;
    this.payerId = payload.payerId;
    this.payeeId = payload.payeeId;
    this.amount = payload.amount;
    this.currency = payload.currency || 'USD';
    this.paymentMethod = payload.paymentMethod || 'stripe';
    this.status = payload.status || PaymentStatus.PENDING;
    this.stripePaymentIntentId = payload.stripePaymentIntentId;
  }
  
  public static async new(payload: {
    bookingId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    currency?: string,
  }): Promise<Payment> {
    const payment = new Payment(payload);
    await payment.validate();
    return payment;
  }
  
  public async validate(): Promise<void> {
    if (this.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }
  }
  
  // Getters
  public getBookingId(): string {
    return this.bookingId;
  }
  
  public getPayerId(): string {
    return this.payerId;
  }
  
  public getPayeeId(): string {
    return this.payeeId;
  }
  
  public getAmount(): number {
    return this.amount;
  }
  
  public getCurrency(): string {
    return this.currency;
  }
  
  public getPaymentMethod(): string {
    return this.paymentMethod;
  }
  
  public getStatus(): PaymentStatus {
    return this.status;
  }
  
  public getStripePaymentIntentId(): string | undefined {
    return this.stripePaymentIntentId;
  }
  
  public getCompletedAt(): Date | undefined {
    return this.completedAt;
  }
  
  // Status management
  public setStripePaymentIntentId(intentId: string): void {
    this.stripePaymentIntentId = intentId;
    this.updateUpdatedAt();
  }
  
  public complete(transactionId: string): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be completed');
    }
    this.status = PaymentStatus.COMPLETED;
    this.transactionId = transactionId;
    this.completedAt = new Date();
    this.updateUpdatedAt();
  }
  
  public fail(reason?: string): void {
    if (this.status === PaymentStatus.COMPLETED) {
      throw new Error('Cannot fail a completed payment');
    }
    this.status = PaymentStatus.FAILED;
    this.metadata = { ...this.metadata, failureReason: reason };
    this.updateUpdatedAt();
  }
  
  public refund(refundAmount: number): void {
    if (this.status !== PaymentStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }
    if (refundAmount > this.amount) {
      throw new Error('Refund amount cannot exceed payment amount');
    }
    
    this.refundAmount = refundAmount;
    this.refundedAt = new Date();
    
    if (refundAmount === this.amount) {
      this.status = PaymentStatus.REFUNDED;
    } else {
      this.status = PaymentStatus.PARTIAL_REFUND;
    }
    
    this.updateUpdatedAt();
  }
  
  public getRefundAmount(): number {
    return this.refundAmount || 0;
  }
}

