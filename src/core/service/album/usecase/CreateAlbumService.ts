import { Album } from '@core/domain/album/entity/Album';
import { AlbumRepositoryPort } from '@core/domain/album/port/persistence/AlbumRepositoryPort';
import { CreateAlbumUseCase } from '@core/domain/album/usecase/CreateAlbumUseCase';

export class CreateAlbumService implements CreateAlbumUseCase {
  constructor(private readonly repo: AlbumRepositoryPort) {}

  async execute(port: { executorId: string; postId: string; title: string; description?: string }): Promise<{ id: string; title: string }> {
    const album = Album.new({ postId: port.postId, ownerId: port.executorId, title: port.title, description: port.description });
    await this.repo.insert(album);
    return { id: album.getId(), title: album.getTitle() };
  }
}

