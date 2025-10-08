import { UseCase } from '@core/common/usecase/UseCase';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type ConfirmBookingUseCasePayload = {
  bookingId: string;
  hostId: string;
};

export class ConfirmBookingUseCase implements UseCase<ConfirmBookingUseCasePayload, Booking> {
  
  constructor(private readonly bookingRepository: BookingRepositoryPort) {}
  
  async execute(payload: ConfirmBookingUseCasePayload): Promise<Booking> {
    const booking = await this.bookingRepository.findById(payload.bookingId);
    
    if (!booking) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Booking with id ${payload.bookingId} not found`,
      });
    }
    
    // Validate status
    if (booking.getStatus() !== 'pending') {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Only pending bookings can be confirmed',
      });
    }
    
    // Confirm booking
    booking.confirm();
    
    return this.bookingRepository.save(booking);
  }
}

