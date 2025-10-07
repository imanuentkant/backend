import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { GetPostListPort } from '@core/domain/post/port/usecase/GetPostListPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetPostListUseCase } from '@core/domain/post/usecase/GetPostListUseCase';

export class GetPostListService implements GetPostListUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: GetPostListPort): Promise<PostUseCaseDto[]> {
    const posts: Post[] = await this.postRepository.findPosts({
      ownerId: payload.ownerId,
      status: payload.status,
    });
    
    return posts.map(post => ({
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
    }));
  }
  
}
