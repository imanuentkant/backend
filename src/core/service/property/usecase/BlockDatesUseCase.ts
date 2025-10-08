import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';

export type BlockDatesUseCasePayload = {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
};

export class BlockDatesUseCase implements UseCase<BlockDatesUseCasePayload, void> {
  
  constructor(private readonly calendarRepository: PropertyCalendarRepositoryPort) {}
  
  async execute(payload: BlockDatesUseCasePayload): Promise<void> {
    await this.calendarRepository.blockDates(
      payload.propertyId,
      payload.startDate,
      payload.endDate,
      payload.reason
    );
  }
}
