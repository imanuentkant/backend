import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BookableItemType } from '@core/common/entity/BookableItem';

@Entity('conversations')
export class TypeOrmConversation {
  
  @PrimaryColumn({ type: 'uuid' })
  public id: string;
  
  @Column({ name: 'bookable_type', type: 'varchar', length: 50 })
  public bookableType: BookableItemType;
  
  @Column({ name: 'bookable_id', type: 'uuid' })
  public bookableId: string;
  
  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  public propertyId: string | null;
  
  @Column({ name: 'guest_id', type: 'uuid' })
  public guestId: string;
  
  @Column({ name: 'host_id', type: 'uuid' })
  public hostId: string;
  
  @Column({ name: 'last_message_id', type: 'uuid', nullable: true })
  public lastMessageId: string | null;
  
  @Column({ name: 'last_message_at', type: 'timestamp', nullable: true })
  public lastMessageAt: Date | null;
  
  @Column({ name: 'unread_count', type: 'int', default: 0 })
  public unreadCount: number;
  
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}

