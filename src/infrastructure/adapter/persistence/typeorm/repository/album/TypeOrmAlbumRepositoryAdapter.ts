import { Optional } from '@core/common/type/CommonTypes';
import { Album } from '@core/domain/album/entity/Album';
import { AlbumRepositoryPort } from '@core/domain/album/port/persistence/AlbumRepositoryPort';
import { TypeOrmAlbum } from '@infrastructure/adapter/persistence/typeorm/entity/album/TypeOrmAlbum';
import { DataSource, Repository } from 'typeorm';

export class TypeOrmAlbumRepositoryAdapter implements AlbumRepositoryPort {
  private readonly repo: Repository<TypeOrmAlbum>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(TypeOrmAlbum);
  }

  async insert(album: Album): Promise<void> {
    await this.repo.insert({
      id: album.getId(),
      postId: album.getPostId(),
      ownerId: album.getOwnerId(),
      title: album.getTitle(),
      description: album.getDescription(),
      mediaIds: album.getMediaIds(),
      createdAt: album.getCreatedAt(),
      editedAt: album.getEditedAt(),
      removedAt: album.getRemovedAt(),
    });
  }

  async update(album: Album): Promise<void> {
    await this.repo.update(album.getId(), {
      title: album.getTitle(),
      description: album.getDescription(),
      mediaIds: album.getMediaIds(),
      editedAt: album.getEditedAt(),
      removedAt: album.getRemovedAt(),
    });
  }

  async findById(id: string): Promise<Optional<Album>> {
    const row = await this.repo.findOne({ where: { id, removedAt: null as any } });
    return row ? this.toDomain(row) : undefined;
  }

  async findByOwnerId(ownerId: string): Promise<Album[]> {
    const rows = await this.repo.find({ where: { ownerId, removedAt: null as any }, order: { createdAt: 'DESC' } });
    return rows.map(r => this.toDomain(r));
  }

  async findByPostId(postId: string): Promise<Album[]> {
    const rows = await this.repo.find({ where: { postId, removedAt: null as any }, order: { createdAt: 'DESC' } });
    return rows.map(r => this.toDomain(r));
  }

  private toDomain(row: TypeOrmAlbum): Album {
    return new Album({
      id: row.id,
      postId: row.postId,
      ownerId: row.ownerId,
      title: row.title,
      description: row.description || undefined,
      mediaIds: row.mediaIds || [],
      createdAt: row.createdAt,
      editedAt: row.editedAt || null,
      removedAt: row.removedAt || null,
    });
  }
}

