import { UseCase } from '@core/common/usecase/UseCase';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { BookingStatus } from '@core/common/enums/BookingEnums';

export type ListUserBookingsUseCasePayload = {
  guestId: string;
  status?: BookingStatus;
};

export class ListUserBookingsUseCase implements UseCase<ListUserBookingsUseCasePayload, Booking[]> {
  
  constructor(private readonly bookingRepository: BookingRepositoryPort) {}
  
  async execute(payload: ListUserBookingsUseCasePayload): Promise<Booking[]> {
    return await this.bookingRepository.findByGuestId(
      payload.guestId,
      payload.status,
    );
  }
}

