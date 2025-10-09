import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyCalendar } from '@core/domain/property/entity/PropertyCalendar';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';

export type GetAvailabilitySummaryUseCasePayload = {
  propertyId: string;
};

export type AvailabilitySummaryResult = {
  next30Days: {
    available: number;
    booked: number;
    blocked: number;
    occupancyRate: number;
  };
  next90Days: {
    available: number;
    booked: number;
    blocked: number;
    occupancyRate: number;
  };
};

export class GetAvailabilitySummaryUseCase implements UseCase<GetAvailabilitySummaryUseCasePayload, AvailabilitySummaryResult> {
  
  constructor(
    private readonly calendarRepository: PropertyCalendarRepositoryPort,
    private readonly bookingRepository: BookingRepositoryPort,
  ) {}
  
  async execute(payload: GetAvailabilitySummaryUseCasePayload): Promise<AvailabilitySummaryResult> {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);
    
    const in90Days = new Date();
    in90Days.setDate(in90Days.getDate() + 90);
    
    // Get calendar data
    const calendar30 = await this.calendarRepository.findByPropertyIdAndDateRange(
      payload.propertyId,
      now,
      in30Days
    );
    
    const calendar90 = await this.calendarRepository.findByPropertyIdAndDateRange(
      payload.propertyId,
      now,
      in90Days
    );
    
    // Calculate stats for next 30 days
    const available30 = calendar30.filter((c: PropertyCalendar) => c.getStatus() === 'available').length;
    const booked30 = calendar30.filter((c: PropertyCalendar) => c.getStatus() === 'booked').length;
    const blocked30 = calendar30.filter((c: PropertyCalendar) => c.getStatus() === 'blocked').length;
    const occupancy30 = 30 > 0 ? (booked30 / 30) * 100 : 0;
    
    // Calculate stats for next 90 days
    const available90 = calendar90.filter((c: PropertyCalendar) => c.getStatus() === 'available').length;
    const booked90 = calendar90.filter((c: PropertyCalendar) => c.getStatus() === 'booked').length;
    const blocked90 = calendar90.filter((c: PropertyCalendar) => c.getStatus() === 'blocked').length;
    const occupancy90 = 90 > 0 ? (booked90 / 90) * 100 : 0;
    
    return {
      next30Days: {
        available: available30,
        booked: booked30,
        blocked: blocked30,
        occupancyRate: Math.round(occupancy30 * 10) / 10,
      },
      next90Days: {
        available: available90,
        booked: booked90,
        blocked: blocked90,
        occupancyRate: Math.round(occupancy90 * 10) / 10,
      },
    };
  }
}