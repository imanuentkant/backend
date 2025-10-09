import { Booking } from '../entity/Booking';
import { Optional } from '@core/common/type/CommonTypes';

export interface BookingRepositoryPort {
  findById(id: string): Promise<Optional<Booking>>;
  findByGuestId(guestId: string, status?: string): Promise<Booking[]>;
  findByPropertyId(propertyId: string, status?: string): Promise<Booking[]>;
  findByHostId(hostId: string, status?: string): Promise<Booking[]>;
  findOverlappingBookings(
    propertyId: string, 
    checkIn: Date, 
    checkOut: Date,
    excludeBookingId?: string
  ): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  delete(id: string): Promise<boolean>;
  countByProperty(propertyId: string, status?: string): Promise<number>;
  calculateEarnings(hostId: string, startDate?: Date, endDate?: Date): Promise<number>;
}

