import { Booking } from '@core/domain/booking/entity/Booking';
import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';

export interface BookingRepositoryPort {
  
  /**
   * Tìm booking theo ID
   */
  findById(id: string): Promise<Booking | null>;
  
  /**
   * Tìm tất cả bookings với options
   */
  findAll(options?: RepositoryFindOptions): Promise<Booking[]>;
  
  /**
   * Tìm bookings theo guest ID
   */
  findByGuestId(guestId: string, options?: RepositoryFindOptions): Promise<Booking[]>;
  
  /**
   * Tìm bookings theo property ID
   */
  findByPropertyId(propertyId: string, options?: RepositoryFindOptions): Promise<Booking[]>;
  
  /**
   * Tìm bookings theo host ID (thông qua property)
   */
  findByHostId(hostId: string, options?: RepositoryFindOptions): Promise<Booking[]>;
  
  /**
   * Check xem property có available không trong khoảng thời gian
   */
  isPropertyAvailable(propertyId: string, checkIn: Date, checkOut: Date): Promise<boolean>;
  
  /**
   * Lấy tất cả bookings của property trong khoảng thời gian
   */
  findOverlappingBookings(
    propertyId: string, 
    checkIn: Date, 
    checkOut: Date
  ): Promise<Booking[]>;
  
  /**
   * Lưu booking
   */
  save(booking: Booking): Promise<Booking>;
  
  /**
   * Count tổng số bookings
   */
  count(filters?: any): Promise<number>;
}

