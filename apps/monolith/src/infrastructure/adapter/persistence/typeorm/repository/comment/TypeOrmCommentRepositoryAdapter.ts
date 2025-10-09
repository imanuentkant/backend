import { CommentRepositoryPort } from '@core/domain/comment/port/persistence/CommentRepositoryPort';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmComment } from '@infrastructure/adapter/persistence/typeorm/entity/comment/TypeOrmComment';

export class TypeOrmCommentRepositoryAdapter implements CommentRepositoryPort {
  private readonly repo: Repository<TypeOrmComment>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(TypeOrmComment);
  }
  async insert(entity: { id: string; postId: string; authorId: string; content: string; rating?: number; createdAt: Date }): Promise<void> {
    await this.repo.insert({
      id: entity.id,
      postId: entity.postId,
      authorId: entity.authorId,
      content: entity.content,
      rating: entity.rating ?? null,
      createdAt: entity.createdAt,
    });
  }
  async findByPostId(postId: string): Promise<Array<{ id: string; postId: string; authorId: string; content: string; rating?: number; createdAt: Date }>> {
    const rows = await this.repo.find({ where: { postId }, order: { createdAt: 'DESC' } });
    return rows.map(r => ({ id: r.id, postId: r.postId, authorId: r.authorId, content: r.content, rating: r.rating ?? undefined, createdAt: r.createdAt }));
  }
}


