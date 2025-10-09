import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '@core/domain/property/entity/Property';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { TypeOrmProperty } from '../entity/property/TypeOrmProperty';
import { TypeOrmPropertyLocation } from '../entity/property/TypeOrmPropertyLocation';
import { PropertyMapper } from '../mapper/PropertyMapper';
import { Optional } from '@core/common/type/CommonTypes';

@Injectable()
export class PropertyRepositoryAdapter implements PropertyRepositoryPort {
  
  constructor(
    @InjectRepository(TypeOrmProperty)
    private readonly propertyRepo: Repository<TypeOrmProperty>,
    @InjectRepository(TypeOrmPropertyLocation)
    private readonly locationRepo: Repository<TypeOrmPropertyLocation>,
  ) {}
  
  async findById(id: string): Promise<Optional<Property>> {
    const orm = await this.propertyRepo.findOne({ where: { id } });
    if (!orm) return undefined;
    
    const location = await this.locationRepo.findOne({ where: { propertyId: id } });
    return PropertyMapper.toDomain(orm, location || undefined);
  }
  
  async findByHostId(hostId: string): Promise<Property[]> {
    const orms = await this.propertyRepo.find({ 
      where: { hostId },
      order: { createdAt: 'DESC' }
    });
    
    const properties: Property[] = [];
    for (const orm of orms) {
      const location = await this.locationRepo.findOne({ where: { propertyId: orm.id } });
      properties.push(PropertyMapper.toDomain(orm, location || undefined));
    }
    
    return properties;
  }
  
  async findAll(filters?: { 
    city?: string; 
    propertyType?: string; 
    minPrice?: number; 
    maxPrice?: number;
    status?: string;
  }): Promise<Property[]> {
    const queryBuilder = this.propertyRepo.createQueryBuilder('p')
      .leftJoinAndSelect(TypeOrmPropertyLocation, 'l', 'l.property_id = p.id');
    
    if (filters?.status) {
      queryBuilder.andWhere('p.status = :status', { status: filters.status });
    } else {
      queryBuilder.andWhere('p.status = :status', { status: 'published' });
    }
    
    if (filters?.propertyType) {
      queryBuilder.andWhere('p.property_type = :type', { type: filters.propertyType });
    }
    
    if (filters?.minPrice) {
      queryBuilder.andWhere('p.price_per_night >= :minPrice', { minPrice: filters.minPrice });
    }
    
    if (filters?.maxPrice) {
      queryBuilder.andWhere('p.price_per_night <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    
    if (filters?.city) {
      queryBuilder.andWhere('l.city ILIKE :city', { city: `%${filters.city}%` });
    }
    
    queryBuilder.orderBy('p.created_at', 'DESC');
    
    const orms = await queryBuilder.getMany();
    
    const properties: Property[] = [];
    for (const orm of orms) {
      const location = await this.locationRepo.findOne({ where: { propertyId: orm.id } });
      properties.push(PropertyMapper.toDomain(orm, location || undefined));
    }
    
    return properties;
  }
  
  async save(property: Property): Promise<Property> {
    const ormProperty = PropertyMapper.toOrmProperty(property);
    const savedOrm = await this.propertyRepo.save(ormProperty);
    
    // Save location if exists
    const location = property.getLocation();
    if (location) {
      const ormLocation = PropertyMapper.toOrmLocation(location);
      await this.locationRepo.save(ormLocation);
    }
    
    const savedLocation = location ? await this.locationRepo.findOne({ where: { propertyId: savedOrm.id } }) : undefined;
    return PropertyMapper.toDomain(savedOrm, savedLocation || undefined);
  }
  
  async delete(id: string): Promise<boolean> {
    // Soft delete by setting removedAt
    const result = await this.propertyRepo.update(id, { removedAt: new Date() });
    return result.affected ? result.affected > 0 : false;
  }
  
  async count(filters?: { hostId?: string; status?: string }): Promise<number> {
    const where: any = {};
    if (filters?.hostId) where.hostId = filters.hostId;
    if (filters?.status) where.status = filters.status;
    
    return this.propertyRepo.count({ where });
  }
}

