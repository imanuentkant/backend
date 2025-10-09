import { UseCase } from '@core/common/usecase/UseCase';
import { Vehicle } from '@core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoryPort } from '@core/domain/vehicle/port/VehicleRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type GetVehicleUseCasePayload = {
  id: string;
};

export class GetVehicleUseCase implements UseCase<GetVehicleUseCasePayload, Vehicle> {
  
  constructor(private readonly vehicleRepository: VehicleRepositoryPort) {}
  
  async execute(payload: GetVehicleUseCasePayload): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(payload.id);
    
    if (!vehicle) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Vehicle with id ${payload.id} not found`,
      });
    }
    
    return vehicle;
  }
}

