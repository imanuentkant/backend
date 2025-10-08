import { Message } from '@core/domain/message/entity/Message';

export interface MessageRepositoryPort {
  save(message: Message): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByConversationId(conversationId: string): Promise<Message[]>;
  markAsRead(conversationId: string, userId: string): Promise<void>;
  update(message: Message): Promise<Message>;
  delete(id: string): Promise<void>;
}

