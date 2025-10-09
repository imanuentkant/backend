import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Payout Entity - Domain model cho host payout record
 */
export class Payout extends Entity<string> {
  private hostId: string;
  private amount: number;
  private currency: string;
  private status: PayoutStatus;
  private description: string;
  private bookingIds: string[];
  private expectedArrivalDate: Nullable<Date>;
  private paidAt: Nullable<Date>;
  private stripePayoutId: Nullable<string>;
  private metadata: Record<string, any>;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    hostId: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    description: string;
    bookingIds: string[];
    expectedArrivalDate?: Date;
    paidAt?: Date;
    stripePayoutId?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.hostId = payload.hostId;
    this.amount = payload.amount;
    this.currency = payload.currency;
    this.status = payload.status;
    this.description = payload.description;
    this.bookingIds = payload.bookingIds;
    this.expectedArrivalDate = payload.expectedArrivalDate || null;
    this.paidAt = payload.paidAt || null;
    this.stripePayoutId = payload.stripePayoutId || null;
    this.metadata = payload.metadata || {};
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getHostId(): string {
    return this.hostId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getStatus(): PayoutStatus {
    return this.status;
  }

  public getDescription(): string {
    return this.description;
  }

  public getBookingIds(): string[] {
    return [...this.bookingIds];
  }

  public getExpectedArrivalDate(): Nullable<Date> {
    return this.expectedArrivalDate;
  }

  public getPaidAt(): Nullable<Date> {
    return this.paidAt;
  }

  public getStripePayoutId(): Nullable<string> {
    return this.stripePayoutId;
  }

  public getMetadata(): Record<string, any> {
    return this.metadata;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  public markAsPaid(stripePayoutId: string): void {
    this.status = PayoutStatus.PAID;
    this.paidAt = new Date();
    this.stripePayoutId = stripePayoutId;
    this.updatedAt = new Date();
  }

  public markAsInTransit(): void {
    this.status = PayoutStatus.IN_TRANSIT;
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = PayoutStatus.FAILED;
    this.updatedAt = new Date();
  }

  public setExpectedArrivalDate(date: Date): void {
    this.expectedArrivalDate = date;
    this.updatedAt = new Date();
  }
}

export enum PayoutStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
