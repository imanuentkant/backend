import { Message } from '@core/domain/message/entity/Message';
import { TypeOrmMessage } from '../entity/message/TypeOrmMessage';

export class MessageMapper {
  public static toDomain(ormEntity: TypeOrmMessage): Message {
    return new Message({
      id: ormEntity.id,
      conversationId: ormEntity.conversationId,
      senderId: ormEntity.senderId,
      receiverId: ormEntity.receiverId,
      content: ormEntity.content,
      attachmentUrl: ormEntity.attachmentUrl || undefined,
      isRead: ormEntity.isRead,
      readAt: ormEntity.readAt || undefined,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  public static toOrm(domainEntity: Message): TypeOrmMessage {
    const ormEntity = new TypeOrmMessage();
    ormEntity.id = domainEntity.getId();
    ormEntity.conversationId = domainEntity.getConversationId();
    ormEntity.senderId = domainEntity.getSenderId();
    ormEntity.receiverId = domainEntity.getReceiverId();
    ormEntity.content = domainEntity.getContent();
    ormEntity.attachmentUrl = domainEntity.getAttachmentUrl() || null;
    ormEntity.isRead = domainEntity.getIsRead();
    ormEntity.readAt = domainEntity.getReadAt() || null;
    ormEntity.createdAt = domainEntity.getCreatedAt();
    ormEntity.updatedAt = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}