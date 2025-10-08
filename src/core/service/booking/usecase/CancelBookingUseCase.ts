import { UseCase } from '@core/common/usecase/UseCase';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type CancelBookingUseCasePayload = {
  bookingId: string;
  userId: string;
  reason?: string;
};

export class CancelBookingUseCase implements UseCase<CancelBookingUseCasePayload, Booking> {
  
  constructor(private readonly bookingRepository: BookingRepositoryPort) {}
  
  async execute(payload: CancelBookingUseCasePayload): Promise<Booking> {
    const booking = await this.bookingRepository.findById(payload.bookingId);
    
    if (!booking) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Booking with id ${payload.bookingId} not found`,
      });
    }
    
    // Authorization check
    if (booking.getGuestId() !== payload.userId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You do not have permission to cancel this booking',
      });
    }
    
    // Validate status
    if (!['pending', 'confirmed'].includes(booking.getStatus())) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Booking cannot be cancelled',
      });
    }
    
    // Cancel booking
    booking.cancel(payload.reason || 'Cancelled by guest');
    
    return this.bookingRepository.save(booking);
  }
}

