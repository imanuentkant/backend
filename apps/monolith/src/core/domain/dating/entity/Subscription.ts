import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Subscription Entity - Premium subscription management
 */
export class Subscription extends Entity<string> {
  private customerId: string;
  private plan: SubscriptionPlan;
  private status: SubscriptionStatus;
  private startDate: Date;
  private endDate: Date;
  private autoRenew: boolean;
  private stripeSubscriptionId: Nullable<string>;
  private stripeCustomerId: Nullable<string>;
  private cancelledAt: Nullable<Date>;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    customerId: string;
    plan: SubscriptionPlan;
    status?: SubscriptionStatus;
    startDate?: Date;
    endDate?: Date;
    autoRenew?: boolean;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    cancelledAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.customerId = payload.customerId;
    this.plan = payload.plan;
    this.status = payload.status || SubscriptionStatus.ACTIVE;
    this.startDate = payload.startDate || new Date();
    
    // Default: 1 month subscription
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    this.endDate = payload.endDate || endDate;
    
    this.autoRenew = payload.autoRenew !== undefined ? payload.autoRenew : true;
    this.stripeSubscriptionId = payload.stripeSubscriptionId || null;
    this.stripeCustomerId = payload.stripeCustomerId || null;
    this.cancelledAt = payload.cancelledAt || null;
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getCustomerId(): string { return this.customerId; }
  public getPlan(): SubscriptionPlan { return this.plan; }
  public getStatus(): SubscriptionStatus { return this.status; }
  public getStartDate(): Date { return this.startDate; }
  public getEndDate(): Date { return this.endDate; }
  public getAutoRenew(): boolean { return this.autoRenew; }
  public getStripeSubscriptionId(): Nullable<string> { return this.stripeSubscriptionId; }
  public getStripeCustomerId(): Nullable<string> { return this.stripeCustomerId; }
  public getCancelledAt(): Nullable<Date> { return this.cancelledAt; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  // Business methods
  public isActive(): boolean {
    const now = new Date();
    return this.status === SubscriptionStatus.ACTIVE && now <= this.endDate;
  }

  public isPremium(): boolean {
    return this.isActive() && this.plan !== SubscriptionPlan.FREE;
  }

  public cancel(): void {
    this.status = SubscriptionStatus.CANCELLED;
    this.autoRenew = false;
    this.cancelledAt = new Date();
    this.updatedAt = new Date();
  }

  public pause(): void {
    this.status = SubscriptionStatus.PAUSED;
    this.updatedAt = new Date();
  }

  public resume(): void {
    if (this.status === SubscriptionStatus.PAUSED) {
      this.status = SubscriptionStatus.ACTIVE;
      this.updatedAt = new Date();
    }
  }

  public upgrade(newPlan: SubscriptionPlan): void {
    this.plan = newPlan;
    this.updatedAt = new Date();
  }

  public getRemainingDays(): number {
    const now = new Date();
    const remaining = this.endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  }

  public getFeatures(): string[] {
    switch (this.plan) {
      case SubscriptionPlan.PLUS:
        return [
          'Unlimited swipes',
          '5 Super Likes per day',
          '1 Boost per month',
          'Rewind (undo swipe)',
        ];
      case SubscriptionPlan.GOLD:
        return [
          'All Plus features',
          'See who likes you',
          'Top Picks daily',
          'No ads',
        ];
      case SubscriptionPlan.PLATINUM:
        return [
          'All Gold features',
          'Message before matching',
          'Priority likes',
          'See read receipts',
        ];
      default:
        return ['50 swipes per day', '1 Super Like per day'];
    }
  }
}

export enum SubscriptionPlan {
  FREE = 'free',
  PLUS = 'plus',       // $9.99/month
  GOLD = 'gold',       // $19.99/month
  PLATINUM = 'platinum' // $29.99/month
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}

