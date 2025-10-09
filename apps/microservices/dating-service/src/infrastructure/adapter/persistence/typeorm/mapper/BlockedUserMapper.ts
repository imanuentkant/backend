import { BlockedUser } from '@core/domain/dating/entity/BlockedUser';
import { TypeOrmBlockedUser } from '../entity/dating/TypeOrmBlockedUser';

export class BlockedUserMapper {
  public static toDomain(ormEntity: TypeOrmBlockedUser): BlockedUser {
    return new BlockedUser({
      id: ormEntity.id,
      blockerId: ormEntity.blocker_id,
      blockedId: ormEntity.blocked_id,
      reason: ormEntity.reason,
      createdAt: ormEntity.created_at,
    });
  }

  public static toOrm(domainEntity: BlockedUser): TypeOrmBlockedUser {
    const ormEntity = new TypeOrmBlockedUser();
    ormEntity.id = domainEntity.getId();
    ormEntity.blocker_id = domainEntity.getBlockerId();
    ormEntity.blocked_id = domainEntity.getBlockedId();
    ormEntity.reason = domainEntity.getReason();
    ormEntity.created_at = domainEntity.getCreatedAt();
    return ormEntity;
  }
}

