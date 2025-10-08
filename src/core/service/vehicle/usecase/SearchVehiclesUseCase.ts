import { UseCase } from '@core/common/usecase/UseCase';
import { Vehicle } from '@core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoryPort } from '@core/domain/vehicle/port/VehicleRepositoryPort';
import { VehicleType } from '@core/common/enums/VehicleEnums';

export type SearchVehiclesUseCasePayload = {
  vehicleType?: VehicleType;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
};

export class SearchVehiclesUseCase implements UseCase<SearchVehiclesUseCasePayload, Vehicle[]> {
  
  constructor(private readonly vehicleRepository: VehicleRepositoryPort) {}
  
  async execute(payload: SearchVehiclesUseCasePayload): Promise<Vehicle[]> {
    return await this.vehicleRepository.findAvailable(payload);
  }
}

