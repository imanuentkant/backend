import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmProperty } from '@infrastructure/adapter/persistence/typeorm/entity/property/TypeOrmProperty';
import { TypeOrmPropertyLocation } from '@infrastructure/adapter/persistence/typeorm/entity/property/TypeOrmPropertyLocation';
import { TypeOrmPropertyPhoto } from '@infrastructure/adapter/persistence/typeorm/entity/property/TypeOrmPropertyPhoto';
import { PropertyRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/PropertyRepositoryAdapter';
import { PropertyPhotoRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/PropertyPhotoRepositoryAdapter';
import { CreatePropertyUseCase } from '@core/service/property/usecase/CreatePropertyUseCase';
import { GetPropertyUseCase } from '@core/service/property/usecase/GetPropertyUseCase';
import { ListPropertiesUseCase } from '@core/service/property/usecase/ListPropertiesUseCase';
import { UploadPropertyPhotoUseCase } from '@core/service/property/usecase/UploadPropertyPhotoUseCase';
import { ListPropertyPhotosUseCase } from '@core/service/property/usecase/ListPropertyPhotosUseCase';
import { DeletePropertyPhotoUseCase } from '@core/service/property/usecase/DeletePropertyPhotoUseCase';
import { SetCoverPhotoUseCase } from '@core/service/property/usecase/SetCoverPhotoUseCase';
import { UpdatePropertyPhotoUseCase } from '@core/service/property/usecase/UpdatePropertyPhotoUseCase';
import { ReorderPropertyPhotosUseCase } from '@core/service/property/usecase/ReorderPropertyPhotosUseCase';
import { PropertyController } from '@application/api/http-rest/controller/PropertyController';
import { CoreDITokens } from '@core/common/di/CoreDITokens';

const propertyRepositoryProvider: Provider = {
  provide: 'PropertyRepositoryPort',
  useClass: PropertyRepositoryAdapter,
};

const createPropertyUseCaseProvider: Provider = {
  provide: CreatePropertyUseCase,
  useFactory: (repository: PropertyRepositoryAdapter) => new CreatePropertyUseCase(repository),
  inject: ['PropertyRepositoryPort'],
};

const getPropertyUseCaseProvider: Provider = {
  provide: GetPropertyUseCase,
  useFactory: (repository: PropertyRepositoryAdapter) => new GetPropertyUseCase(repository),
  inject: ['PropertyRepositoryPort'],
};

const listPropertiesUseCaseProvider: Provider = {
  provide: ListPropertiesUseCase,
  useFactory: (repository: PropertyRepositoryAdapter) => new ListPropertiesUseCase(repository),
  inject: ['PropertyRepositoryPort'],
};

// Photo repository - using real TypeORM adapter
const propertyPhotoRepositoryProvider: Provider = {
  provide: 'PropertyPhotoRepositoryPort',
  useClass: PropertyPhotoRepositoryAdapter  ,
};

const uploadPropertyPhotoUseCaseProvider: Provider = {
  provide: UploadPropertyPhotoUseCase,
  useFactory: (photoRepo: any, propertyRepo: any, fileStorage: any) => 
    new UploadPropertyPhotoUseCase(photoRepo, propertyRepo, fileStorage),
  inject: ['PropertyPhotoRepositoryPort', 'PropertyRepositoryPort', CoreDITokens.FileStorage],
};

const listPropertyPhotosUseCaseProvider: Provider = {
  provide: ListPropertyPhotosUseCase,
  useFactory: (repository: any) => new ListPropertyPhotosUseCase(repository),
  inject: ['PropertyPhotoRepositoryPort'],
};

const deletePropertyPhotoUseCaseProvider: Provider = {
  provide: DeletePropertyPhotoUseCase,
  useFactory: (photoRepo: any, propertyRepo: any, fileStorage: any) => 
    new DeletePropertyPhotoUseCase(photoRepo, propertyRepo, fileStorage),
  inject: ['PropertyPhotoRepositoryPort', 'PropertyRepositoryPort', CoreDITokens.FileStorage],
};

const setCoverPhotoUseCaseProvider: Provider = {
  provide: SetCoverPhotoUseCase,
  useFactory: (photoRepo: any, propertyRepo: any) => 
    new SetCoverPhotoUseCase(photoRepo, propertyRepo),
  inject: ['PropertyPhotoRepositoryPort', 'PropertyRepositoryPort'],
};

const updatePropertyPhotoUseCaseProvider: Provider = {
  provide: UpdatePropertyPhotoUseCase,
  useFactory: (repository: any) => new UpdatePropertyPhotoUseCase(repository),
  inject: ['PropertyPhotoRepositoryPort'],
};

const reorderPropertyPhotosUseCaseProvider: Provider = {
  provide: ReorderPropertyPhotosUseCase,
  useFactory: (repository: any) => new ReorderPropertyPhotosUseCase(repository),
  inject: ['PropertyPhotoRepositoryPort'],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmProperty, TypeOrmPropertyLocation, TypeOrmPropertyPhoto]),
  ],
  controllers: [PropertyController],
  providers: [
    propertyRepositoryProvider,
    createPropertyUseCaseProvider,
    getPropertyUseCaseProvider,
    listPropertiesUseCaseProvider,
    propertyPhotoRepositoryProvider,
    uploadPropertyPhotoUseCaseProvider,
    listPropertyPhotosUseCaseProvider,
    deletePropertyPhotoUseCaseProvider,
    setCoverPhotoUseCaseProvider,
    updatePropertyPhotoUseCaseProvider,
    reorderPropertyPhotosUseCaseProvider,
  ],
  exports: [
    'PropertyRepositoryPort',
    'PropertyPhotoRepositoryPort',
    CreatePropertyUseCase,
    GetPropertyUseCase,
    ListPropertiesUseCase,
    UploadPropertyPhotoUseCase,
    ListPropertyPhotosUseCase,
    DeletePropertyPhotoUseCase,
    SetCoverPhotoUseCase,
    UpdatePropertyPhotoUseCase,
    ReorderPropertyPhotosUseCase,
  ],
})
export class PropertyModule {}

