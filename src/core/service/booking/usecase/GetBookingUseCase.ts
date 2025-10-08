import { UseCase } from '@core/common/usecase/UseCase';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type GetBookingUseCasePayload = {
  id: string;
  userId: string;
};

export class GetBookingUseCase implements UseCase<GetBookingUseCasePayload, Booking> {
  
  constructor(private readonly bookingRepository: BookingRepositoryPort) {}
  
  async execute(payload: GetBookingUseCasePayload): Promise<Booking> {
    const booking = await this.bookingRepository.findById(payload.id);
    
    if (!booking) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Booking with id ${payload.id} not found`,
      });
    }
    
    // Authorization check: only guest or host can view
    // This is simplified - in real app, you'd also check if user is the host
    if (booking.getGuestId() !== payload.userId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You do not have permission to view this booking',
      });
    }
    
    return booking;
  }
}

