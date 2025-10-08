import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Album } from '@core/domain/album/entity/Album';
import { AlbumRepositoryPort } from '@core/domain/album/port/persistence/AlbumRepositoryPort';
import { GetAlbumUseCase } from '@core/domain/album/usecase/GetAlbumUseCase';

export class GetAlbumService implements GetAlbumUseCase {
  constructor(private readonly repo: AlbumRepositoryPort) {}

  async execute(port: { albumId: string }): Promise<{ id: string; postId: string; ownerId: string; title: string; description: string | null; mediaIds: string[]; createdAt: number }> {
    const album: Album = CoreAssert.notEmpty(
      await this.repo.findById(port.albumId),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Album not found' })
    );
    return {
      id: album.getId(),
      postId: album.getPostId(),
      ownerId: album.getOwnerId(),
      title: album.getTitle(),
      description: album.getDescription(),
      mediaIds: album.getMediaIds(),
      createdAt: album.getCreatedAt().getTime(),
    };
  }
}

