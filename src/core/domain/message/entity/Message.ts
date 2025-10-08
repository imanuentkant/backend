import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class Message extends TimestampedEntity<string> {
  
  private conversationId: string;
  private senderId: string;
  private content: string;
  private attachmentUrl?: string;
  private attachmentType?: string;  // image, document, etc.
  private isRead: boolean;
  private readAt?: Date;
  private isSystem: boolean;  // System-generated message
  
  constructor(payload: {
    id?: string,
    conversationId: string,
    senderId: string,
    content: string,
    attachmentUrl?: string,
    attachmentType?: string,
    isRead?: boolean,
    readAt?: Date,
    isSystem?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.conversationId = payload.conversationId;
    this.senderId = payload.senderId;
    this.content = payload.content;
    this.attachmentUrl = payload.attachmentUrl;
    this.attachmentType = payload.attachmentType;
    this.isRead = payload.isRead || false;
    this.readAt = payload.readAt;
    this.isSystem = payload.isSystem || false;
  }
  
  public static async new(payload: {
    conversationId: string,
    senderId: string,
    content: string,
    attachmentUrl?: string,
    attachmentType?: string,
  }): Promise<Message> {
    const message = new Message(payload);
    await message.validate();
    return message;
  }
  
  public static async newSystemMessage(payload: {
    conversationId: string,
    content: string,
  }): Promise<Message> {
    return new Message({
      ...payload,
      senderId: 'system',
      isSystem: true,
    });
  }
  
  public async validate(): Promise<void> {
    if (!this.content && !this.attachmentUrl) {
      throw new Error('Message must have content or attachment');
    }
    
    if (this.content && this.content.length > 5000) {
      throw new Error('Message content too long (max 5000 characters)');
    }
  }
  
  // Getters
  public getConversationId(): string {
    return this.conversationId;
  }
  
  public getSenderId(): string {
    return this.senderId;
  }
  
  public getContent(): string {
    return this.content;
  }
  
  public getAttachmentUrl(): string | undefined {
    return this.attachmentUrl;
  }
  
  public getIsRead(): boolean {
    return this.isRead;
  }
  
  public getReadAt(): Date | undefined {
    return this.readAt;
  }
  
  public getIsSystem(): boolean {
    return this.isSystem;
  }
  
  // Methods
  public markAsRead(): void {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date();
      this.updateUpdatedAt();
    }
  }
  
  /**
   * Check if message can be edited
   */
  public canEdit(): boolean {
    if (this.isSystem) {
      return false;
    }
    
    // Can only edit within 15 minutes
    const now = new Date();
    const diff = now.getTime() - this.getCreatedAt().getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    
    return diff < fifteenMinutes;
  }
}

