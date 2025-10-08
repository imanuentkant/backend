import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('messages')
export class TypeOrmMessage {
  
  @PrimaryColumn({ type: 'uuid' })
  public id: string;
  
  @Column({ name: 'conversation_id', type: 'uuid' })
  public conversationId: string;
  
  @Column({ name: 'sender_id', type: 'uuid' })
  public senderId: string;
  
  @Column({ name: 'receiver_id', type: 'uuid' })
  public receiverId: string;
  
  @Column({ type: 'text' })
  public content: string;
  
  @Column({ name: 'attachment_url', type: 'text', nullable: true })
  public attachmentUrl: string | null;
  
  @Column({ name: 'is_read', type: 'boolean', default: false })
  public isRead: boolean;
  
  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  public readAt: Date | null;
  
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}

