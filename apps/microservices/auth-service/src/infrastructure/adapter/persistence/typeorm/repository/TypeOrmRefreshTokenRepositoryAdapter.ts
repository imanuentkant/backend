import { Optional } from '@core/common/type/CommonTypes';
import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
import { RefreshTokenRepositoryPort } from '@core/domain/auth/port/persistence/RefreshTokenRepositoryPort';
import { TypeOrmRefreshTokenMapper } from '@infrastructure/adapter/persistence/typeorm/mapper/TypeOrmRefreshTokenMapper';
import { TypeOrmRefreshToken } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken';
import { Repository } from 'typeorm';

export class TypeOrmRefreshTokenRepositoryAdapter implements RefreshTokenRepositoryPort {
  private readonly repository: Repository<TypeOrmRefreshToken>;

  constructor(repository: Repository<TypeOrmRefreshToken>) {
    this.repository = repository;
  }

  public async findByToken(token: string): Promise<Optional<RefreshToken>> {
    const ormEntity = await this.repository.findOne({ where: { token } });

    if (ormEntity) {
      return TypeOrmRefreshTokenMapper.toDomainEntity(ormEntity);
    }

    return undefined;
  }

  public async findByUserId(userId: string): Promise<Optional<RefreshToken>> {
    const ormEntity = await this.repository.findOne({ where: { userId } });

    if (ormEntity) {
      return TypeOrmRefreshTokenMapper.toDomainEntity(ormEntity);
    }

    return undefined;
  }

  public async save(refreshToken: RefreshToken): Promise<void> {
    const ormEntity = TypeOrmRefreshTokenMapper.toOrmEntity(refreshToken);
    await this.repository.save(ormEntity);
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}

