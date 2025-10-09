import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Match Entity - Mutual like creates a match
 */
export class Match extends Entity<string> {
  private customer1Id: string;
  private customer2Id: string;
  private profile1Id: string;
  private profile2Id: string;
  private conversationId: Nullable<string>;
  private matchedAt: Date;
  private lastInteractionAt: Nullable<Date>;
  private isActive: boolean;
  private unmatchedBy: Nullable<string>;
  private unmatchedAt: Nullable<Date>;

  constructor(payload: {
    id?: string;
    customer1Id: string;
    customer2Id: string;
    profile1Id: string;
    profile2Id: string;
    conversationId?: string;
    matchedAt?: Date;
    lastInteractionAt?: Date;
    isActive?: boolean;
    unmatchedBy?: string;
    unmatchedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.customer1Id = payload.customer1Id;
    this.customer2Id = payload.customer2Id;
    this.profile1Id = payload.profile1Id;
    this.profile2Id = payload.profile2Id;
    this.conversationId = payload.conversationId || null;
    this.matchedAt = payload.matchedAt || new Date();
    this.lastInteractionAt = payload.lastInteractionAt || null;
    this.isActive = payload.isActive !== undefined ? payload.isActive : true;
    this.unmatchedBy = payload.unmatchedBy || null;
    this.unmatchedAt = payload.unmatchedAt || null;
  }

  // Getters
  public getCustomer1Id(): string { return this.customer1Id; }
  public getCustomer2Id(): string { return this.customer2Id; }
  public getProfile1Id(): string { return this.profile1Id; }
  public getProfile2Id(): string { return this.profile2Id; }
  public getConversationId(): Nullable<string> { return this.conversationId; }
  public getMatchedAt(): Date { return this.matchedAt; }
  public getLastInteractionAt(): Nullable<Date> { return this.lastInteractionAt; }
  public getIsActive(): boolean { return this.isActive; }
  public getUnmatchedBy(): Nullable<string> { return this.unmatchedBy; }
  public getUnmatchedAt(): Nullable<Date> { return this.unmatchedAt; }

  // Business methods
  public setConversation(conversationId: string): void {
    this.conversationId = conversationId;
    this.updateInteraction();
  }

  public updateInteraction(): void {
    this.lastInteractionAt = new Date();
  }

  public unmatch(customerId: string): void {
    this.isActive = false;
    this.unmatchedBy = customerId;
    this.unmatchedAt = new Date();
  }

  public isMatchFor(customerId: string): boolean {
    return this.customer1Id === customerId || this.customer2Id === customerId;
  }

  public getOtherCustomerId(customerId: string): string {
    return this.customer1Id === customerId ? this.customer2Id : this.customer1Id;
  }

  public hasConversation(): boolean {
    return !!this.conversationId;
  }
}
