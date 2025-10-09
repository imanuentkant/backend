import { Entity } from '@core/common/entity/Entity';

/**
 * SwipeLimit Entity - Track daily swipe count
 */
export class SwipeLimit extends Entity<string> {
  private customerId: string;
  private date: Date; // Today's date
  private swipeCount: number;
  private resetAt: Date;

  constructor(payload: {
    id?: string;
    customerId: string;
    date?: Date;
    swipeCount?: number;
    resetAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.customerId = payload.customerId;
    this.date = payload.date || new Date();
    this.swipeCount = payload.swipeCount || 0;
    this.resetAt = payload.resetAt || this.calculateNextReset();
  }

  public getCustomerId(): string { return this.customerId; }
  public getDate(): Date { return this.date; }
  public getSwipeCount(): number { return this.swipeCount; }
  public getResetAt(): Date { return this.resetAt; }

  public increment(): void {
    this.swipeCount++;
  }

  public hasReachedLimit(limit: number): boolean {
    return this.swipeCount >= limit;
  }

  public shouldReset(): boolean {
    return new Date() >= this.resetAt;
  }

  public reset(): void {
    this.swipeCount = 0;
    this.date = new Date();
    this.resetAt = this.calculateNextReset();
  }

  private calculateNextReset(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
}
