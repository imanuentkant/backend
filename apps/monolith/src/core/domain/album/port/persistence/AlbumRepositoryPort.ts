import { Album } from '@core/domain/album/entity/Album';
import { Optional } from '@core/common/type/CommonTypes';

export interface AlbumRepositoryPort {
  insert(album: Album): Promise<void>;
  update(album: Album): Promise<void>;
  findById(id: string): Promise<Optional<Album>>;
  findByOwnerId(ownerId: string): Promise<Album[]>;
  findByPostId(postId: string): Promise<Album[]>;
}

