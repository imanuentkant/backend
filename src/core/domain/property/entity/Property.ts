import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';
import { PropertyType, PropertyStatus } from '@core/common/enums/PropertyEnums';
import { PropertyLocation } from '@core/domain/property/entity/PropertyLocation';
import { Amenity } from '@core/domain/property/entity/Amenity';

export class Property extends TimestampedEntity<string> {
  
  private hostId: string;
  private title: string;
  private description: string;
  private propertyType: PropertyType;
  private maxGuests: number;
  private bedrooms: number;
  private beds: number;
  private bathrooms: number;
  private pricePerNight: number;
  private currency: string;
  private cleaningFee: number;
  private serviceFeePercentage: number;
  private minimumNights: number;
  private maximumNights: number;
  private instantBooking: boolean;
  private status: PropertyStatus;
  private location?: PropertyLocation;
  private amenities: Amenity[];
  private coverPhotoId?: string;
  
  constructor(payload: {
    id?: string,
    hostId: string,
    title: string,
    description: string,
    propertyType: PropertyType,
    maxGuests: number,
    bedrooms: number,
    beds: number,
    bathrooms: number,
    pricePerNight: number,
    currency?: string,
    cleaningFee?: number,
    serviceFeePercentage?: number,
    minimumNights?: number,
    maximumNights?: number,
    instantBooking?: boolean,
    status?: PropertyStatus,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.hostId = payload.hostId;
    this.title = payload.title;
    this.description = payload.description;
    this.propertyType = payload.propertyType;
    this.maxGuests = payload.maxGuests;
    this.bedrooms = payload.bedrooms;
    this.beds = payload.beds;
    this.bathrooms = payload.bathrooms;
    this.pricePerNight = payload.pricePerNight;
    this.currency = payload.currency || 'USD';
    this.cleaningFee = payload.cleaningFee || 0;
    this.serviceFeePercentage = payload.serviceFeePercentage || 14;
    this.minimumNights = payload.minimumNights || 1;
    this.maximumNights = payload.maximumNights || 365;
    this.instantBooking = payload.instantBooking || false;
    this.status = payload.status || PropertyStatus.DRAFT;
    this.amenities = [];
  }
  
  public static async new(payload: {
    hostId: string,
    title: string,
    description: string,
    propertyType: PropertyType,
    maxGuests: number,
    bedrooms: number,
    beds: number,
    bathrooms: number,
    pricePerNight: number,
    currency?: string,
  }): Promise<Property> {
    const property: Property = new Property(payload);
    await property.validate();
    
    return property;
  }
  
  public async validate(): Promise<void> {
    if (this.pricePerNight <= 0) {
      throw new Error('Price per night must be greater than 0');
    }
    if (this.maxGuests <= 0) {
      throw new Error('Max guests must be greater than 0');
    }
    if (this.bedrooms < 0 || this.beds < 0 || this.bathrooms < 0) {
      throw new Error('Bedrooms, beds, and bathrooms cannot be negative');
    }
    if (!this.title || this.title.length < 10) {
      throw new Error('Title must be at least 10 characters');
    }
    if (!this.description || this.description.length < 50) {
      throw new Error('Description must be at least 50 characters');
    }
  }
  
  // Getters
  public getHostId(): string {
    return this.hostId;
  }
  
  public getTitle(): string {
    return this.title;
  }
  
  public getDescription(): string {
    return this.description;
  }
  
  public getPropertyType(): PropertyType {
    return this.propertyType;
  }
  
  public getMaxGuests(): number {
    return this.maxGuests;
  }
  
  public getBedrooms(): number {
    return this.bedrooms;
  }
  
  public getBeds(): number {
    return this.beds;
  }
  
  public getBathrooms(): number {
    return this.bathrooms;
  }
  
  public getPricePerNight(): number {
    return this.pricePerNight;
  }
  
  public getCurrency(): string {
    return this.currency;
  }
  
  public getCleaningFee(): number {
    return this.cleaningFee;
  }
  
  public getServiceFeePercentage(): number {
    return this.serviceFeePercentage;
  }
  
  public getMinimumNights(): number {
    return this.minimumNights;
  }
  
  public getMaximumNights(): number {
    return this.maximumNights;
  }
  
  public isInstantBooking(): boolean {
    return this.instantBooking;
  }
  
  public getStatus(): PropertyStatus {
    return this.status;
  }
  
  public getLocation(): PropertyLocation | undefined {
    return this.location;
  }
  
  public getAmenities(): Amenity[] {
    return this.amenities;
  }
  
  public getCoverPhotoId(): string | undefined {
    return this.coverPhotoId;
  }
  
  // Setters
  public setLocation(location: PropertyLocation): void {
    this.location = location;
  }
  
  public addAmenity(amenity: Amenity): void {
    if (!this.amenities.find(a => a.getId() === amenity.getId())) {
      this.amenities.push(amenity);
    }
  }
  
  public removeAmenity(amenityId: string): void {
    this.amenities = this.amenities.filter(a => a.getId() !== amenityId);
  }
  
  public setCoverPhoto(photoId: string): void {
    this.coverPhotoId = photoId;
  }
  
  public updateDetails(payload: {
    title?: string,
    description?: string,
    maxGuests?: number,
    bedrooms?: number,
    beds?: number,
    bathrooms?: number,
    pricePerNight?: number,
    cleaningFee?: number,
    minimumNights?: number,
    maximumNights?: number,
  }): void {
    if (payload.title) this.title = payload.title;
    if (payload.description) this.description = payload.description;
    if (payload.maxGuests) this.maxGuests = payload.maxGuests;
    if (payload.bedrooms !== undefined) this.bedrooms = payload.bedrooms;
    if (payload.beds !== undefined) this.beds = payload.beds;
    if (payload.bathrooms !== undefined) this.bathrooms = payload.bathrooms;
    if (payload.pricePerNight) this.pricePerNight = payload.pricePerNight;
    if (payload.cleaningFee !== undefined) this.cleaningFee = payload.cleaningFee;
    if (payload.minimumNights) this.minimumNights = payload.minimumNights;
    if (payload.maximumNights) this.maximumNights = payload.maximumNights;
    
    this.updateUpdatedAt();
  }
  
  public activate(): void {
    if (this.status === PropertyStatus.DRAFT) {
      if (!this.location) {
        throw new Error('Cannot activate property without location');
      }
      if (this.amenities.length === 0) {
        throw new Error('Cannot activate property without amenities');
      }
      if (!this.coverPhotoId) {
        throw new Error('Cannot activate property without cover photo');
      }
    }
    this.status = PropertyStatus.ACTIVE;
    this.updateUpdatedAt();
  }
  
  public deactivate(): void {
    this.status = PropertyStatus.INACTIVE;
    this.updateUpdatedAt();
  }
  
  public enableInstantBooking(): void {
    this.instantBooking = true;
    this.updateUpdatedAt();
  }
  
  public disableInstantBooking(): void {
    this.instantBooking = false;
    this.updateUpdatedAt();
  }
  
  /**
   * Calculate total price for a booking
   */
  public calculateTotalPrice(nights: number): {
    subtotal: number,
    cleaningFee: number,
    serviceFee: number,
    total: number,
  } {
    const subtotal = this.pricePerNight * nights;
    const serviceFee = subtotal * (this.serviceFeePercentage / 100);
    const total = subtotal + this.cleaningFee + serviceFee;
    
    return {
      subtotal,
      cleaningFee: this.cleaningFee,
      serviceFee,
      total,
    };
  }
  
  /**
   * Check if booking duration is valid
   */
  public isValidBookingDuration(nights: number): boolean {
    return nights >= this.minimumNights && nights <= this.maximumNights;
  }
}

