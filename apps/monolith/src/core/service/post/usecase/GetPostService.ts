import { Code } from '@core/common/code/Code';
import { PostStatus } from '@core/common/enums/PostEnums';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { GetPostPort } from '@core/domain/post/port/usecase/GetPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetPostUseCase } from '@core/domain/post/usecase/GetPostUseCase';

export class GetPostService implements GetPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: GetPostPort): Promise<PostUseCaseDto> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean =
      post.getStatus() === PostStatus.PUBLISHED
      || (payload.executorId === post.getOwner().getId() && post.getStatus() === PostStatus.DRAFT);
    
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
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
      image: post.getCoverImage() ? {
        id: post.getCoverImage()!.getId(),
        url: post.getCoverImage()!.getRelativePath(),
      } : undefined,
      coverImage: post.getCoverImage() ? {
        id: post.getCoverImage()!.getId(),
        url: post.getCoverImage()!.getRelativePath(),
      } : undefined,
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
  
}
