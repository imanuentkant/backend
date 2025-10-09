import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Boost Entity - Profile boost for 30 minutes
 */
export class Boost extends Entity<string> {
  private customerId: string;
  private startedAt: Date;
  private expiresAt: Date;
  private isActive: boolean;
  private createdAt: Date;

  constructor(payload: {
    id?: string;
    customerId: string;
    startedAt?: Date;
    expiresAt?: Date;
    isActive?: boolean;
    createdAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.customerId = payload.customerId;
    this.startedAt = payload.startedAt || new Date();
    
    // Default boost duration: 30 minutes
    const expiresAt = new Date(this.startedAt);
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    this.expiresAt = payload.expiresAt || expiresAt;
    
    this.isActive = payload.isActive !== undefined ? payload.isActive : true;
    this.createdAt = payload.createdAt || new Date();
  }

  // Getters
  public getCustomerId(): string {
    return this.customerId;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // Business methods
  public isCurrentlyActive(): boolean {
    const now = new Date();
    return this.isActive && now >= this.startedAt && now <= this.expiresAt;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public getRemainingMinutes(): number {
    const now = new Date();
    if (!this.isCurrentlyActive()) {
      return 0;
    }
    const remainingMs = this.expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(remainingMs / 60000)); // Convert to minutes
  }
}

