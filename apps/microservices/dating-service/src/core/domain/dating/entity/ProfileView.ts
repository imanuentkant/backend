import { Entity } from '@core/common/entity/Entity';

/**
 * ProfileView Entity - Track profile views
 */
export class ProfileView extends Entity<string> {
  private profileId: string;
  private viewerId: string;
  private viewedAt: Date;
  private createdAt: Date;

  constructor(payload: {
    id?: string;
    profileId: string;
    viewerId: string;
    viewedAt?: Date;
    createdAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.profileId = payload.profileId;
    this.viewerId = payload.viewerId;
    this.viewedAt = payload.viewedAt || new Date();
    this.createdAt = payload.createdAt || new Date();
  }

  // Getters
  public getProfileId(): string {
    return this.profileId;
  }

  public getViewerId(): string {
    return this.viewerId;
  }

  public getViewedAt(): Date {
    return this.viewedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

