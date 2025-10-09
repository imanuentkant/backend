import { Booking } from '@core/domain/booking/entity/Booking';
import { TypeOrmBooking } from '../entity/booking/TypeOrmBooking';

export class BookingMapper {
  
  static toDomain(orm: TypeOrmBooking): Booking {
    const booking = new Booking({
      id: orm.id,
      propertyId: orm.propertyId,
      guestId: orm.guestId,
      checkInDate: orm.checkInDate,
      checkOutDate: orm.checkOutDate,
      numberOfGuests: orm.numberOfGuests,
      pricePerNight: Number(orm.pricePerNight),
      cleaningFee: Number(orm.cleaningFee),
      serviceFee: Number(orm.serviceFee),
      currency: orm.currency,
      status: orm.status as any,
      cancellationPolicy: orm.cancellationPolicy as any,
      specialRequests: orm.specialRequests || undefined,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
    
    // Set additional properties after construction
    (booking as any).totalNights = orm.totalNights;
    (booking as any).subtotal = Number(orm.subtotal);
    (booking as any).totalAmount = Number(orm.totalAmount);
    if (orm.cancellationReason) {
      (booking as any).cancellationReason = orm.cancellationReason;
    }
    if (orm.confirmedAt) {
      (booking as any).confirmedAt = orm.confirmedAt;
    }
    if (orm.cancelledAt) {
      (booking as any).cancelledAt = orm.cancelledAt;
    }
    
    return booking;
  }
  
  static toOrm(booking: Booking): TypeOrmBooking {
    const orm = new TypeOrmBooking();
    orm.id = booking.getId();
    orm.propertyId = booking.getPropertyId();
    orm.guestId = booking.getGuestId();
    orm.checkInDate = booking.getCheckInDate();
    orm.checkOutDate = booking.getCheckOutDate();
    orm.numberOfGuests = booking.getNumberOfGuests();
    orm.totalNights = booking.getTotalNights();
    orm.pricePerNight = booking.getPricePerNight();
    orm.subtotal = booking.getSubtotal();
    orm.cleaningFee = booking.getCleaningFee();
    orm.serviceFee = booking.getServiceFee();
    orm.totalAmount = booking.getTotalAmount();
    orm.currency = booking.getCurrency();
    orm.status = booking.getStatus();
    orm.cancellationPolicy = booking.getCancellationPolicy();
    orm.specialRequests = booking.getSpecialRequests() || null;
    orm.cancellationReason = booking.getCancellationReason() || null;
    orm.confirmedAt = booking.getConfirmedAt() || null;
    orm.cancelledAt = booking.getCancelledAt() || null;
    orm.createdAt = booking.getCreatedAt();
    orm.updatedAt = booking.getCreatedAt();
    return orm;
  }
}

