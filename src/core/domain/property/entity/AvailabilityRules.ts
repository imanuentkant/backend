import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class AvailabilityRules extends TimestampedEntity<string> {
  
  private propertyId: string;
  private advanceNoticeDays: number;      // How many days in advance guest must book
  private preparationDays: number;         // Days needed to prepare between bookings
  private bookingWindowMonths: number;     // How far in advance guests can book
  private checkInDays: number[];           // [0,1,2,3,4,5,6] - 0=Sunday
  private checkOutDays: number[];
  private checkInTimeFrom: string;         // "14:00"
  private checkInTimeTo: string;           // "22:00"
  private checkOutTime: string;            // "12:00"
  
  constructor(payload: {
    id?: string,
    propertyId: string,
    advanceNoticeDays?: number,
    preparationDays?: number,
    bookingWindowMonths?: number,
    checkInDays?: number[],
    checkOutDays?: number[],
    checkInTimeFrom?: string,
    checkInTimeTo?: string,
    checkOutTime?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.propertyId = payload.propertyId;
    this.advanceNoticeDays = payload.advanceNoticeDays || 1;
    this.preparationDays = payload.preparationDays || 1;
    this.bookingWindowMonths = payload.bookingWindowMonths || 12;
    this.checkInDays = payload.checkInDays || [0,1,2,3,4,5,6]; // All days
    this.checkOutDays = payload.checkOutDays || [0,1,2,3,4,5,6];
    this.checkInTimeFrom = payload.checkInTimeFrom || '14:00';
    this.checkInTimeTo = payload.checkInTimeTo || '22:00';
    this.checkOutTime = payload.checkOutTime || '12:00';
  }
  
  public static async new(payload: {
    propertyId: string,
    advanceNoticeDays?: number,
    preparationDays?: number,
  }): Promise<AvailabilityRules> {
    return new AvailabilityRules(payload);
  }
  
  // Getters
  public getAdvanceNoticeDays(): number {
    return this.advanceNoticeDays;
  }
  
  public getPreparationDays(): number {
    return this.preparationDays;
  }
  
  public getBookingWindowMonths(): number {
    return this.bookingWindowMonths;
  }
  
  public getCheckInTimeFrom(): string {
    return this.checkInTimeFrom;
  }
  
  public getCheckInTimeTo(): string {
    return this.checkInTimeTo;
  }
  
  public getCheckOutTime(): string {
    return this.checkOutTime;
  }
  
  /**
   * Check if date is available for check-in
   */
  public canCheckInOnDate(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return this.checkInDays.includes(dayOfWeek);
  }
  
  /**
   * Check if date is available for check-out
   */
  public canCheckOutOnDate(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return this.checkOutDays.includes(dayOfWeek);
  }
  
  /**
   * Check if booking meets advance notice requirement
   */
  public meetsAdvanceNotice(checkInDate: Date): boolean {
    const now = new Date();
    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilCheckIn >= this.advanceNoticeDays;
  }
  
  /**
   * Check if date is within booking window
   */
  public withinBookingWindow(date: Date): boolean {
    const now = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + this.bookingWindowMonths);
    
    return date >= now && date <= maxDate;
  }
  
  /**
   * Calculate earliest available check-in date
   */
  public getEarliestCheckInDate(): Date {
    const earliest = new Date();
    earliest.setDate(earliest.getDate() + this.advanceNoticeDays);
    
    // Find next valid check-in day
    while (!this.canCheckInOnDate(earliest)) {
      earliest.setDate(earliest.getDate() + 1);
    }
    
    return earliest;
  }
  
  /**
   * Update rules
   */
  public updateRules(updates: {
    advanceNoticeDays?: number,
    preparationDays?: number,
    checkInDays?: number[],
    checkInTimeFrom?: string,
    checkInTimeTo?: string,
    checkOutTime?: string,
  }): void {
    if (updates.advanceNoticeDays !== undefined) {
      this.advanceNoticeDays = updates.advanceNoticeDays;
    }
    if (updates.preparationDays !== undefined) {
      this.preparationDays = updates.preparationDays;
    }
    if (updates.checkInDays) {
      this.checkInDays = updates.checkInDays;
    }
    if (updates.checkInTimeFrom) {
      this.checkInTimeFrom = updates.checkInTimeFrom;
    }
    if (updates.checkInTimeTo) {
      this.checkInTimeTo = updates.checkInTimeTo;
    }
    if (updates.checkOutTime) {
      this.checkOutTime = updates.checkOutTime;
    }
    
    this.updateUpdatedAt();
  }
}

