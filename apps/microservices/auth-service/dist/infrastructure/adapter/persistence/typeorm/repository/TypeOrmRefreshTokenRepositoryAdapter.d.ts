import { Optional } from '@core/common/type/CommonTypes';
import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
import { RefreshTokenRepositoryPort } from '@core/domain/auth/port/persistence/RefreshTokenRepositoryPort';
import { TypeOrmRefreshToken } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken';
import { Repository } from 'typeorm';
export declare class TypeOrmRefreshTokenRepositoryAdapter implements RefreshTokenRepositoryPort {
    private readonly repository;
    constructor(repository: Repository<TypeOrmRefreshToken>);
    findByToken(token: string): Promise<Optional<RefreshToken>>;
    findByUserId(userId: string): Promise<Optional<RefreshToken>>;
    save(refreshToken: RefreshToken): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
