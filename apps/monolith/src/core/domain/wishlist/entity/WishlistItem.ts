import { Entity } from '@core/common/entity/Entity';

/**
 * WishlistItem Entity - User's saved favorite properties/vehicles
 */
export class WishlistItem extends Entity<string> {
  private userId: string;
  private bookableType: 'property' | 'vehicle';
  private bookableId: string;
  private addedAt: Date;

  constructor(payload: {
    id?: string;
    userId: string;
    bookableType: 'property' | 'vehicle';
    bookableId: string;
    addedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.userId = payload.userId;
    this.bookableType = payload.bookableType;
    this.bookableId = payload.bookableId;
    this.addedAt = payload.addedAt || new Date();
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getBookableType(): 'property' | 'vehicle' {
    return this.bookableType;
  }

  public getBookableId(): string {
    return this.bookableId;
  }

  public getAddedAt(): Date {
    return this.addedAt;
  }
}
