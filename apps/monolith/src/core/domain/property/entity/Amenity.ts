import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';
import { AmenityCategory } from '@core/common/enums/PropertyEnums';

export class Amenity extends TimestampedEntity<string> {
  
  private name: string;
  private icon: string;
  private category: AmenityCategory;
  
  constructor(payload: {
    id?: string,
    name: string,
    icon: string,
    category: AmenityCategory,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.name = payload.name;
    this.icon = payload.icon;
    this.category = payload.category;
  }
  
  public static async new(payload: {
    name: string,
    icon: string,
    category: AmenityCategory,
  }): Promise<Amenity> {
    return new Amenity(payload);
  }
  
  // Getters
  public getName(): string {
    return this.name;
  }
  
  public getIcon(): string {
    return this.icon;
  }
  
  public getCategory(): AmenityCategory {
    return this.category;
  }
}

