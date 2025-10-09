import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';

export type BulkUpdatePricingUseCasePayload = {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  pricePerNight: number;
};

export class BulkUpdatePricingUseCase implements UseCase<BulkUpdatePricingUseCasePayload, number> {
  
  constructor(private readonly calendarRepository: PropertyCalendarRepositoryPort) {}
  
  async execute(payload: BulkUpdatePricingUseCasePayload): Promise<number> {
    // Use bulk update method from repository
    const updatedCount = await this.calendarRepository.bulkUpdateCalendarPricing(
      payload.propertyId,
      payload.startDate,
      payload.endDate,
      payload.pricePerNight
    );
    
    return updatedCount;
  }
}