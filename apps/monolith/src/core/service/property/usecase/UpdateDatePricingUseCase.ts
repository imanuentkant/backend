import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyCalendar } from '@core/domain/property/entity/PropertyCalendar';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type UpdateDatePricingUseCasePayload = {
  propertyId: string;
  date: Date;
  pricePerNight: number;
};

export class UpdateDatePricingUseCase implements UseCase<UpdateDatePricingUseCasePayload, PropertyCalendar> {
  
  constructor(private readonly calendarRepository: PropertyCalendarRepositoryPort) {}
  
  async execute(payload: UpdateDatePricingUseCasePayload): Promise<PropertyCalendar> {
    // Find existing calendar entry for this date
    const calendars = await this.calendarRepository.findByPropertyIdAndDateRange(
      payload.propertyId,
      payload.date,
      payload.date
    );
    
    let calendar: PropertyCalendar;
    
    if (calendars.length === 0) {
      // Create new calendar entry
      calendar = new PropertyCalendar({
        id: UuidGenerator.generate(),
        propertyId: payload.propertyId,
        date: payload.date,
        pricePerNight: payload.pricePerNight,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing entry
      calendar = calendars[0];
      calendar.setPrice(payload.pricePerNight);
    }
    
    return await this.calendarRepository.updateCalendarDate(calendar);
  }
}