import { v7 as uuid } from 'uuid';
import { CommentRepositoryPort } from '@core/domain/comment/port/persistence/CommentRepositoryPort';
import { CreateCommentUseCase } from '@core/domain/comment/usecase/CreateCommentUseCase';
import { GetPostCommentsUseCase } from '@core/domain/comment/usecase/GetPostCommentsUseCase';

export class CreateCommentService implements CreateCommentUseCase {
  constructor(private readonly repo: CommentRepositoryPort) {}
  async execute(port: { executorId: string; postId: string; content: string; rating?: number }): Promise<{ id: string }> {
    const id = uuid();
    await this.repo.insert({ id, postId: port.postId, authorId: port.executorId, content: port.content, rating: port.rating, createdAt: new Date() });
    return { id };
  }
}

export class GetPostCommentsService implements GetPostCommentsUseCase {
  constructor(private readonly repo: CommentRepositoryPort) {}
  async execute(port: { postId: string }): Promise<Array<{ id: string; authorId: string; content: string; rating?: number; createdAt: number }>> {
    const list = await this.repo.findByPostId(port.postId);
    return list.map(c => ({ id: c.id, authorId: c.authorId, content: c.content, rating: c.rating, createdAt: c.createdAt.getTime() }));
  }
}


