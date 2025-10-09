import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';

export type ListPropertyPhotosUseCasePayload = {
  propertyId: string;
};

export class ListPropertyPhotosUseCase implements UseCase<ListPropertyPhotosUseCasePayload, PropertyPhoto[]> {
  
  constructor(private readonly propertyPhotoRepository: PropertyPhotoRepositoryPort) {}
  
  async execute(payload: ListPropertyPhotosUseCasePayload): Promise<PropertyPhoto[]> {
    return await this.propertyPhotoRepository.findByPropertyId(payload.propertyId);
  }
}
