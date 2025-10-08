import { UseCase } from '@core/common/usecase/UseCase';
import { Conversation } from '@core/domain/message/entity/Conversation';
import { Message } from '@core/domain/message/entity/Message';
import { ConversationRepositoryPort } from '@core/domain/message/port/ConversationRepositoryPort';
import { MessageRepositoryPort } from '@core/domain/message/port/MessageRepositoryPort';
import { BookableItemType } from '@core/common/entity/BookableItem';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type StartConversationUseCasePayload = {
  bookableType: BookableItemType;
  bookableId: string;
  propertyId?: string;
  guestId: string;
  hostId: string;
  initialMessage: string;
};

export type StartConversationResult = {
  conversation: Conversation;
  firstMessage: Message;
};

export class StartConversationUseCase implements UseCase<StartConversationUseCasePayload, StartConversationResult> {
  
  constructor(
    private readonly conversationRepository: ConversationRepositoryPort,
    private readonly messageRepository: MessageRepositoryPort,
  ) {}
  
  async execute(payload: StartConversationUseCasePayload): Promise<StartConversationResult> {
    // Check if conversation already exists
    const existing = await this.conversationRepository.findByParticipants(
      payload.bookableType,
      payload.bookableId,
      payload.guestId,
      payload.hostId
    );
    
    if (existing) {
      // If exists, just send message to existing conversation
      const message = new Message({
        id: UuidGenerator.generate(),
        conversationId: existing.getId(),
        senderId: payload.guestId,
        receiverId: payload.hostId,
        content: payload.initialMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const savedMessage = await this.messageRepository.save(message);
      existing.updateLastMessage(savedMessage.getId(), savedMessage.getCreatedAt());
      await this.conversationRepository.update(existing);
      
      return {
        conversation: existing,
        firstMessage: savedMessage,
      };
    }
    
    // Create new conversation
    const conversation = new Conversation({
      id: UuidGenerator.generate(),
      bookableType: payload.bookableType,
      bookableId: payload.bookableId,
      propertyId: payload.propertyId,
      guestId: payload.guestId,
      hostId: payload.hostId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const savedConversation = await this.conversationRepository.save(conversation);
    
    // Create first message
    const message = new Message({
      id: UuidGenerator.generate(),
      conversationId: savedConversation.getId(),
      senderId: payload.guestId,
      receiverId: payload.hostId,
      content: payload.initialMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const savedMessage = await this.messageRepository.save(message);
    
    // Update conversation with first message
    savedConversation.updateLastMessage(savedMessage.getId(), savedMessage.getCreatedAt());
    await this.conversationRepository.update(savedConversation);
    
    return {
      conversation: savedConversation,
      firstMessage: savedMessage,
    };
  }
}

