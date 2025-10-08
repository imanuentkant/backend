import { Entity } from '@core/common/entity/Entity';
import { PaymentStatus } from '@core/common/enums/BookingEnums';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Payment Entity - Domain model cho payment record
 */
export class Payment extends Entity<string> {
  private bookingId: string;
  private userId: string;
  private amount: number;
  private currency: string;
  private status: PaymentStatus;
  private paymentMethod: string;
  private stripePaymentIntentId: Nullable<string>;
  private breakdown: PaymentBreakdown;
  private metadata: Record<string, any>;
  private completedAt: Nullable<Date>;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    bookingId: string;
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string;
    stripePaymentIntentId?: string;
    breakdown: PaymentBreakdown;
    metadata?: Record<string, any>;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.bookingId = payload.bookingId;
    this.userId = payload.userId;
    this.amount = payload.amount;
    this.currency = payload.currency;
    this.status = payload.status;
    this.paymentMethod = payload.paymentMethod;
    this.stripePaymentIntentId = payload.stripePaymentIntentId || null;
    this.breakdown = payload.breakdown;
    this.metadata = payload.metadata || {};
    this.completedAt = payload.completedAt || null;
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getBookingId(): string {
    return this.bookingId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getStatus(): PaymentStatus {
    return this.status;
  }

  public getPaymentMethod(): string {
    return this.paymentMethod;
  }

  public getStripePaymentIntentId(): Nullable<string> {
    return this.stripePaymentIntentId;
  }

  public getBreakdown(): PaymentBreakdown {
    return this.breakdown;
  }

  public getMetadata(): Record<string, any> {
    return this.metadata;
  }

  public getCompletedAt(): Nullable<Date> {
    return this.completedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  public markAsCompleted(): void {
    this.status = PaymentStatus.COMPLETED;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
  }

  public markAsCancelled(): void {
    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
  }

  public setStripePaymentIntentId(intentId: string): void {
    this.stripePaymentIntentId = intentId;
    this.updatedAt = new Date();
  }

  public isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  public canBeRefunded(): boolean {
    return this.status === PaymentStatus.COMPLETED && this.amount > 0;
  }
}

export interface PaymentBreakdown {
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  hostEarnings?: number;
  platformFee?: number;
}