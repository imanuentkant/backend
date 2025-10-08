import { Conversation } from '@core/domain/message/entity/Conversation';
import { TypeOrmConversation } from '../entity/message/TypeOrmConversation';

export class ConversationMapper {
  public static toDomain(ormEntity: TypeOrmConversation): Conversation {
    return new Conversation({
      id: ormEntity.id,
      bookableType: ormEntity.bookableType,
      bookableId: ormEntity.bookableId,
      propertyId: ormEntity.propertyId || undefined,
      guestId: ormEntity.guestId,
      hostId: ormEntity.hostId,
      lastMessageId: ormEntity.lastMessageId || undefined,
      lastMessageAt: ormEntity.lastMessageAt || undefined,
      unreadCount: ormEntity.unreadCount,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  public static toOrm(domainEntity: Conversation): TypeOrmConversation {
    const ormEntity = new TypeOrmConversation();
    ormEntity.id = domainEntity.getId();
    ormEntity.bookableType = domainEntity.getBookableType();
    ormEntity.bookableId = domainEntity.getBookableId();
    ormEntity.propertyId = domainEntity.getPropertyId() || null;
    ormEntity.guestId = domainEntity.getGuestId();
    ormEntity.hostId = domainEntity.getHostId();
    ormEntity.lastMessageId = domainEntity.getLastMessageId() || null;
    ormEntity.lastMessageAt = domainEntity.getLastMessageAt() || null;
    ormEntity.unreadCount = domainEntity.getUnreadCount();
    ormEntity.createdAt = domainEntity.getCreatedAt();
    ormEntity.updatedAt = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}