import { Swipe } from '@core/domain/dating/entity/Swipe';
import { TypeOrmSwipe } from '../entity/dating/TypeOrmSwipe';

export class SwipeMapper {
  public static toDomain(ormEntity: TypeOrmSwipe): Swipe {
    return new Swipe({
      id: ormEntity.id,
      fromCustomerId: ormEntity.from_customer_id,
      toProfileId: ormEntity.to_profile_id,
      action: ormEntity.action,
      isSuperLike: ormEntity.is_super_like,
      createdAt: ormEntity.created_at,
    });
  }

  public static toOrm(domainEntity: Swipe): TypeOrmSwipe {
    const ormEntity = new TypeOrmSwipe();
    ormEntity.id = domainEntity.getId();
    ormEntity.from_customer_id = domainEntity.getFromCustomerId();
    ormEntity.to_profile_id = domainEntity.getToProfileId();
    ormEntity.action = domainEntity.getAction();
    ormEntity.is_super_like = domainEntity.getIsSuperLike();
    ormEntity.created_at = domainEntity.getCreatedAt();
    return ormEntity;
  }
}
