import { DatingSettings } from '@core/domain/dating/entity/DatingSettings';
import { TypeOrmDatingSettings } from '../entity/dating/TypeOrmDatingSettings';

export class DatingSettingsMapper {
  public static toDomain(ormEntity: TypeOrmDatingSettings): DatingSettings {
    return new DatingSettings({
      id: ormEntity.id,
      customerId: ormEntity.customer_id,
      maxDistance: ormEntity.max_distance,
      ageMin: ormEntity.age_min,
      ageMax: ormEntity.age_max,
      showDistance: ormEntity.show_distance,
      showAge: ormEntity.show_age,
      onlyShowVerified: ormEntity.only_show_verified,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: DatingSettings): TypeOrmDatingSettings {
    const ormEntity = new TypeOrmDatingSettings();
    ormEntity.id = domainEntity.getId();
    ormEntity.customer_id = domainEntity.getCustomerId();
    ormEntity.max_distance = domainEntity.getMaxDistance();
    ormEntity.age_min = domainEntity.getAgeMin();
    ormEntity.age_max = domainEntity.getAgeMax();
    ormEntity.show_distance = domainEntity.getShowDistance();
    ormEntity.show_age = domainEntity.getShowAge();
    ormEntity.only_show_verified = domainEntity.getOnlyShowVerified();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}

