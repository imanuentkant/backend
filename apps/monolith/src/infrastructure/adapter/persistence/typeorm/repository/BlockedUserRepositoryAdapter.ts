import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedUser } from '@core/domain/dating/entity/BlockedUser';
import { BlockedUserRepositoryPort } from '@core/domain/dating/port/BlockedUserRepositoryPort';
import { TypeOrmBlockedUser } from '../entity/dating/TypeOrmBlockedUser';
import { BlockedUserMapper } from '../mapper/BlockedUserMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class BlockedUserRepositoryAdapter implements BlockedUserRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmBlockedUser)
    private readonly repository: Repository<TypeOrmBlockedUser>,
  ) {}

  async save(blockedUser: BlockedUser): Promise<BlockedUser> {
    if (!blockedUser.getId()) {
      (blockedUser as any).id = uuidv7();
    }

    const ormEntity = BlockedUserMapper.toOrm(blockedUser);
    const saved = await this.repository.save(ormEntity);
    return BlockedUserMapper.toDomain(saved);
  }

  async findByBlocker(blockerId: string): Promise<BlockedUser[]> {
    const ormEntities = await this.repository.find({
      where: { blocker_id: blockerId },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map(e => BlockedUserMapper.toDomain(e));
  }

  async findByBlockerId(blockerId: string): Promise<BlockedUser[]> {
    return this.findByBlocker(blockerId);
  }

  async findByBlockedId(blockedId: string): Promise<BlockedUser[]> {
    const ormEntities = await this.repository.find({
      where: { blocked_id: blockedId },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map(e => BlockedUserMapper.toDomain(e));
  }

  async findByPair(blockerId: string, blockedId: string): Promise<Nullable<BlockedUser>> {
    const ormEntity = await this.repository.findOne({
      where: {
        blocker_id: blockerId,
        blocked_id: blockedId,
      },
    });
    return ormEntity ? BlockedUserMapper.toDomain(ormEntity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async isBlocked(userId: string, targetId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: [
        { blocker_id: userId, blocked_id: targetId },
        { blocker_id: targetId, blocked_id: userId },
      ],
    });
    return count > 0;
  }
}

