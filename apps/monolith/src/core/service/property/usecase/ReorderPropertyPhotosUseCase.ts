import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type ReorderPropertyPhotosUseCasePayload = {
  propertyId: string;
  photoIds: string[];
};

export class ReorderPropertyPhotosUseCase implements UseCase<ReorderPropertyPhotosUseCasePayload, void> {
  
  constructor(private readonly propertyPhotoRepository: PropertyPhotoRepositoryPort) {}
  
  async execute(payload: ReorderPropertyPhotosUseCasePayload): Promise<void> {
    // Verify all photos exist and belong to property
    const photos = await this.propertyPhotoRepository.findByPropertyId(payload.propertyId);
    
    if (photos.length === 0) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `No photos found for property ${payload.propertyId}`,
      });
    }
    
    // Verify all photo IDs are valid
    const photoIds = photos.map(p => p.getId());
    const invalidIds = payload.photoIds.filter(id => !photoIds.includes(id));
    
    if (invalidIds.length > 0) {
      throw Exception.new({
        code: Code.ENTITY_VALIDATION_ERROR,
        overrideMessage: `Invalid photo IDs: ${invalidIds.join(', ')}`,
      });
    }
    
    // Update order
    await this.propertyPhotoRepository.reorder(payload.propertyId, payload.photoIds);
  }
}
