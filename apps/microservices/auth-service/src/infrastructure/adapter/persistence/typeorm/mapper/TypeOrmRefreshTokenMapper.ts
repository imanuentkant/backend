import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
import { TypeOrmRefreshToken } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken';

export class TypeOrmRefreshTokenMapper {
  public static toOrmEntity(domainEntity: RefreshToken): TypeOrmRefreshToken {
    const ormEntity: TypeOrmRefreshToken = new TypeOrmRefreshToken();

    ormEntity.id = domainEntity.getId();
    ormEntity.userId = domainEntity.getUserId();
    ormEntity.token = domainEntity.getToken();
    ormEntity.expiresAt = domainEntity.getExpiresAt();
    ormEntity.createdAt = domainEntity.getCreatedAt();

    return ormEntity;
  }

  public static toDomainEntity(ormEntity: TypeOrmRefreshToken): RefreshToken {
    const domainEntity: RefreshToken = new RefreshToken({
      id: ormEntity.id,
      userId: ormEntity.userId,
      token: ormEntity.token,
      expiresAt: ormEntity.expiresAt,
      createdAt: ormEntity.createdAt,
    });

    return domainEntity;
  }
}

