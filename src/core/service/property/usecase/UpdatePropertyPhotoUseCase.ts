import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type UpdatePropertyPhotoUseCasePayload = {
  photoId: string;
  caption?: string;
  isCover?: boolean;
};

export class UpdatePropertyPhotoUseCase implements UseCase<UpdatePropertyPhotoUseCasePayload, PropertyPhoto> {
  
  constructor(private readonly propertyPhotoRepository: PropertyPhotoRepositoryPort) {}
  
  async execute(payload: UpdatePropertyPhotoUseCasePayload): Promise<PropertyPhoto> {
    const photo = await this.propertyPhotoRepository.findById(payload.photoId);
    
    if (!photo) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Photo with id ${payload.photoId} not found`,
      });
    }
    
    // Update caption if provided
    if (payload.caption !== undefined) {
      photo.updateCaption(payload.caption);
    }
    
    // Update cover status if provided
    if (payload.isCover !== undefined) {
      if (payload.isCover) {
        photo.setAsCover();
      } else {
        photo.unsetAsCover();
      }
    }
    
    return await this.propertyPhotoRepository.update(photo);
  }
}
