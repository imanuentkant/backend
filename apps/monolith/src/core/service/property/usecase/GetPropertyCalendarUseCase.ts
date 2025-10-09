import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyCalendar } from '@core/domain/property/entity/PropertyCalendar';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';

export type GetPropertyCalendarUseCasePayload = {
  propertyId: string;
  month: number;
  year: number;
};

export type CalendarDayResult = {
  date: string;
  dayOfWeek: string;
  isWeekend: boolean;
  pricePerNight: number;
  isAvailable: boolean;
  status: string;
  minimumNights: number;
  bookingId: string | null;
};

export class GetPropertyCalendarUseCase implements UseCase<GetPropertyCalendarUseCasePayload, CalendarDayResult[]> {
  
  constructor(
    private readonly calendarRepository: PropertyCalendarRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}
  
  async execute(payload: GetPropertyCalendarUseCasePayload): Promise<CalendarDayResult[]> {
    const property = await this.propertyRepository.findById(payload.propertyId);
    const defaultPrice = property?.getPricePerNight() || 100;
    const defaultMinNights = property?.getMinimumNights() || 1;
    
    // Get date range for month
    const startDate = new Date(payload.year, payload.month - 1, 1);
    const endDate = new Date(payload.year, payload.month, 0);
    
    // Get calendar data from database
    const calendarData = await this.calendarRepository.findByPropertyIdAndDateRange(
      payload.propertyId,
      startDate,
      endDate
    );
    
    // Build calendar map
    const calendarMap = new Map<string, PropertyCalendar>();
    calendarData.forEach((cal: PropertyCalendar) => {
      const dateKey = cal.getDate().toISOString().split('T')[0];
      calendarMap.set(dateKey, cal);
    });
    
    // Generate all days in month
    const daysInMonth = endDate.getDate();
    const days: CalendarDayResult[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(payload.year, payload.month - 1, day);
      const dateKey = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const calendarEntry = calendarMap.get(dateKey);
      
      days.push({
        date: dateKey,
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
        isWeekend,
        pricePerNight: calendarEntry?.getPricePerNight() || defaultPrice,
        isAvailable: calendarEntry?.getIsAvailable() ?? true,
        status: calendarEntry?.getStatus() || 'available',
        minimumNights: calendarEntry?.getMinimumNights() || defaultMinNights,
        bookingId: calendarEntry?.getBookingId() || null,
      });
    }
    
    return days;
  }
}