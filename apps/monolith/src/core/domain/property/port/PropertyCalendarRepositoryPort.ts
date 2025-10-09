import { PropertyCalendar } from '../entity/PropertyCalendar';
import { AvailabilityRules } from '../entity/AvailabilityRules';
import { Nullable } from '@core/common/type/CommonTypes';

export interface PropertyCalendarRepositoryPort {
  findByPropertyIdAndDateRange(propertyId: string, startDate: Date, endDate: Date): Promise<PropertyCalendar[]>;
  saveCalendarDates(dates: PropertyCalendar[]): Promise<PropertyCalendar[]>;
  updateCalendarDate(date: PropertyCalendar): Promise<PropertyCalendar>;
  bulkUpdateCalendarPricing(propertyId: string, startDate: Date, endDate: Date, pricePerNight: number): Promise<number>;
  blockDates(propertyId: string, startDate: Date, endDate: Date, reason?: string): Promise<number>;
  unblockDates(propertyId: string, startDate: Date, endDate: Date): Promise<number>;
  
  // Availability Rules
  findAvailabilityRules(propertyId: string): Promise<Nullable<AvailabilityRules>>;
  saveAvailabilityRules(rules: AvailabilityRules): Promise<AvailabilityRules>;
}