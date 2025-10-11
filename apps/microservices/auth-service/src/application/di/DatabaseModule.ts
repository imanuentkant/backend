import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmUser';
import { TypeOrmRefreshToken } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: Number(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'postgres',
        database: configService.get('DB_NAME') || 'auth_service',
        logging: configService.get('DB_LOG_ENABLE') === 'true' ? 'all' : false,
        entities: [TypeOrmUser, TypeOrmRefreshToken],
        synchronize: false, // TEMPORARY: Tắt để tránh lỗi schema conflict
        migrationsRun: false,
        dropSchema: false, // Không drop schema tự động
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

