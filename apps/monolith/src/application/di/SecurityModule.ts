import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerBehindProxyGuard } from '@application/api/http-rest/guard/ThrottlerBehindProxyGuard';
import { SecurityConfig } from '@application/api/http-rest/config/SecurityConfig';
import { HealthController } from '@application/api/http-rest/controller/HealthController';

/**
 * Module cho các cấu hình bảo mật
 */
@Global()
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('RATE_LIMIT_TTL', 60) * 1000, // Convert to milliseconds
            limit: config.get('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
    }),
  ],
  controllers: [HealthController],
  providers: [
    SecurityConfig,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
  exports: [SecurityConfig],
})
export class SecurityModule {}

