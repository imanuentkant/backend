import { Entity } from '@core/common/entity/Entity';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

/**
 * Base entity với timestamp support cho Airbnb features
 * Sử dụng UUID v7 (time-based, sortable)
 */
export abstract class TimestampedEntity<TIdentifier extends string> extends Entity<TIdentifier> {
  
  protected createdAt: Date;
  protected updatedAt: Date;
  
  constructor(id?: TIdentifier, createdAt?: Date, updatedAt?: Date) {
    super();
    this.id = id || (UuidGenerator.generate() as TIdentifier);
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
  
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
  
  protected updateUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}

