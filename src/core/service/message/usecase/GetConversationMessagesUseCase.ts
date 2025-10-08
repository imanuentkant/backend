import { UseCase } from '@core/common/usecase/UseCase';
import { Message } from '@core/domain/message/entity/Message';
import { MessageRepositoryPort } from '@core/domain/message/port/MessageRepositoryPort';

export type GetConversationMessagesUseCasePayload = {
  conversationId: string;
};

export class GetConversationMessagesUseCase implements UseCase<GetConversationMessagesUseCasePayload, Message[]> {
  
  constructor(private readonly messageRepository: MessageRepositoryPort) {}
  
  async execute(payload: GetConversationMessagesUseCasePayload): Promise<Message[]> {
    return await this.messageRepository.findByConversationId(payload.conversationId);
  }
}

