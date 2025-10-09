import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatingModule } from './application/di/DatingModule';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '../../.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: parseInt(config.get('DB_PORT') || '5432'),
        username: config.get('DB_USERNAME') || 'postgres',
        password: config.get('DB_PASSWORD') || 'postgres',
        database: config.get('DB_NAME') || 'dating_db',
        entities: [__dirname + '/infrastructure/**/*.entity{.ts,.js}', __dirname + '/infrastructure/**/TypeOrm*{.ts,.js}'],
        migrations: [__dirname + '/infrastructure/migration/**/*{.ts,.js}'],
        synchronize: config.get('NODE_ENV') === 'development',
        logging: config.get('DB_LOG_ENABLE') === 'true',
      }),
    }),

    // Dating Module (business logic)
    DatingModule,
  ],
})
export class DatingAppModule {}

