// src/core/domain/post/usecase/dto/PostUseCaseDto.ts
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable, Optional } from '@core/common/type/CommonTypes';

export interface PostImageDto {
  id: string;
  url: string;
}

export interface PostMediaDto {
  id: string;
  mediaId: string;
  type: 'COVER' | 'GALLERY';
  sortOrder: number;
  media: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    ext: string;
    mimetype: string;
  };
}

export interface PostOwnerDto {
  id: string;
  name: string;
  role: UserRole;
}

export interface PostUseCaseDto {
  id: string;
  owner: PostOwnerDto;
  title: string;
  content: Nullable<string>;
  status: PostStatus;

  image?: PostImageDto; // Backward compatibility
  coverImage?: PostImageDto;
  galleryImages: PostImageDto[];
  mediaCollection: PostMediaDto[];

  createdAt: number;
  editedAt: Optional<number>;
  publishedAt: Optional<number>;
}

// Bổ sung namespace để cung cấp factory hàm như trước: PostUseCaseDto.newFromPost(...)
// Cho phép test cũ tiếp tục dùng API này.
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';

export namespace PostUseCaseDto {
  export function newFromPost(post: Post): import('./PostUseCaseDto').PostUseCaseDto {
    const coverImage: PostImage | null = post.getCoverImage();
    const galleryImages: PostImage[] = post.getGalleryImages();
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
      image: coverImage ? { id: coverImage.getId(), url: coverImage.getRelativePath() } : undefined,
      coverImage: coverImage ? { id: coverImage.getId(), url: coverImage.getRelativePath() } : undefined,
      galleryImages: galleryImages.map(img => ({ id: img.getId(), url: img.getRelativePath() })),
      mediaCollection: post.getMediaCollection().getAll().map(m => ({
        id: m.getId(),
        mediaId: m.getMediaId(),
        type: m.getType(),
        sortOrder: m.getSortOrder(),
        media: {
          id: m.getMediaId(),
          name: '',
          url: '',
          type: '',
          size: 0,
          ext: '',
          mimetype: '',
        },
      })),
      createdAt: post.getCreatedAt().getTime(),
      editedAt: post.getEditedAt()?.getTime(),
      publishedAt: post.getPublishedAt()?.getTime(),
    };
  }

  export function newListFromPosts(posts: Post[]): import('./PostUseCaseDto').PostUseCaseDto[] {
    return posts.map(p => newFromPost(p));
  }
}