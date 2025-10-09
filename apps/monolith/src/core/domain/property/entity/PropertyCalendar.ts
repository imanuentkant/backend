import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class PropertyCalendar extends TimestampedEntity<string> {
  
  private propertyId: string;
  private date: Date;
  private isAvailable: boolean;
  private pricePerNight?: number;  // Override default price
  private minimumNights?: number;   // Override for specific date
  private status: 'available' | 'booked' | 'blocked';
  private blockReason?: string;
  private bookingId?: string;
  
  constructor(payload: {
    id?: string,
    propertyId: string,
    date: Date,
    isAvailable?: boolean,
    pricePerNight?: number,
    minimumNights?: number,
    status?: 'available' | 'booked' | 'blocked',
    blockReason?: string,
    bookingId?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.propertyId = payload.propertyId;
    this.date = payload.date;
    this.isAvailable = payload.isAvailable !== undefined ? payload.isAvailable : true;
    this.pricePerNight = payload.pricePerNight;
    this.minimumNights = payload.minimumNights;
    this.status = payload.status || 'available';
    this.blockReason = payload.blockReason;
    this.bookingId = payload.bookingId;
  }
  
  public static async new(payload: {
    propertyId: string,
    date: Date,
    pricePerNight?: number,
  }): Promise<PropertyCalendar> {
    return new PropertyCalendar(payload);
  }
  
  // Getters
  public getPropertyId(): string {
    return this.propertyId;
  }
  
  public getDate(): Date {
    return this.date;
  }
  
  public getIsAvailable(): boolean {
    return this.isAvailable;
  }
  
  public getPricePerNight(): number | undefined {
    return this.pricePerNight;
  }
  
  public getMinimumNights(): number | undefined {
    return this.minimumNights;
  }
  
  public getStatus(): 'available' | 'booked' | 'blocked' {
    return this.status;
  }
  
  public getBlockReason(): string | undefined {
    return this.blockReason;
  }
  
  public getBookingId(): string | undefined {
    return this.bookingId;
  }
  
  // Methods
  public setPrice(price: number): void {
    this.pricePerNight = price;
    this.updateUpdatedAt();
  }
  
  public block(reason?: string): void {
    this.isAvailable = false;
    this.status = 'blocked';
    this.blockReason = reason;
    this.updateUpdatedAt();
  }
  
  public unblock(): void {
    this.isAvailable = true;
    this.status = 'available';
    this.blockReason = undefined;
    this.updateUpdatedAt();
  }
  
  public bookForReservation(bookingId: string): void {
    this.isAvailable = false;
    this.status = 'booked';
    this.bookingId = bookingId;
    this.updateUpdatedAt();
  }
  
  public releaseFromBooking(): void {
    this.isAvailable = true;
    this.status = 'available';
    this.bookingId = undefined;
    this.updateUpdatedAt();
  }
  
  /**
   * Check if date is in the past
   */
  public isPast(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.date < today;
  }
  
  /**
   * Get pricing for this date (with override)
   */
  public getEffectivePrice(defaultPrice: number): number {
    return this.pricePerNight || defaultPrice;
  }
}

