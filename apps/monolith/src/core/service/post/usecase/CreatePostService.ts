// src/core/service/post/usecase/CreatePostService.ts (Corrected)
import { QueryBusPort } from '@core/common/port/message/QueryBusPort';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Post } from '@core/domain/post/entity/Post';
import { PostMedia, PostMediaType } from '@core/domain/post/entity/PostMedia';
import { PostMediaCollection } from '@core/domain/post/entity/PostMedia';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { CreatePostPort } from '@core/domain/post/port/usecase/CreatePostPort';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { AsyncPersistencePort } from '@core/common/port/persistence/AsyncPersistencePort';
import { CreatePostUseCase } from '@core/domain/post/usecase/CreatePostUseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetUserPreviewQuery } from '@core/common/message/query/queries/user/GetUserPreviewQuery';
import { GetUserPreviewQueryResult } from '@core/common/message/query/queries/user/result/GetUserPreviewQueryResult';
import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { PostImage } from '@core/domain/post/entity/PostImage';

export class CreatePostService implements CreatePostUseCase {

    constructor(
        private readonly postRepository: PostRepositoryPort,
        private readonly queryBus: QueryBusPort,
        private readonly asyncPersistence: AsyncPersistencePort,
    ) {}

    public async execute(port: CreatePostPort): Promise<PostUseCaseDto> {
        // Get user info
        const userPreview: GetUserPreviewQueryResult = CoreAssert.notEmpty(
            await this.queryBus.sendQuery(GetUserPreviewQuery.new({ id: port.executorId })),
            new Error('User not found.')
        );

        const owner: PostOwner = new PostOwner(userPreview.id, userPreview.name, userPreview.role);

        // Build media collection
        const mediaCollection = await this.buildMediaCollection(port);

        // Handle backward compatibility - if imageId is provided but no coverImageId
        let backwardCompatibilityImageId: string | undefined;
        if (port.imageId && !port.coverImageId) {
            backwardCompatibilityImageId = port.imageId;
        } else if (port.coverImageId) {
            backwardCompatibilityImageId = port.coverImageId;
        }

        const post: Post = await Post.new({
            owner,
            title: port.title,
            content: port.content,
            imageId: backwardCompatibilityImageId,
            mediaCollection,
        });

        // enqueue persistence
        await this.asyncPersistence.enqueue({
            entity: 'post',
            action: 'create',
            payload: TypeSafePost.toPersistencePayload(post),
        });

        // Update post ID in media collection using domain id
        const updatedMediaCollection = this.updateMediaCollectionPostId(mediaCollection, post.getId());
        const updatedPost = new Post({
            owner: post.getOwner(),
            title: post.getTitle(),
            content: post.getContent() ?? undefined,
            image: post.getImage(),
            mediaCollection: updatedMediaCollection,
            id: post.getId(),
            status: post.getStatus(),
            createdAt: post.getCreatedAt(),
            editedAt: post.getEditedAt(),
            publishedAt: post.getPublishedAt(),
            removedAt: post.getRemovedAt(),
        });

        return this.buildPostUseCaseDto(updatedPost);
    }

    private async buildMediaCollection(port: CreatePostPort): Promise<PostMediaCollection> {
        const postMedias: PostMedia[] = [];

        // Handle cover image (backward compatibility with imageId)
        const coverImageId = port.coverImageId || port.imageId;
        if (coverImageId) {
            const mediaPreview = CoreAssert.notEmpty(
                await this.queryBus.sendQuery(GetMediaPreviewQuery.new({ id: coverImageId })),
                new Error(`Cover image ${coverImageId} not found.`)
            ) as GetMediaPreviewQueryResult;

            // Validate media type is IMAGE
            CoreAssert.isTrue(
                mediaPreview.type === 'IMAGE',
                new Error('Cover media must be an image.')
            );

            const coverMedia = new PostMedia({
                postId: '', // Will be updated after post creation
                mediaId: coverImageId,
                type: PostMediaType.COVER,
                sortOrder: 0,
                createdAt: new Date(),
            });

            postMedias.push(coverMedia);
        }

        // Handle gallery images
        if (port.galleryImageIds && port.galleryImageIds.length > 0) {
            // Remove duplicates and filter out cover image if it's also in gallery
            const uniqueGalleryIds = [...new Set(port.galleryImageIds)].filter(id => id !== coverImageId);

            for (let i = 0; i < uniqueGalleryIds.length; i++) {
                const mediaId = uniqueGalleryIds[i];
                const mediaPreview = CoreAssert.notEmpty(
                    await this.queryBus.sendQuery(GetMediaPreviewQuery.new({ id: mediaId })),
                    new Error(`Gallery image ${mediaId} not found.`)
                ) as GetMediaPreviewQueryResult;

                // Validate media type is IMAGE
                CoreAssert.isTrue(
                    mediaPreview.type === 'IMAGE',
                    new Error(`Gallery media ${mediaId} must be an image.`)
                );

                const galleryMedia = new PostMedia({
                    postId: '', // Will be updated after post creation
                    mediaId,
                    type: PostMediaType.GALLERY,
                    sortOrder: i + 1, // Start from 1 (0 is reserved for cover)
                    createdAt: new Date(),
                });

                postMedias.push(galleryMedia);
            }
        }

        return new PostMediaCollection(postMedias);
    }

    private updateMediaCollectionPostId(mediaCollection: PostMediaCollection, postId: string): PostMediaCollection {
        const updatedMedias = mediaCollection.getAll().map(media => {
            return new PostMedia({
                postId: postId,
                mediaId: media.getMediaId(),
                type: media.getType(),
                sortOrder: media.getSortOrder(),
                mediaDetails: media.getMediaDetails(),
                id: media.getId(),
                createdAt: media.getCreatedAt(),
            });
        });

        return new PostMediaCollection(updatedMedias);
    }

    private buildPostUseCaseDto(post: Post): PostUseCaseDto {
        const mediaCollection = post.getMediaCollection();
        const coverImage = post.getCoverImage();
        const galleryImages = post.getGalleryImages();

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

            // Backward compatibility
            image: coverImage ? {
                id: coverImage.getId(),
                url: coverImage.getRelativePath(),
            } : undefined,

            // New fields
            coverImage: coverImage ? {
                id: coverImage.getId(),
                url: coverImage.getRelativePath(),
            } : undefined,

            galleryImages: galleryImages.map(img => ({
                id: img.getId(),
                url: img.getRelativePath(),
            })),

            mediaCollection: mediaCollection.getAll().map(media => ({
                id: media.getId(),
                mediaId: media.getMediaId(),
                type: media.getType(),
                sortOrder: media.getSortOrder(),
                media: {
                    id: media.getMediaId(),
                    name: '',
                    url: '',
                    type: '',
                    size: 0,
                    ext: '',
                    mimetype: '',
                }
            })),

            createdAt: post.getCreatedAt().getTime(),
            editedAt: post.getEditedAt()?.getTime(),
            publishedAt: post.getPublishedAt()?.getTime(),
        };
    }
}

class TypeSafePost {
    static toPersistencePayload(post: Post) {
        return {
            id: post.getId(),
            ownerId: post.getOwner().getId(),
            title: post.getTitle(),
            imageId: post.getImage()?.getId() || null,
            content: post.getContent(),
            status: post.getStatus(),
            createdAt: post.getCreatedAt(),
            editedAt: post.getEditedAt(),
            publishedAt: post.getPublishedAt(),
            removedAt: post.getRemovedAt(),
        };
    }
}