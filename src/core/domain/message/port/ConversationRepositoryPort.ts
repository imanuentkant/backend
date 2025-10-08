import { Conversation } from '@core/domain/message/entity/Conversation';
import { BookableItemType } from '@core/common/entity/BookableItem';

export interface ConversationRepositoryPort {
  save(conversation: Conversation): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  findByParticipants(bookableType: BookableItemType, bookableId: string, guestId: string, hostId: string): Promise<Conversation | null>;
  update(conversation: Conversation): Promise<Conversation>;
  delete(id: string): Promise<void>;
  getUnreadCountByUser(userId: string): Promise<number>;
}

