import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { TypeOrmBooking } from '../entity/booking/TypeOrmBooking';
import { BookingMapper } from '../mapper/BookingMapper';
import { Optional } from '@core/common/type/CommonTypes';

@Injectable()
export class BookingRepositoryAdapter implements BookingRepositoryPort {
  
  constructor(
    @InjectRepository(TypeOrmBooking)
    private readonly bookingRepo: Repository<TypeOrmBooking>,
  ) {}
  
  async findById(id: string): Promise<Optional<Booking>> {
    const orm = await this.bookingRepo.findOne({ 
      where: { id },
      relations: ['property', 'guest']
    });
    return orm ? BookingMapper.toDomain(orm) : undefined;
  }
  
  async findByGuestId(guestId: string, status?: string): Promise<Booking[]> {
    const where: any = { guestId };
    if (status) where.status = status;
    
    const orms = await this.bookingRepo.find({ 
      where,
      relations: ['property'],
      order: { createdAt: 'DESC' }
    });
    
    return orms.map(orm => BookingMapper.toDomain(orm));
  }
  
  async findByPropertyId(propertyId: string, status?: string): Promise<Booking[]> {
    const where: any = { propertyId };
    if (status) where.status = status;
    
    const orms = await this.bookingRepo.find({ 
      where,
      relations: ['guest'],
      order: { checkInDate: 'ASC' }
    });
    
    return orms.map(orm => BookingMapper.toDomain(orm));
  }
  
  async findByHostId(hostId: string, status?: string): Promise<Booking[]> {
    const queryBuilder = this.bookingRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.property', 'p')
      .leftJoinAndSelect('b.guest', 'g')
      .where('p.host_id = :hostId', { hostId });
    
    if (status) {
      queryBuilder.andWhere('b.status = :status', { status });
    }
    
    queryBuilder.orderBy('b.created_at', 'DESC');
    
    const orms = await queryBuilder.getMany();
    return orms.map(orm => BookingMapper.toDomain(orm));
  }
  
  async findOverlappingBookings(
    propertyId: string, 
    checkIn: Date, 
    checkOut: Date,
    excludeBookingId?: string
  ): Promise<Booking[]> {
    const queryBuilder = this.bookingRepo.createQueryBuilder('b')
      .where('b.property_id = :propertyId', { propertyId })
      .andWhere('b.status IN (:...statuses)', { statuses: ['pending', 'confirmed'] })
      .andWhere(
        '(b.check_in_date < :checkOut AND b.check_out_date > :checkIn)',
        { checkIn, checkOut }
      );
    
    if (excludeBookingId) {
      queryBuilder.andWhere('b.id != :excludeId', { excludeId: excludeBookingId });
    }
    
    const orms = await queryBuilder.getMany();
    return orms.map(orm => BookingMapper.toDomain(orm));
  }
  
  async save(booking: Booking): Promise<Booking> {
    const orm = BookingMapper.toOrm(booking);
    const saved = await this.bookingRepo.save(orm);
    return BookingMapper.toDomain(saved);
  }
  
  async delete(id: string): Promise<boolean> {
    const result = await this.bookingRepo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
  
  async countByProperty(propertyId: string, status?: string): Promise<number> {
    const where: any = { propertyId };
    if (status) where.status = status;
    return this.bookingRepo.count({ where });
  }
  
  async calculateEarnings(hostId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const queryBuilder = this.bookingRepo.createQueryBuilder('b')
      .select('SUM(b.total_amount)', 'total')
      .leftJoin('b.property', 'p')
      .where('p.host_id = :hostId', { hostId })
      .andWhere('b.status = :status', { status: 'confirmed' });
    
    if (startDate) {
      queryBuilder.andWhere('b.check_in_date >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('b.check_out_date <= :endDate', { endDate });
    }
    
    const result = await queryBuilder.getRawOne();
    return Number(result?.total || 0);
  }
}

