import { UseCase } from '@core/common/usecase/UseCase';
import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { FileStoragePort } from '@core/common/port/storage/FileStoragePort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type UploadPropertyPhotoUseCasePayload = {
  propertyId: string;
  hostId: string;
  file: Buffer;
  filename: string;
  contentType: string;
  caption?: string;
  isCover?: boolean;
  orderIndex?: number;
};

export class UploadPropertyPhotoUseCase implements UseCase<UploadPropertyPhotoUseCasePayload, PropertyPhoto> {
  
  constructor(
    private readonly propertyPhotoRepository: PropertyPhotoRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
    private readonly fileStorage: FileStoragePort,
  ) {}
  
  async execute(payload: UploadPropertyPhotoUseCasePayload): Promise<PropertyPhoto> {
    // Verify property exists and belongs to host
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
        overrideMessage: 'Only property owner can upload photos',
      });
    }
    
    // Generate photo ID and upload path
    const photoId = UuidGenerator.generate();
    const uploadPath = `properties/${payload.propertyId}/${photoId}-${payload.filename}`;
    
    // Upload file to storage (MinIO/S3)
    const uploadResult = await this.fileStorage.upload({
      bucket: 'property-photos',
      filename: uploadPath,
      buffer: payload.file,
      contentType: payload.contentType,
      metadata: {
        propertyId: payload.propertyId,
        photoId,
        uploadedBy: payload.hostId,
      },
    });
    
    // Get next order index
    const existingPhotos = await this.propertyPhotoRepository.findByPropertyId(payload.propertyId);
    const nextOrderIndex = payload.orderIndex ?? existingPhotos.length;
    
    // Create PropertyPhoto entity
    const photo = new PropertyPhoto({
      id: photoId,
      propertyId: payload.propertyId,
      mediaId: photoId,
      url: uploadResult.url,
      isCover: payload.isCover || false,
      caption: payload.caption,
      orderIndex: nextOrderIndex,
      createdAt: new Date(),
    });
    
    await photo.validate();
    
    // Save to database
    const savedPhoto = await this.propertyPhotoRepository.save(photo);
    
    // If this is cover photo, update property
    if (payload.isCover) {
      property.setCoverPhoto(photoId);
      await this.propertyRepository.save(property);
    }
    
    return savedPhoto;
  }
}
