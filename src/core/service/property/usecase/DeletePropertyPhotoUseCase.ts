import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { FileStoragePort } from '@core/common/port/storage/FileStoragePort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type DeletePropertyPhotoUseCasePayload = {
  propertyId: string;
  photoId: string;
  hostId: string;
};

export class DeletePropertyPhotoUseCase implements UseCase<DeletePropertyPhotoUseCasePayload, void> {
  
  constructor(
    private readonly propertyPhotoRepository: PropertyPhotoRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
    private readonly fileStorage: FileStoragePort,
  ) {}
  
  async execute(payload: DeletePropertyPhotoUseCasePayload): Promise<void> {
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
        overrideMessage: 'Only property owner can delete photos',
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
    
    // Delete from storage
    // Extract key from URL or use stored path
    const urlParts = photo.getUrl().split('/');
    const key = urlParts.slice(-3).join('/'); // Extract relative path
    
    try {
      await this.fileStorage.delete('property-photos', key);
    } catch (error) {
      // Continue even if file delete fails
      console.error('Failed to delete file from storage:', error);
    }
    
    // Delete from database
    await this.propertyPhotoRepository.delete(payload.photoId);
    
    // If this was cover photo, clear it from property
    if (photo.getIsCover() && property.getCoverPhotoId() === payload.photoId) {
      // Clear cover photo by setting to empty string
      // property.setCoverPhoto(''); // Or handle in entity
    }
  }
}
