import { UseCase } from '@core/common/usecase/UseCase';
import { Message } from '@core/domain/message/entity/Message';
import { MessageRepositoryPort } from '@core/domain/message/port/MessageRepositoryPort';
import { ConversationRepositoryPort } from '@core/domain/message/port/ConversationRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type SendMessageUseCasePayload = {
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl?: string;
};

export class SendMessageUseCase implements UseCase<SendMessageUseCasePayload, Message> {
  
  constructor(
    private readonly messageRepository: MessageRepositoryPort,
    private readonly conversationRepository: ConversationRepositoryPort,
  ) {}
  
  async execute(payload: SendMessageUseCasePayload): Promise<Message> {
    // Verify conversation exists
    const conversation = await this.conversationRepository.findById(payload.conversationId);
    if (!conversation) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Conversation with id ${payload.conversationId} not found`,
      });
    }
    
    // Determine receiver (if sender is guest, receiver is host and vice versa)
    const receiverId = payload.senderId === conversation.getGuestId() 
      ? conversation.getHostId() 
      : conversation.getGuestId();
    
    // Create message
    const message = new Message({
      id: UuidGenerator.generate(),
      conversationId: payload.conversationId,
      senderId: payload.senderId,
      receiverId,
      content: payload.content,
      attachmentUrl: payload.attachmentUrl,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await message.validate();
    
    // Save message
    const savedMessage = await this.messageRepository.save(message);
    
    // Update conversation
    conversation.updateLastMessage(savedMessage.getId(), savedMessage.getCreatedAt());
    conversation.incrementUnreadCount();
    await this.conversationRepository.update(conversation);
    
    return savedMessage;
  }
}

