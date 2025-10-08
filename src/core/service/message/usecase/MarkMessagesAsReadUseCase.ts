import { UseCase } from '@core/common/usecase/UseCase';
import { MessageRepositoryPort } from '@core/domain/message/port/MessageRepositoryPort';
import { ConversationRepositoryPort } from '@core/domain/message/port/ConversationRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type MarkMessagesAsReadUseCasePayload = {
  conversationId: string;
  userId: string;
};

export class MarkMessagesAsReadUseCase implements UseCase<MarkMessagesAsReadUseCasePayload, void> {
  
  constructor(
    private readonly messageRepository: MessageRepositoryPort,
    private readonly conversationRepository: ConversationRepositoryPort,
  ) {}
  
  async execute(payload: MarkMessagesAsReadUseCasePayload): Promise<void> {
    const conversation = await this.conversationRepository.findById(payload.conversationId);
    
    if (!conversation) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Conversation with id ${payload.conversationId} not found`,
      });
    }
    
    // Mark messages as read
    await this.messageRepository.markAsRead(payload.conversationId, payload.userId);
    
    // Update conversation unread count
    conversation.markAsRead();
    await this.conversationRepository.update(conversation);
  }
}

