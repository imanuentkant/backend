import { Boost } from '@core/domain/dating/entity/Boost';
import { TypeOrmBoost } from '../entity/dating/TypeOrmBoost';

export class BoostMapper {
  public static toDomain(ormBoost: TypeOrmBoost): Boost {
    return new Boost({
      id: ormBoost.id,
      customerId: ormBoost.customerId,
      startedAt: ormBoost.startedAt,
      expiresAt: ormBoost.expiresAt,
      isActive: ormBoost.isActive,
      createdAt: ormBoost.createdAt,
    });
  }

  public static toORM(domainBoost: Boost): TypeOrmBoost {
    const ormBoost = new TypeOrmBoost();
    
    if (domainBoost.getId()) {
      ormBoost.id = domainBoost.getId();
    }
    
    ormBoost.customerId = domainBoost.getCustomerId();
    ormBoost.startedAt = domainBoost.getStartedAt();
    ormBoost.expiresAt = domainBoost.getExpiresAt();
    ormBoost.isActive = domainBoost.getIsActive();
    ormBoost.createdAt = domainBoost.getCreatedAt();

    return ormBoost;
  }
}

