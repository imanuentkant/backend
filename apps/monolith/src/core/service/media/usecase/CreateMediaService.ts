import { Media } from '@core/domain/media/entity/Media';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/MediaFileStoragePort';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { AsyncPersistencePort } from '@core/common/port/persistence/AsyncPersistencePort';
import { CreateMediaPort } from '@core/domain/media/port/usecase/CreateMediaPort';
import { CreateMediaUseCase } from '@core/domain/media/usecase/CreateMediaUseCase';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';

export class CreateMediaService implements CreateMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    private readonly mediaFileStorage: MediaFileStoragePort,
    private readonly asyncPersistence: AsyncPersistencePort,
  ) {}
  
  public async execute(payload: CreateMediaPort): Promise<MediaUseCaseDto> {
    const fileMetaData: FileMetadata = await this.mediaFileStorage.upload(payload.file, {type: payload.type});
    const media: Media = await Media.new({
      ownerId: payload.executorId,
      name: payload.name,
      type: payload.type,
      metadata: fileMetaData,
    });
    
    await this.asyncPersistence.enqueue({ entity: 'media', action: 'create', payload: TypeSafeMedia.toPersistencePayload(media) });
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}

class TypeSafeMedia {
  static toPersistencePayload(media: Media) {
    return {
      id: media.getId(),
      ownerId: media.getOwnerId(),
      name: media.getName(),
      type: media.getType(),
      relativePath: media.getMetadata().relativePath,
      size: media.getMetadata().size,
      ext: media.getMetadata().ext,
      mimetype: media.getMetadata().mimetype,
      createdAt: media.getCreatedAt(),
      editedAt: media.getEditedAt(),
      removedAt: media.getRemovedAt(),
    };
  }
}
