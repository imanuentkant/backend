import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from '@application/di/AuthModule';
import { DatabaseModule } from '@application/di/DatabaseModule';
import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/NestHttpExceptionFilter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        '../../../infrastructure/env/.env.auth',
        '../../../infrastructure/env/.env.development',
      ],
    }),
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NestHttpExceptionFilter,
    },
  ],
})
export class AuthAppModule {}
