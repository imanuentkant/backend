import { WishlistItem } from '@core/domain/wishlist/entity/WishlistItem';
import { TypeOrmWishlistItem } from '../entity/wishlist/TypeOrmWishlistItem';

export class WishlistMapper {
  public static toDomain(ormEntity: TypeOrmWishlistItem): WishlistItem {
    return new WishlistItem({
      id: ormEntity.id,
      userId: ormEntity.user_id,
      bookableType: ormEntity.bookable_type,
      bookableId: ormEntity.bookable_id,
      addedAt: ormEntity.added_at,
    });
  }

  public static toOrm(domainEntity: WishlistItem): TypeOrmWishlistItem {
    const ormEntity = new TypeOrmWishlistItem();
    ormEntity.id = domainEntity.getId();
    ormEntity.user_id = domainEntity.getUserId();
    ormEntity.bookable_type = domainEntity.getBookableType();
    ormEntity.bookable_id = domainEntity.getBookableId();
    ormEntity.added_at = domainEntity.getAddedAt();
    return ormEntity;
  }
}
