import { Entity } from '@core/common/entity/Entity';

/**
 * BlockedUser Entity - Track blocked users
 */
export class BlockedUser extends Entity<string> {
  private blockerId: string;
  private blockedId: string;
  private reason: string;
  private createdAt: Date;

  constructor(payload: {
    id?: string;
    blockerId: string;
    blockedId: string;
    reason: string;
    createdAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.blockerId = payload.blockerId;
    this.blockedId = payload.blockedId;
    this.reason = payload.reason;
    this.createdAt = payload.createdAt || new Date();
  }

  public getBlockerId(): string { return this.blockerId; }
  public getBlockedId(): string { return this.blockedId; }
  public getReason(): string { return this.reason; }
  public getCreatedAt(): Date { return this.createdAt; }
}
