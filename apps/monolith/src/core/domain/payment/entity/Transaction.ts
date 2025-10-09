import { Entity } from '@core/common/entity/Entity';

/**
 * Transaction Entity - Lịch sử giao dịch của user (payment + refund + payout)
 */
export class Transaction extends Entity<string> {
  private userId: string;
  private type: TransactionType;
  private amount: number;
  private currency: string;
  private status: TransactionStatus;
  private description: string;
  private relatedEntityId: string; // paymentId, refundId, or payoutId
  private relatedEntityType: 'payment' | 'refund' | 'payout';
  private metadata: Record<string, any>;
  private date: Date;
  private createdAt: Date;

  constructor(payload: {
    id?: string;
    userId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    description: string;
    relatedEntityId: string;
    relatedEntityType: 'payment' | 'refund' | 'payout';
    metadata?: Record<string, any>;
    date?: Date;
    createdAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.userId = payload.userId;
    this.type = payload.type;
    this.amount = payload.amount;
    this.currency = payload.currency;
    this.status = payload.status;
    this.description = payload.description;
    this.relatedEntityId = payload.relatedEntityId;
    this.relatedEntityType = payload.relatedEntityType;
    this.metadata = payload.metadata || {};
    this.date = payload.date || new Date();
    this.createdAt = payload.createdAt || new Date();
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getType(): TransactionType {
    return this.type;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getStatus(): TransactionStatus {
    return this.status;
  }

  public getDescription(): string {
    return this.description;
  }

  public getRelatedEntityId(): string {
    return this.relatedEntityId;
  }

  public getRelatedEntityType(): 'payment' | 'refund' | 'payout' {
    return this.relatedEntityType;
  }

  public getMetadata(): Record<string, any> {
    return this.metadata;
  }

  public getDate(): Date {
    return this.date;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  PAYOUT = 'payout',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  IN_TRANSIT = 'in_transit',
}
