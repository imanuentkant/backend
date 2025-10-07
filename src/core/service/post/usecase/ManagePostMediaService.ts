import { QueryBusPort } from '@core/common/port/message/QueryBusPort';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Post } from '@core/domain/post/entity/Post';
import { PostMedia, PostMediaType } from '@core/domain/post/entity/PostMedia';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { AddPostMediaPort, RemovePostMediaPort, ReorderPostMediaPort } from '@core/domain/post/port/usecase/ManagePostMediaPort';

export interface AddPostMediaUseCase { execute(port: AddPostMediaPort): Promise<void> }
export interface RemovePostMediaUseCase { execute(port: RemovePostMediaPort): Promise<void> }
export interface ReorderPostMediaUseCase { execute(port: ReorderPostMediaPort): Promise<void> }

export class AddPostMediaService implements AddPostMediaUseCase {
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}

  public async execute(port: AddPostMediaPort): Promise<void> {
    const post = CoreAssert.notEmpty(await this.postRepository.findPost({ id: port.postId }), new Error('Post not found.'));
    const newMedia = new PostMedia({
      postId: post.getId(),
      mediaId: port.mediaId,
      type: port.type as PostMediaType,
      sortOrder: port.sortOrder ?? 0,
    });
    await this.postRepository.addPostMedia(newMedia);
  }
}

export class RemovePostMediaService implements RemovePostMediaUseCase {
  constructor(private readonly postRepository: PostRepositoryPort) {}
  public async execute(port: RemovePostMediaPort): Promise<void> {
    await this.postRepository.removePostMedia(port.postId, port.mediaId);
  }
}

export class ReorderPostMediaService implements ReorderPostMediaUseCase {
  constructor(private readonly postRepository: PostRepositoryPort) {}
  public async execute(port: ReorderPostMediaPort): Promise<void> {
    await this.postRepository.updatePostMediaOrder(port.postId, port.mediaOrders);
  }
}
