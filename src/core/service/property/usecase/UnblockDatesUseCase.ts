import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';

export type UnblockDatesUseCasePayload = {
  propertyId: string;
  startDate: Date;
  endDate: Date;
};

export class UnblockDatesUseCase implements UseCase<UnblockDatesUseCasePayload, void> {
  
  constructor(private readonly calendarRepository: PropertyCalendarRepositoryPort) {}
  
  async execute(payload: UnblockDatesUseCasePayload): Promise<void> {
    await this.calendarRepository.unblockDates(
      payload.propertyId,
      payload.startDate,
      payload.endDate
    );
  }
}
