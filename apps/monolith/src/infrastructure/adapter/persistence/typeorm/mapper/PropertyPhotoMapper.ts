import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';
import { TypeOrmPropertyPhoto } from '../entity/property/TypeOrmPropertyPhoto';

export class PropertyPhotoMapper {
  public static toDomain(ormEntity: TypeOrmPropertyPhoto): PropertyPhoto {
    return new PropertyPhoto({
      id: ormEntity.id,
      propertyId: ormEntity.property_id,
      mediaId: ormEntity.media_id || 'unknown',
      url: ormEntity.url,
      isCover: ormEntity.is_cover,
      orderIndex: ormEntity.order_index,
      caption: ormEntity.caption || undefined,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: PropertyPhoto): TypeOrmPropertyPhoto {
    const ormEntity = new TypeOrmPropertyPhoto();
    ormEntity.id = domainEntity.getId();
    ormEntity.property_id = domainEntity.getPropertyId();
    ormEntity.media_id = domainEntity.getMediaId();
    ormEntity.url = domainEntity.getUrl();
    ormEntity.is_cover = domainEntity.getIsCover();
    ormEntity.order_index = domainEntity.getOrderIndex();
    ormEntity.caption = domainEntity.getCaption() || null;
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}