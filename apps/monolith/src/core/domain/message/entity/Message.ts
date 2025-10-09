import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class Message extends TimestampedEntity<string> {
  
  private conversationId: string;
  private senderId: string;
  private receiverId: string;
  private content: string;
  private attachmentUrl?: string;
  private isRead: boolean;
  private readAt?: Date;
  
  constructor(payload: {
    id?: string,
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string,
    attachmentUrl?: string,
    isRead?: boolean,
    readAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.conversationId = payload.conversationId;
    this.senderId = payload.senderId;
    this.receiverId = payload.receiverId;
    this.content = payload.content;
    this.attachmentUrl = payload.attachmentUrl;
    this.isRead = payload.isRead || false;
    this.readAt = payload.readAt;
  }
  
  public static async new(payload: {
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string,
    attachmentUrl?: string,
  }): Promise<Message> {
    const message = new Message({
      ...payload,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await message.validate();
    return message;
  }
  
  public async validate(): Promise<void> {
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
    if (this.content.length > 5000) {
      throw new Error('Message content cannot exceed 5000 characters');
    }
    if (this.senderId === this.receiverId) {
      throw new Error('Sender and receiver cannot be the same user');
    }
  }
  
  public markAsRead(): void {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date();
      this.updateUpdatedAt();
    }
  }
  
  // Getters
  public getConversationId(): string { return this.conversationId; }
  public getSenderId(): string { return this.senderId; }
  public getReceiverId(): string { return this.receiverId; }
  public getContent(): string { return this.content; }
  public getAttachmentUrl(): string | undefined { return this.attachmentUrl; }
  public getIsRead(): boolean { return this.isRead; }
  public getReadAt(): Date | undefined { return this.readAt; }
}
