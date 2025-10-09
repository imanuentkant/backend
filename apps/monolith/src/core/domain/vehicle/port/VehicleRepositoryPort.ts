import { Vehicle } from '@core/domain/vehicle/entity/Vehicle';
import { VehicleType, VehicleStatus } from '@core/common/enums/VehicleEnums';

export interface VehicleRepositoryPort {
  save(vehicle: Vehicle): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findByOwnerId(ownerId: string): Promise<Vehicle[]>;
  findAvailable(filters?: {
    vehicleType?: VehicleType;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    seats?: number;
  }): Promise<Vehicle[]>;
  update(vehicle: Vehicle): Promise<Vehicle>;
  delete(id: string): Promise<void>;
  isAvailable(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean>;
}

