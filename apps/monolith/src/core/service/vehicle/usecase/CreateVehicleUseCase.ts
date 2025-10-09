import { UseCase } from '@core/common/usecase/UseCase';
import { Vehicle } from '@core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoryPort } from '@core/domain/vehicle/port/VehicleRepositoryPort';
import { VehicleType, TransmissionType, FuelType, VehicleCondition } from '@core/common/enums/VehicleEnums';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type CreateVehicleUseCasePayload = {
  ownerId: string;
  title: string;
  description: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  seats: number;
  transmissionType: TransmissionType;
  fuelType: FuelType;
  condition: VehicleCondition;
  mileage: number;
  pricePerDay: number;
  pricePerHour?: number;
  currency?: string;
  securityDeposit?: number;
  insuranceFee?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
};

export class CreateVehicleUseCase implements UseCase<CreateVehicleUseCasePayload, Vehicle> {
  
  constructor(private readonly vehicleRepository: VehicleRepositoryPort) {}
  
  async execute(payload: CreateVehicleUseCasePayload): Promise<Vehicle> {
    const vehicle = new Vehicle({
      id: UuidGenerator.generate(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await vehicle.validate();
    
    return await this.vehicleRepository.save(vehicle);
  }
}

