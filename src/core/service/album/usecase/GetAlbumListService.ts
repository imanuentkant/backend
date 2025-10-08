import { AlbumRepositoryPort } from '@core/domain/album/port/persistence/AlbumRepositoryPort';
import { GetAlbumListUseCase } from '@core/domain/album/usecase/GetAlbumListUseCase';

export class GetAlbumListService implements GetAlbumListUseCase {
  constructor(private readonly repo: AlbumRepositoryPort) {}

  async execute(port: { postId: string }): Promise<Array<{ id: string; title: string; description: string | null; mediaCount: number; createdAt: number }>> {
    const albums = await this.repo.findByPostId(port.postId);
    return albums.map(a => ({
      id: a.getId(),
      title: a.getTitle(),
      description: a.getDescription(),
      mediaCount: a.getMediaIds().length,
      createdAt: a.getCreatedAt().getTime(),
    }));
  }
}

