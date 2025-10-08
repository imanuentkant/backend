import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';
import { PropertyCalendar } from '@core/domain/property/entity/PropertyCalendar';
import { AvailabilityRules } from '@core/domain/property/entity/AvailabilityRules';
import { TypeOrmPropertyCalendar } from '../entity/property/TypeOrmPropertyCalendar';
import { TypeOrmAvailabilityRules } from '../entity/property/TypeOrmAvailabilityRules';
import { PropertyCalendarMapper } from '../mapper/PropertyCalendarMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class PropertyCalendarRepositoryAdapter implements PropertyCalendarRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmPropertyCalendar)
    private readonly calendarRepository: Repository<TypeOrmPropertyCalendar>,
    @InjectRepository(TypeOrmAvailabilityRules)
    private readonly rulesRepository: Repository<TypeOrmAvailabilityRules>,
  ) {}

  public async findByPropertyIdAndDateRange(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PropertyCalendar[]> {
    const ormEntities = await this.calendarRepository.find({
      where: {
        property_id: propertyId,
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
    return ormEntities.map((entity) => PropertyCalendarMapper.calendarToDomain(entity));
  }

  public async saveCalendarDates(dates: PropertyCalendar[]): Promise<PropertyCalendar[]> {
    const ormEntities = dates.map((date) => {
      let id = date.getId();
      if (!id) {
        id = UuidGenerator.generate();
      }
      const dateWithId = new PropertyCalendar({
        id,
        propertyId: date.getPropertyId(),
        date: date.getDate(),
        isAvailable: date.getIsAvailable(),
        pricePerNight: date.getPricePerNight(),
        status: date.getStatus(),
        blockReason: date.getBlockReason(),
        bookingId: date.getBookingId(),
      });
      return PropertyCalendarMapper.calendarToOrm(dateWithId);
    });

    const saved = await this.calendarRepository.save(ormEntities);
    return saved.map((entity) => PropertyCalendarMapper.calendarToDomain(entity));
  }

  public async findAvailabilityRules(propertyId: string): Promise<Nullable<AvailabilityRules>> {
    const ormEntity = await this.rulesRepository.findOne({
      where: { property_id: propertyId },
    });
    return ormEntity ? PropertyCalendarMapper.rulesToDomain(ormEntity) : null;
  }

  public async saveAvailabilityRules(rules: AvailabilityRules): Promise<AvailabilityRules> {
    const ormEntity = PropertyCalendarMapper.rulesToOrm(rules);
    const saved = await this.rulesRepository.save(ormEntity);
    return PropertyCalendarMapper.rulesToDomain(saved);
  }

  public async updateCalendarDate(date: PropertyCalendar): Promise<PropertyCalendar> {
    const ormEntity = PropertyCalendarMapper.calendarToOrm(date);
    const saved = await this.calendarRepository.save(ormEntity);
    return PropertyCalendarMapper.calendarToDomain(saved);
  }

  public async bulkUpdateCalendarPricing(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    pricePerNight: number,
  ): Promise<number> {
    const result = await this.calendarRepository
      .createQueryBuilder()
      .update(TypeOrmPropertyCalendar)
      .set({ price_per_night: pricePerNight })
      .where('property_id = :propertyId', { propertyId })
      .andWhere('date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .execute();

    return result.affected || 0;
  }

  public async blockDates(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    reason?: string,
  ): Promise<number> {
    const result = await this.calendarRepository
      .createQueryBuilder()
      .update(TypeOrmPropertyCalendar)
      .set({ is_available: false, status: 'blocked', block_reason: reason || null })
      .where('property_id = :propertyId', { propertyId })
      .andWhere('date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .execute();

    return result.affected || 0;
  }

  public async unblockDates(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.calendarRepository
      .createQueryBuilder()
      .update(TypeOrmPropertyCalendar)
      .set({ is_available: true, status: 'available', block_reason: null })
      .where('property_id = :propertyId', { propertyId })
      .andWhere('date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('status = :status', { status: 'blocked' })
      .execute();

    return result.affected || 0;
  }
}
