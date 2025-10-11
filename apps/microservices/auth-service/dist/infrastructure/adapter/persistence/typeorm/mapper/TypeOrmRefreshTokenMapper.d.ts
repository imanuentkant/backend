import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
import { TypeOrmRefreshToken } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken';
export declare class TypeOrmRefreshTokenMapper {
    static toOrmEntity(domainEntity: RefreshToken): TypeOrmRefreshToken;
    static toDomainEntity(ormEntity: TypeOrmRefreshToken): RefreshToken;
}
