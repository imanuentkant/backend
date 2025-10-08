import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class PropertyLocation extends TimestampedEntity<string> {
  
  private propertyId: string;
  private address: string;
  private city: string;
  private state: string;
  private country: string;
  private postalCode: string;
  private latitude: number;
  private longitude: number;
  
  constructor(payload: {
    id?: string,
    propertyId: string,
    address: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    latitude: number,
    longitude: number,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.propertyId = payload.propertyId;
    this.address = payload.address;
    this.city = payload.city;
    this.state = payload.state;
    this.country = payload.country;
    this.postalCode = payload.postalCode;
    this.latitude = payload.latitude;
    this.longitude = payload.longitude;
  }
  
  public static async new(payload: {
    propertyId: string,
    address: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    latitude: number,
    longitude: number,
  }): Promise<PropertyLocation> {
    const location: PropertyLocation = new PropertyLocation(payload);
    await location.validate();
    
    return location;
  }
  
  public async validate(): Promise<void> {
    if (!this.address || !this.city || !this.country) {
      throw new Error('Address, city, and country are required');
    }
    if (this.latitude < -90 || this.latitude > 90) {
      throw new Error('Invalid latitude');
    }
    if (this.longitude < -180 || this.longitude > 180) {
      throw new Error('Invalid longitude');
    }
  }
  
  // Getters
  public getPropertyId(): string {
    return this.propertyId;
  }
  
  public getAddress(): string {
    return this.address;
  }
  
  public getCity(): string {
    return this.city;
  }
  
  public getState(): string {
    return this.state;
  }
  
  public getCountry(): string {
    return this.country;
  }
  
  public getPostalCode(): string {
    return this.postalCode;
  }
  
  public getLatitude(): number {
    return this.latitude;
  }
  
  public getLongitude(): number {
    return this.longitude;
  }
  
  /**
   * Get full address string
   */
  public getFullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`;
  }
  
  /**
   * Calculate distance to another location (in kilometers)
   * Using Haversine formula
   */
  public calculateDistanceTo(lat: number, lng: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat - this.latitude);
    const dLon = this.toRadians(lng - this.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }
  
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

