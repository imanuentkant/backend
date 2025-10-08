import { Entity } from '@core/common/entity/Entity';
import { v4 as uuid } from 'uuid';

/**
 * Base entity với timestamp support cho Airbnb features
 */
export abstract class TimestampedEntity<TIdentifier extends string> extends Entity<TIdentifier> {
  
  protected createdAt: Date;
  protected updatedAt: Date;
  
  constructor(id?: TIdentifier, createdAt?: Date, updatedAt?: Date) {
    super();
    this.id = id || (uuid() as TIdentifier);
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

