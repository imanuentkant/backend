import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type SetCoverPhotoUseCasePayload = {
  propertyId: string;
  photoId: string;
  hostId: string;
};

export class SetCoverPhotoUseCase implements UseCase<SetCoverPhotoUseCasePayload, PropertyPhoto> {
  
  constructor(
    private readonly propertyPhotoRepository: PropertyPhotoRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}
  
  async execute(payload: SetCoverPhotoUseCasePayload): Promise<PropertyPhoto> {
    // Verify property ownership
    const property = await this.propertyRepository.findById(payload.propertyId);
    if (!property) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Property with id ${payload.propertyId} not found`,
      });
    }
    
    if (property.getHostId() !== payload.hostId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'Only property owner can set cover photo',
      });
    }
    
    // Find photo
    const photo = await this.propertyPhotoRepository.findById(payload.photoId);
    if (!photo) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Photo with id ${payload.photoId} not found`,
      });
    }
    
    // Use repository method to handle cover photo logic
    await this.propertyPhotoRepository.setCover(payload.propertyId, payload.photoId);
    
    // Update property cover photo ID
    property.setCoverPhoto(payload.photoId);
    await this.propertyRepository.save(property);
    
    return photo;
  }
}
