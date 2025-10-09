import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmVehicle } from '@infrastructure/adapter/persistence/typeorm/entity/vehicle/TypeOrmVehicle';
import { VehicleRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/VehicleRepositoryAdapter';
import { CreateVehicleUseCase } from '@core/service/vehicle/usecase/CreateVehicleUseCase';
import { GetVehicleUseCase } from '@core/service/vehicle/usecase/GetVehicleUseCase';
import { SearchVehiclesUseCase } from '@core/service/vehicle/usecase/SearchVehiclesUseCase';
import { VehicleController } from '@application/api/http-rest/controller/VehicleController';

const vehicleRepositoryProvider: Provider = {
  provide: 'VehicleRepositoryPort',
  useClass: VehicleRepositoryAdapter,
};

const createVehicleUseCaseProvider: Provider = {
  provide: CreateVehicleUseCase,
  useFactory: (repository: VehicleRepositoryAdapter) => new CreateVehicleUseCase(repository),
  inject: ['VehicleRepositoryPort'],
};

const getVehicleUseCaseProvider: Provider = {
  provide: GetVehicleUseCase,
  useFactory: (repository: VehicleRepositoryAdapter) => new GetVehicleUseCase(repository),
  inject: ['VehicleRepositoryPort'],
};

const searchVehiclesUseCaseProvider: Provider = {
  provide: SearchVehiclesUseCase,
  useFactory: (repository: VehicleRepositoryAdapter) => new SearchVehiclesUseCase(repository),
  inject: ['VehicleRepositoryPort'],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmVehicle]),
  ],
  controllers: [VehicleController],
  providers: [
    vehicleRepositoryProvider,
    createVehicleUseCaseProvider,
    getVehicleUseCaseProvider,
    searchVehiclesUseCaseProvider,
  ],
  exports: [
    'VehicleRepositoryPort',
    CreateVehicleUseCase,
    GetVehicleUseCase,
    SearchVehiclesUseCase,
  ],
})
export class VehicleModule {}

