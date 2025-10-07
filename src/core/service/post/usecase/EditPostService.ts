import { Code } from '@core/common/code/Code';
import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { Exception } from '@core/common/exception/Exception';
import { QueryBusPort } from '@core/common/port/message/QueryBusPort';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { EditPostPort } from '@core/domain/post/port/usecase/EditPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { EditPostUseCase } from '@core/domain/post/usecase/EditPostUseCase';

export class EditPostService implements EditPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}
  
  public async execute(payload: EditPostPort): Promise<PostUseCaseDto> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean = payload.executorId === post.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await post.edit(
      payload.title !== undefined ? payload.title : post.getTitle(),
      payload.content !== undefined ? payload.content! : post.getContent() ?? undefined
    );
    
    await this.postRepository.updatePost(post);
    
    return {
      id: post.getId(),
      owner: {
        id: post.getOwner().getId(),
        name: post.getOwner().getName(),
        role: post.getOwner().getRole(),
      },
      title: post.getTitle(),
      content: post.getContent(),
      status: post.getStatus(),
      image: post.getCoverImage() ? { id: post.getCoverImage()!.getId(), url: post.getCoverImage()!.getRelativePath() } : undefined,
      coverImage: post.getCoverImage() ? { id: post.getCoverImage()!.getId(), url: post.getCoverImage()!.getRelativePath() } : undefined,
      galleryImages: post.getGalleryImages().map(img => ({ id: img.getId(), url: img.getRelativePath() })),
      mediaCollection: post.getMediaCollection().getAll().map(m => ({
        id: m.getId(),
        mediaId: m.getMediaId(),
        type: m.getType(),
        sortOrder: m.getSortOrder(),
        media: {
          id: m.getMediaId(),
          name: m.getMediaDetails()?.name || '',
          url: m.getMediaDetails()?.relativePath || '',
          type: m.getMediaDetails()?.type || '',
          size: m.getMediaDetails()?.size || 0,
          ext: m.getMediaDetails()?.ext || '',
          mimetype: m.getMediaDetails()?.mimetype || '',
        }
      })),
      createdAt: post.getCreatedAt().getTime(),
      editedAt: post.getEditedAt()?.getTime(),
      publishedAt: post.getPublishedAt()?.getTime(),
    };
  }
  
  /** ¯\_(ツ)_/¯ **/
  private async defineNewImage(payload: EditPostPort, post: Post): Promise<Optional<Nullable<PostImage>>> {
    let newPostImage: Optional<Nullable<PostImage>>;
    
    const needUpdateImage: boolean = !! (payload.imageId && payload.imageId !== post.getImage()?.getId());
    const needResetImage: boolean = payload.imageId === null;
    
    if (needUpdateImage) {
      const query: GetMediaPreviewQuery = GetMediaPreviewQuery.new({id: payload.imageId, ownerId: payload.executorId});
      const exception: Exception<void> = Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'});
      const postImage: GetMediaPreviewQueryResult = CoreAssert.notEmpty(await this.queryBus.sendQuery(query), exception);

      newPostImage = await PostImage.new(postImage.id, postImage.relativePath);
    }
    if (needResetImage) {
      newPostImage = null;
    }
    
    return newPostImage;
  }
  
}
