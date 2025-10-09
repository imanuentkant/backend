import { PropertyCalendar } from '@core/domain/property/entity/PropertyCalendar';
import { AvailabilityRules } from '@core/domain/property/entity/AvailabilityRules';
import { TypeOrmPropertyCalendar } from '../entity/property/TypeOrmPropertyCalendar';
import { TypeOrmAvailabilityRules } from '../entity/property/TypeOrmAvailabilityRules';

export class PropertyCalendarMapper {
  public static calendarToDomain(ormEntity: TypeOrmPropertyCalendar): PropertyCalendar {
    return new PropertyCalendar({
      id: ormEntity.id,
      propertyId: ormEntity.property_id,
      date: ormEntity.date,
      isAvailable: ormEntity.is_available,
      pricePerNight: Number(ormEntity.price_per_night),
      status: ormEntity.status,
      blockReason: ormEntity.block_reason || undefined,
      bookingId: ormEntity.booking_id || undefined,
    });
  }

  public static calendarToOrm(domainEntity: PropertyCalendar): TypeOrmPropertyCalendar {
    const ormEntity = new TypeOrmPropertyCalendar();
    ormEntity.id = domainEntity.getId();
    ormEntity.property_id = domainEntity.getPropertyId();
    ormEntity.date = domainEntity.getDate();
    ormEntity.is_available = domainEntity.getIsAvailable();
    ormEntity.price_per_night = domainEntity.getPricePerNight() || 0;
    ormEntity.status = domainEntity.getStatus();
    ormEntity.block_reason = domainEntity.getBlockReason() || null;
    ormEntity.booking_id = domainEntity.getBookingId() || null;
    return ormEntity;
  }

  public static rulesToDomain(ormEntity: TypeOrmAvailabilityRules): AvailabilityRules {
    return new AvailabilityRules({
      propertyId: ormEntity.property_id,
      advanceNoticeDays: ormEntity.advance_notice_days,
      preparationDays: ormEntity.preparation_days,
      bookingWindowMonths: ormEntity.booking_window_months,
      checkInDays: ormEntity.check_in_days,
      checkInTimeFrom: ormEntity.check_in_time_from,
      checkInTimeTo: ormEntity.check_in_time_to,
      checkOutTime: ormEntity.check_out_time,
    });
  }

  public static rulesToOrm(domainEntity: AvailabilityRules): TypeOrmAvailabilityRules {
    const ormEntity = new TypeOrmAvailabilityRules();
    ormEntity.property_id = domainEntity.getPropertyId();
    ormEntity.advance_notice_days = domainEntity.getAdvanceNoticeDays();
    ormEntity.preparation_days = domainEntity.getPreparationDays();
    ormEntity.booking_window_months = domainEntity.getBookingWindowMonths();
    ormEntity.check_in_days = domainEntity.getCheckInDays();
    ormEntity.check_in_time_from = domainEntity.getCheckInTimeFrom();
    ormEntity.check_in_time_to = domainEntity.getCheckInTimeTo();
    ormEntity.check_out_time = domainEntity.getCheckOutTime();
    return ormEntity;
  }
}
