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