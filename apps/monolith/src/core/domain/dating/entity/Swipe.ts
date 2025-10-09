import { Entity } from '@core/common/entity/Entity';

/**
 * Swipe Entity - Customer swipe action (like/pass)
 */
export class Swipe extends Entity<string> {
  private fromCustomerId: string;
  private toProfileId: string;
  private action: SwipeAction;
  private isSuperLike: boolean;
  private createdAt: Date;

  constructor(payload: {
    id?: string;
    fromCustomerId: string;
    toProfileId: string;
    action: SwipeAction;
    isSuperLike?: boolean;
    createdAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.fromCustomerId = payload.fromCustomerId;
    this.toProfileId = payload.toProfileId;
    this.action = payload.action;
    this.isSuperLike = payload.isSuperLike || false;
    this.createdAt = payload.createdAt || new Date();
  }

  // Getters
  public getFromCustomerId(): string { return this.fromCustomerId; }
  public getToProfileId(): string { return this.toProfileId; }
  public getAction(): SwipeAction { return this.action; }
  public getIsSuperLike(): boolean { return this.isSuperLike; }
  public getCreatedAt(): Date { return this.createdAt; }

  // Business methods
  public isLike(): boolean {
    return this.action === SwipeAction.LIKE;
  }

  public isPass(): boolean {
    return this.action === SwipeAction.PASS;
  }
}

export enum SwipeAction {
  LIKE = 'like',
  PASS = 'pass',
  SUPER_LIKE = 'super_like',
}
