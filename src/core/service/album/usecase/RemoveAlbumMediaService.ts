import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Album } from '@core/domain/album/entity/Album';
import { AlbumRepositoryPort } from '@core/domain/album/port/persistence/AlbumRepositoryPort';
import { RemoveAlbumMediaUseCase } from '@core/domain/album/usecase/RemoveAlbumMediaUseCase';

export class RemoveAlbumMediaService implements RemoveAlbumMediaUseCase {
  constructor(private readonly repo: AlbumRepositoryPort) {}

  async execute(port: { executorId: string; albumId: string; mediaId: string }): Promise<void> {
    const album: Album = CoreAssert.notEmpty(
      await this.repo.findById(port.albumId),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Album not found' })
    );
    CoreAssert.isTrue(
      album.getOwnerId() === port.executorId,
      Exception.new({ code: Code.ACCESS_DENIED_ERROR })
    );
    album.removeMedia(port.mediaId);
    await this.repo.update(album);
  }
}

