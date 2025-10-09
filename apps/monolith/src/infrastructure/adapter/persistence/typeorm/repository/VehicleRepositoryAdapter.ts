import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Vehicle } from '@core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoryPort } from '@core/domain/vehicle/port/VehicleRepositoryPort';
import { TypeOrmVehicle } from '@infrastructure/adapter/persistence/typeorm/entity/vehicle/TypeOrmVehicle';
import { VehicleMapper } from '@infrastructure/adapter/persistence/typeorm/mapper/VehicleMapper';
import { VehicleType, VehicleStatus } from '@core/common/enums/VehicleEnums';

@Injectable()
export class VehicleRepositoryAdapter implements VehicleRepositoryPort {
  
  constructor(
    @InjectRepository(TypeOrmVehicle)
    private readonly vehicleRepository: Repository<TypeOrmVehicle>,
  ) {}
  
  async save(vehicle: Vehicle): Promise<Vehicle> {
    const ormVehicle = VehicleMapper.toOrm(vehicle);
    const savedVehicle = await this.vehicleRepository.save(ormVehicle);
    return VehicleMapper.toDomain(savedVehicle);
  }
  
  async findById(id: string): Promise<Vehicle | null> {
    const ormVehicle = await this.vehicleRepository.findOne({
      where: { id },
    });
    
    return ormVehicle ? VehicleMapper.toDomain(ormVehicle) : null;
  }
  
  async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    const ormVehicles = await this.vehicleRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
    
    return ormVehicles.map(VehicleMapper.toDomain);
  }
  
  async findAvailable(filters?: {
    vehicleType?: VehicleType;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    seats?: number;
  }): Promise<Vehicle[]> {
    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.status = :status', { status: VehicleStatus.AVAILABLE });
    
    if (filters?.vehicleType) {
      queryBuilder.andWhere('vehicle.vehicleType = :vehicleType', { 
        vehicleType: filters.vehicleType 
      });
    }
    
    if (filters?.location) {
      queryBuilder.andWhere('vehicle.location ILIKE :location', { 
        location: `%${filters.location}%` 
      });
    }
    
    if (filters?.minPrice) {
      queryBuilder.andWhere('vehicle.pricePerDay >= :minPrice', { 
        minPrice: filters.minPrice 
      });
    }
    
    if (filters?.maxPrice) {
      queryBuilder.andWhere('vehicle.pricePerDay <= :maxPrice', { 
        maxPrice: filters.maxPrice 
      });
    }
    
    if (filters?.seats) {
      queryBuilder.andWhere('vehicle.seats >= :seats', { 
        seats: filters.seats 
      });
    }
    
    // TODO: Check availability against bookings if startDate and endDate provided
    
    queryBuilder.orderBy('vehicle.createdAt', 'DESC');
    
    const ormVehicles = await queryBuilder.getMany();
    return ormVehicles.map(VehicleMapper.toDomain);
  }
  
  async update(vehicle: Vehicle): Promise<Vehicle> {
    return await this.save(vehicle);
  }
  
  async delete(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
  
  async isAvailable(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean> {
    // TODO: Check against bookings table
    const vehicle = await this.findById(vehicleId);
    return vehicle?.getStatus() === VehicleStatus.AVAILABLE;
  }
}

