import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class Conversation extends TimestampedEntity<string> {
  
  private propertyId: string;
  private bookingId?: string;
  private guestId: string;
  private hostId: string;
  private lastMessageAt?: Date;
  private unreadCountGuest: number;
  private unreadCountHost: number;
  
  constructor(payload: {
    id?: string,
    propertyId: string,
    bookingId?: string,
    guestId: string,
    hostId: string,
    lastMessageAt?: Date,
    unreadCountGuest?: number,
    unreadCountHost?: number,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.propertyId = payload.propertyId;
    this.bookingId = payload.bookingId;
    this.guestId = payload.guestId;
    this.hostId = payload.hostId;
    this.lastMessageAt = payload.lastMessageAt;
    this.unreadCountGuest = payload.unreadCountGuest || 0;
    this.unreadCountHost = payload.unreadCountHost || 0;
  }
  
  public static async new(payload: {
    propertyId: string,
    bookingId?: string,
    guestId: string,
    hostId: string,
  }): Promise<Conversation> {
    return new Conversation(payload);
  }
  
  // Getters
  public getPropertyId(): string {
    return this.propertyId;
  }
  
  public getBookingId(): string | undefined {
    return this.bookingId;
  }
  
  public getGuestId(): string {
    return this.guestId;
  }
  
  public getHostId(): string {
    return this.hostId;
  }
  
  public getLastMessageAt(): Date | undefined {
    return this.lastMessageAt;
  }
  
  public getUnreadCountForUser(userId: string): number {
    if (userId === this.guestId) {
      return this.unreadCountGuest;
    }
    if (userId === this.hostId) {
      return this.unreadCountHost;
    }
    return 0;
  }
  
  // Methods
  public updateLastMessage(messageDate: Date): void {
    this.lastMessageAt = messageDate;
    this.updateUpdatedAt();
  }
  
  public incrementUnreadCount(forUserId: string): void {
    if (forUserId === this.guestId) {
      this.unreadCountGuest++;
    } else if (forUserId === this.hostId) {
      this.unreadCountHost++;
    }
    this.updateUpdatedAt();
  }
  
  public markAsRead(userId: string): void {
    if (userId === this.guestId) {
      this.unreadCountGuest = 0;
    } else if (userId === this.hostId) {
      this.unreadCountHost = 0;
    }
    this.updateUpdatedAt();
  }
  
  /**
   * Check if user is participant
   */
  public isParticipant(userId: string): boolean {
    return userId === this.guestId || userId === this.hostId;
  }
  
  /**
   * Get other participant ID
   */
  public getOtherParticipant(userId: string): string | null {
    if (userId === this.guestId) {
      return this.hostId;
    }
    if (userId === this.hostId) {
      return this.guestId;
    }
    return null;
  }
}

