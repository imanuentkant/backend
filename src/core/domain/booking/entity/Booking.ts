import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';
import { BookingStatus, CancellationPolicy } from '@core/common/enums/BookingEnums';

export class Booking extends TimestampedEntity<string> {
  
  private propertyId: string;
  private guestId: string;
  private checkInDate: Date;
  private checkOutDate: Date;
  private numberOfGuests: number;
  private totalNights: number;
  private pricePerNight: number;
  private subtotal: number;
  private cleaningFee: number;
  private serviceFee: number;
  private totalAmount: number;
  private currency: string;
  private status: BookingStatus;
  private cancellationPolicy: CancellationPolicy;
  private specialRequests?: string;
  private confirmedAt?: Date;
  private cancelledAt?: Date;
  private cancellationReason?: string;
  
  constructor(payload: {
    id?: string,
    propertyId: string,
    guestId: string,
    checkInDate: Date,
    checkOutDate: Date,
    numberOfGuests: number,
    pricePerNight: number,
    cleaningFee: number,
    serviceFee: number,
    currency?: string,
    status?: BookingStatus,
    cancellationPolicy?: CancellationPolicy,
    specialRequests?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.propertyId = payload.propertyId;
    this.guestId = payload.guestId;
    this.checkInDate = payload.checkInDate;
    this.checkOutDate = payload.checkOutDate;
    this.numberOfGuests = payload.numberOfGuests;
    this.pricePerNight = payload.pricePerNight;
    this.cleaningFee = payload.cleaningFee;
    this.serviceFee = payload.serviceFee;
    this.currency = payload.currency || 'USD';
    this.status = payload.status || BookingStatus.PENDING;
    this.cancellationPolicy = payload.cancellationPolicy || CancellationPolicy.FLEXIBLE;
    this.specialRequests = payload.specialRequests;
    
    // Calculate derived values
    this.totalNights = this.calculateNights();
    this.subtotal = this.pricePerNight * this.totalNights;
    this.totalAmount = this.subtotal + this.cleaningFee + this.serviceFee;
  }
  
  public static async new(payload: {
    propertyId: string,
    guestId: string,
    checkInDate: Date,
    checkOutDate: Date,
    numberOfGuests: number,
    pricePerNight: number,
    cleaningFee: number,
    serviceFee: number,
    cancellationPolicy?: CancellationPolicy,
    specialRequests?: string,
  }): Promise<Booking> {
    const booking: Booking = new Booking(payload);
    await booking.validate();
    
    return booking;
  }
  
  public async validate(): Promise<void> {
    if (this.checkInDate >= this.checkOutDate) {
      throw new Error('Check-out date must be after check-in date');
    }
    if (this.checkInDate < new Date()) {
      throw new Error('Check-in date must be in the future');
    }
    if (this.numberOfGuests <= 0) {
      throw new Error('Number of guests must be greater than 0');
    }
    if (this.totalNights <= 0) {
      throw new Error('Total nights must be greater than 0');
    }
  }
  
  private calculateNights(): number {
    const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  // Getters
  public getPropertyId(): string {
    return this.propertyId;
  }
  
  public getGuestId(): string {
    return this.guestId;
  }
  
  public getCheckInDate(): Date {
    return this.checkInDate;
  }
  
  public getCheckOutDate(): Date {
    return this.checkOutDate;
  }
  
  public getNumberOfGuests(): number {
    return this.numberOfGuests;
  }
  
  public getTotalNights(): number {
    return this.totalNights;
  }
  
  public getPricePerNight(): number {
    return this.pricePerNight;
  }
  
  public getSubtotal(): number {
    return this.subtotal;
  }
  
  public getCleaningFee(): number {
    return this.cleaningFee;
  }
  
  public getServiceFee(): number {
    return this.serviceFee;
  }
  
  public getTotalAmount(): number {
    return this.totalAmount;
  }
  
  public getCurrency(): string {
    return this.currency;
  }
  
  public getStatus(): BookingStatus {
    return this.status;
  }
  
  public getCancellationPolicy(): CancellationPolicy {
    return this.cancellationPolicy;
  }
  
  public getSpecialRequests(): string | undefined {
    return this.specialRequests;
  }
  
  public getConfirmedAt(): Date | undefined {
    return this.confirmedAt;
  }
  
  public getCancelledAt(): Date | undefined {
    return this.cancelledAt;
  }
  
  public getCancellationReason(): string | undefined {
    return this.cancellationReason;
  }
  
  // Status management
  public confirm(): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    this.status = BookingStatus.CONFIRMED;
    this.confirmedAt = new Date();
    this.updateUpdatedAt();
  }
  
  public reject(reason?: string): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be rejected');
    }
    this.status = BookingStatus.REJECTED;
    this.cancellationReason = reason;
    this.updateUpdatedAt();
  }
  
  public cancel(reason?: string): void {
    if (this.status === BookingStatus.COMPLETED || this.status === BookingStatus.CANCELLED) {
      throw new Error('Cannot cancel completed or already cancelled booking');
    }
    this.status = BookingStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.updateUpdatedAt();
  }
  
  public complete(): void {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new Error('Only confirmed bookings can be completed');
    }
    if (new Date() < this.checkOutDate) {
      throw new Error('Cannot complete booking before check-out date');
    }
    this.status = BookingStatus.COMPLETED;
    this.updateUpdatedAt();
  }
  
  /**
   * Calculate refund amount based on cancellation policy
   */
  public calculateRefundAmount(): number {
    if (this.status !== BookingStatus.CONFIRMED) {
      return 0;
    }
    
    const now = new Date();
    const daysUntilCheckIn = Math.ceil(
      (this.checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let refundPercentage = 0;
    
    switch (this.cancellationPolicy) {
      case CancellationPolicy.FLEXIBLE:
        refundPercentage = daysUntilCheckIn >= 1 ? 100 : 0;
        break;
        
      case CancellationPolicy.MODERATE:
        refundPercentage = daysUntilCheckIn >= 5 ? 100 : 50;
        break;
        
      case CancellationPolicy.STRICT:
        if (daysUntilCheckIn >= 7) {
          refundPercentage = 100;
        } else if (daysUntilCheckIn >= 1) {
          refundPercentage = 50;
        } else {
          refundPercentage = 0;
        }
        break;
    }
    
    return (this.totalAmount * refundPercentage) / 100;
  }
  
  /**
   * Check if dates overlap with another booking
   */
  public overlapsWithDate(checkIn: Date, checkOut: Date): boolean {
    return (
      (checkIn >= this.checkInDate && checkIn < this.checkOutDate) ||
      (checkOut > this.checkInDate && checkOut <= this.checkOutDate) ||
      (checkIn <= this.checkInDate && checkOut >= this.checkOutDate)
    );
  }
  
  /**
   * Check if booking is in the past
   */
  public isPast(): boolean {
    return this.checkOutDate < new Date();
  }
  
  /**
   * Check if guest can leave a review
   * (only after checkout and within 14 days)
   */
  public canLeaveReview(): boolean {
    if (this.status !== BookingStatus.COMPLETED) {
      return false;
    }
    
    const now = new Date();
    const daysSinceCheckout = Math.ceil(
      (now.getTime() - this.checkOutDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceCheckout >= 0 && daysSinceCheckout <= 14;
  }
}

