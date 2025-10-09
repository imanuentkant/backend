import { Entity } from '@core/common/entity/Entity';

/**
 * DatingSettings Entity - User preferences for dating
 */
export class DatingSettings extends Entity<string> {
  private customerId: string;
  private maxDistance: number; // km
  private ageMin: number;
  private ageMax: number;
  private showDistance: boolean;
  private showAge: boolean;
  private onlyShowVerified: boolean;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    customerId: string;
    maxDistance?: number;
    ageMin?: number;
    ageMax?: number;
    showDistance?: boolean;
    showAge?: boolean;
    onlyShowVerified?: boolean;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.customerId = payload.customerId;
    this.maxDistance = payload.maxDistance || 50; // Default 50km
    this.ageMin = payload.ageMin || 18;
    this.ageMax = payload.ageMax || 99;
    this.showDistance = payload.showDistance !== undefined ? payload.showDistance : true;
    this.showAge = payload.showAge !== undefined ? payload.showAge : true;
    this.onlyShowVerified = payload.onlyShowVerified || false;
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getCustomerId(): string { return this.customerId; }
  public getMaxDistance(): number { return this.maxDistance; }
  public getAgeMin(): number { return this.ageMin; }
  public getAgeMax(): number { return this.ageMax; }
  public getShowDistance(): boolean { return this.showDistance; }
  public getShowAge(): boolean { return this.showAge; }
  public getOnlyShowVerified(): boolean { return this.onlyShowVerified; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  // Business methods
  public updateDistance(distance: number): void {
    if (distance < 1 || distance > 100) {
      throw new Error('Distance must be between 1 and 100 km');
    }
    this.maxDistance = distance;
    this.updatedAt = new Date();
  }

  public updateAgeRange(min: number, max: number): void {
    if (min < 18 || max > 99 || min > max) {
      throw new Error('Invalid age range');
    }
    this.ageMin = min;
    this.ageMax = max;
    this.updatedAt = new Date();
  }

  public hideDistance(): void {
    this.showDistance = false;
    this.updatedAt = new Date();
  }

  public hideAge(): void {
    this.showAge = false;
    this.updatedAt = new Date();
  }
}
