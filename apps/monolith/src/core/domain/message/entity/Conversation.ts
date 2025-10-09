import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';
import { BookableItemType } from '@core/common/entity/BookableItem';

export class Conversation extends TimestampedEntity<string> {
  
  private bookableType: BookableItemType;
  private bookableId: string;
  private propertyId?: string; // Backward compatibility
  private guestId: string;
  private hostId: string;
  private lastMessageId?: string;
  private lastMessageAt?: Date;
  private unreadCount: number;
  
  constructor(payload: {
    id?: string,
    bookableType: BookableItemType,
    bookableId: string,
    propertyId?: string,
    guestId: string,
    hostId: string,
    lastMessageId?: string,
    lastMessageAt?: Date,
    unreadCount?: number,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.bookableType = payload.bookableType;
    this.bookableId = payload.bookableId;
    this.propertyId = payload.propertyId;
    this.guestId = payload.guestId;
    this.hostId = payload.hostId;
    this.lastMessageId = payload.lastMessageId;
    this.lastMessageAt = payload.lastMessageAt;
    this.unreadCount = payload.unreadCount || 0;
  }
  
  public static async new(payload: {
    bookableType: BookableItemType,
    bookableId: string,
    propertyId?: string,
    guestId: string,
    hostId: string,
  }): Promise<Conversation> {
    const conversation = new Conversation({
      ...payload,
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await conversation.validate();
    return conversation;
  }
  
  public async validate(): Promise<void> {
    if (!this.guestId || !this.hostId) {
      throw new Error('Conversation must have both guest and host');
    }
    if (this.guestId === this.hostId) {
      throw new Error('Guest and host cannot be the same user');
    }
  }
  
  public updateLastMessage(messageId: string, messageDate: Date): void {
    this.lastMessageId = messageId;
    this.lastMessageAt = messageDate;
    this.updateUpdatedAt();
  }
  
  public incrementUnreadCount(): void {
    this.unreadCount++;
    this.updateUpdatedAt();
  }
  
  public markAsRead(): void {
    this.unreadCount = 0;
    this.updateUpdatedAt();
  }
  
  // Getters
  public getBookableType(): BookableItemType { return this.bookableType; }
  public getBookableId(): string { return this.bookableId; }
  public getPropertyId(): string | undefined { return this.propertyId; }
  public getGuestId(): string { return this.guestId; }
  public getHostId(): string { return this.hostId; }
  public getLastMessageId(): string | undefined { return this.lastMessageId; }
  public getLastMessageAt(): Date | undefined { return this.lastMessageAt; }
  public getUnreadCount(): number { return this.unreadCount; }
}
