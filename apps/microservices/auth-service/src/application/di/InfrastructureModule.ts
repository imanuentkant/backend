import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthDITokens } from '@core/domain/auth/di/AuthDITokens';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmUser';
import { TypeOrmRefreshToken } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/TypeOrmUserRepositoryAdapter';
import { TypeOrmRefreshTokenRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/TypeOrmRefreshTokenRepositoryAdapter';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmUser, TypeOrmRefreshToken])],
  providers: [
    {
      provide: AuthDITokens.UserRepository,
      useFactory: (dataSource: DataSource) => {
        const repository = dataSource.getRepository(TypeOrmUser);
        return new TypeOrmUserRepositoryAdapter(repository);
      },
      inject: [DataSource],
    },
    {
      provide: AuthDITokens.RefreshTokenRepository,
      useFactory: (dataSource: DataSource) => {
        const repository = dataSource.getRepository(TypeOrmRefreshToken);
        return new TypeOrmRefreshTokenRepositoryAdapter(repository);
      },
      inject: [DataSource],
    },
  ],
  exports: [AuthDITokens.UserRepository, AuthDITokens.RefreshTokenRepository],
})
export class InfrastructureModule {}

