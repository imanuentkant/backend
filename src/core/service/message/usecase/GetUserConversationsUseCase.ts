import { UseCase } from '@core/common/usecase/UseCase';
import { Conversation } from '@core/domain/message/entity/Conversation';
import { ConversationRepositoryPort } from '@core/domain/message/port/ConversationRepositoryPort';

export type GetUserConversationsUseCasePayload = {
  userId: string;
};

export class GetUserConversationsUseCase implements UseCase<GetUserConversationsUseCasePayload, Conversation[]> {
  
  constructor(private readonly conversationRepository: ConversationRepositoryPort) {}
  
  async execute(payload: GetUserConversationsUseCasePayload): Promise<Conversation[]> {
    return await this.conversationRepository.findByUserId(payload.userId);
  }
}

