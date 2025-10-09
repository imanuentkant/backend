import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationRepositoryPort } from '@core/domain/message/port/ConversationRepositoryPort';
import { Conversation } from '@core/domain/message/entity/Conversation';
import { TypeOrmConversation } from '../entity/message/TypeOrmConversation';
import { ConversationMapper } from '../mapper/ConversationMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class ConversationRepositoryAdapter implements ConversationRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmConversation)
    private readonly repository: Repository<TypeOrmConversation>,
  ) {}

  public async save(conversation: Conversation): Promise<Conversation> {
    let id = conversation.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const conversationWithId = new Conversation({
      id,
      bookableType: conversation.getBookableType(),
      bookableId: conversation.getBookableId(),
      propertyId: conversation.getPropertyId(),
      guestId: conversation.getGuestId(),
      hostId: conversation.getHostId(),
      lastMessageId: conversation.getLastMessageId(),
      lastMessageAt: conversation.getLastMessageAt(),
      unreadCount: conversation.getUnreadCount(),
      createdAt: conversation.getCreatedAt(),
      updatedAt: conversation.getUpdatedAt(),
    });

    const ormEntity = ConversationMapper.toOrm(conversationWithId);
    const saved = await this.repository.save(ormEntity);
    return ConversationMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<Conversation>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? ConversationMapper.toDomain(ormEntity) : null;
  }

  public async findByUserId(userId: string): Promise<Conversation[]> {
    const ormEntities = await this.repository
      .createQueryBuilder('conversation')
      .where('conversation.guestId = :userId', { userId })
      .orWhere('conversation.hostId = :userId', { userId })
      .orderBy('conversation.lastMessageAt', 'DESC')
      .getMany();

    return ormEntities.map((entity) => ConversationMapper.toDomain(entity));
  }

  public async findByParticipants(
    bookableType: string,
    bookableId: string,
    guestId: string,
    hostId: string,
  ): Promise<Nullable<Conversation>> {
    const ormEntity = await this.repository.findOne({
      where: {
        bookableType: bookableType as any,
        bookableId,
        guestId,
        hostId,
      },
    });
    return ormEntity ? ConversationMapper.toDomain(ormEntity) : null;
  }

  public async update(conversation: Conversation): Promise<Conversation> {
    const ormEntity = ConversationMapper.toOrm(conversation);
    const saved = await this.repository.save(ormEntity);
    return ConversationMapper.toDomain(saved);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getUnreadCountByUser(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('conversation')
      .select('SUM(conversation.unreadCount)', 'total')
      .where('conversation.guestId = :userId', { userId })
      .orWhere('conversation.hostId = :userId', { userId })
      .getRawOne();

    return Number(result?.total || 0);
  }
}