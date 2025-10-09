import { UseCase } from '@core/common/usecase/UseCase';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { BookingStatus } from '@core/common/enums/BookingEnums';

export type ListHostReservationsUseCasePayload = {
  hostId: string;
  status?: BookingStatus;
};

export class ListHostReservationsUseCase implements UseCase<ListHostReservationsUseCasePayload, Booking[]> {
  
  constructor(private readonly bookingRepository: BookingRepositoryPort) {}
  
  async execute(payload: ListHostReservationsUseCasePayload): Promise<Booking[]> {
    return await this.bookingRepository.findByHostId(
      payload.hostId,
      payload.status,
    );
  }
}

