import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageRepositoryPort } from '@core/domain/message/port/MessageRepositoryPort';
import { Message } from '@core/domain/message/entity/Message';
import { TypeOrmMessage } from '../entity/message/TypeOrmMessage';
import { MessageMapper } from '../mapper/MessageMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class MessageRepositoryAdapter implements MessageRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmMessage)
    private readonly repository: Repository<TypeOrmMessage>,
  ) {}

  public async save(message: Message): Promise<Message> {
    let id = message.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const messageWithId = new Message({
      id,
      conversationId: message.getConversationId(),
      senderId: message.getSenderId(),
      receiverId: message.getReceiverId(),
      content: message.getContent(),
      attachmentUrl: message.getAttachmentUrl(),
      isRead: message.getIsRead(),
      readAt: message.getReadAt(),
      createdAt: message.getCreatedAt(),
      updatedAt: message.getUpdatedAt(),
    });

    const ormEntity = MessageMapper.toOrm(messageWithId);
    const saved = await this.repository.save(ormEntity);
    return MessageMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<Message>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? MessageMapper.toDomain(ormEntity) : null;
  }

  public async findByConversationId(conversationId: string): Promise<Message[]> {
    const ormEntities = await this.repository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((entity) => MessageMapper.toDomain(entity));
  }

  public async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(TypeOrmMessage)
      .set({ isRead: true, readAt: new Date() })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('receiverId = :userId', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();
  }

  public async update(message: Message): Promise<Message> {
    const ormEntity = MessageMapper.toOrm(message);
    const saved = await this.repository.save(ormEntity);
    return MessageMapper.toDomain(saved);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}