import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Refund Entity - Domain model cho refund record
 */
export class Refund extends Entity<string> {
  private paymentId: string;
  private userId: string;
  private amount: number;
  private currency: string;
  private status: RefundStatus;
  private reason: Nullable<string>;
  private stripeRefundId: Nullable<string>;
  private processedAt: Nullable<Date>;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    paymentId: string;
    userId: string;
    amount: number;
    currency: string;
    status: RefundStatus;
    reason?: string;
    stripeRefundId?: string;
    processedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.paymentId = payload.paymentId;
    this.userId = payload.userId;
    this.amount = payload.amount;
    this.currency = payload.currency;
    this.status = payload.status;
    this.reason = payload.reason || null;
    this.stripeRefundId = payload.stripeRefundId || null;
    this.processedAt = payload.processedAt || null;
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getPaymentId(): string {
    return this.paymentId;
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

  public getStatus(): RefundStatus {
    return this.status;
  }

  public getReason(): Nullable<string> {
    return this.reason;
  }

  public getStripeRefundId(): Nullable<string> {
    return this.stripeRefundId;
  }

  public getProcessedAt(): Nullable<Date> {
    return this.processedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  public markAsProcessed(stripeRefundId: string): void {
    this.status = RefundStatus.COMPLETED;
    this.stripeRefundId = stripeRefundId;
    this.processedAt = new Date();
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = RefundStatus.FAILED;
    this.updatedAt = new Date();
  }
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
