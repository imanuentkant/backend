import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { RemovePostPort } from '@core/domain/post/port/usecase/RemovePostPort';
import { RemovePostUseCase } from '@core/domain/post/usecase/RemovePostUseCase';
import { AsyncPersistencePort } from '@core/common/port/persistence/AsyncPersistencePort';

export class RemovePostService implements RemovePostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly asyncPersistence: AsyncPersistencePort,
  ) {}
  
  public async execute(payload: RemovePostPort): Promise<void> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean = payload.executorId === post.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await this.asyncPersistence.enqueue({ entity: 'post', action: 'delete', payload: { id: post.getId() } });
  }
  
}
