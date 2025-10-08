import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { EditMediaPort } from '@core/domain/media/port/usecase/EditMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { EditMediaUseCase } from '@core/domain/media/usecase/EditMediaUseCase';
import { AsyncPersistencePort } from '@core/common/port/persistence/AsyncPersistencePort';

export class EditMediaService implements EditMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    private readonly asyncPersistence: AsyncPersistencePort,
  ) {}
  
  public async execute(payload: EditMediaPort): Promise<MediaUseCaseDto> {
    const media: Media = CoreAssert.notEmpty(
      await this.mediaRepository.findMedia({id: payload.mediaId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.'})
    );
    
    const hasAccess: boolean = payload.executorId === media.getOwnerId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await media.edit({name: payload.name});
    await this.asyncPersistence.enqueue({
      entity: 'media',
      action: 'update',
      payload: {
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
      }
    });
    
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}
