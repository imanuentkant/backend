import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class PropertyPhoto extends TimestampedEntity<string> {
  
  private propertyId: string;
  private mediaId: string;
  private url: string;
  private isCover: boolean;
  private orderIndex: number;
  private caption?: string;
  
  constructor(payload: {
    id?: string,
    propertyId: string,
    mediaId: string,
    url: string,
    isCover?: boolean,
    orderIndex?: number,
    caption?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.propertyId = payload.propertyId;
    this.mediaId = payload.mediaId;
    this.url = payload.url;
    this.isCover = payload.isCover || false;
    this.orderIndex = payload.orderIndex || 0;
    this.caption = payload.caption;
  }
  
  public static async new(payload: {
    propertyId: string,
    mediaId: string,
    url: string,
    orderIndex?: number,
  }): Promise<PropertyPhoto> {
    return new PropertyPhoto(payload);
  }
  
  // Getters
  public getPropertyId(): string {
    return this.propertyId;
  }
  
  public getMediaId(): string {
    return this.mediaId;
  }
  
  public getUrl(): string {
    return this.url;
  }
  
  public getIsCover(): boolean {
    return this.isCover;
  }
  
  public getOrderIndex(): number {
    return this.orderIndex;
  }
  
  public getCaption(): string | undefined {
    return this.caption;
  }
  
  // Methods
  public setAsCover(): void {
    this.isCover = true;
    this.updateUpdatedAt();
  }
  
  public unsetAsCover(): void {
    this.isCover = false;
    this.updateUpdatedAt();
  }
  
  public reorder(newIndex: number): void {
    this.orderIndex = newIndex;
    this.updateUpdatedAt();
  }
  
  public updateCaption(caption: string): void {
    this.caption = caption;
    this.updateUpdatedAt();
  }
}

