import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuid } from 'uuid';

export class Album extends Entity<string> {
  private postId: string;
  private ownerId: string;
  private title: string;
  private description: Nullable<string>;
  private mediaIds: string[];
  private createdAt: Date;
  private editedAt: Nullable<Date>;
  private removedAt: Nullable<Date>;

  constructor(payload: {
    id?: string;
    postId: string;
    ownerId: string;
    title: string;
    description?: string;
    mediaIds?: string[];
    createdAt?: Date;
    editedAt?: Date | null;
    removedAt?: Date | null;
  }) {
    super();
    this.id = payload.id || uuid();
    this.postId = payload.postId;
    this.ownerId = payload.ownerId;
    this.title = payload.title;
    this.description = payload.description || null;
    this.mediaIds = payload.mediaIds || [];
    this.createdAt = payload.createdAt || new Date();
    this.editedAt = payload.editedAt || null;
    this.removedAt = payload.removedAt || null;
  }

  public getId(): string {
    return this.id!;
  }

  public getPostId(): string {
    return this.postId;
  }

  public getOwnerId(): string {
    return this.ownerId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): Nullable<string> {
    return this.description;
  }

  public getMediaIds(): string[] {
    return [...this.mediaIds];
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getEditedAt(): Nullable<Date> {
    return this.editedAt;
  }

  public getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }

  public addMedia(mediaId: string): void {
    if (!this.mediaIds.includes(mediaId)) {
      this.mediaIds.push(mediaId);
      this.editedAt = new Date();
    }
  }

  public removeMedia(mediaId: string): void {
    this.mediaIds = this.mediaIds.filter(id => id !== mediaId);
    this.editedAt = new Date();
  }

  public remove(): void {
    this.removedAt = new Date();
  }

  public static new(payload: { postId: string; ownerId: string; title: string; description?: string }): Album {
    return new Album(payload);
  }
}

