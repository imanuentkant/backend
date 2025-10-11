import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@application/api/http-rest/controller/AuthController';
import { UserController } from '@application/api/http-rest/controller/UserController';
import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpJwtStrategy } from '@application/api/http-rest/auth/passport/HttpJwtStrategy';
import { HttpLocalStrategy } from '@application/api/http-rest/auth/passport/HttpLocalStrategy';
import { AuthDITokens } from '@core/domain/auth/di/AuthDITokens';
import { CreateUserService } from '@core/service/auth/usecase/CreateUserService';
import { LoginService } from '@core/service/auth/usecase/LoginService';
import { RefreshTokenService } from '@core/service/auth/usecase/RefreshTokenService';
import { GetUserService } from '@core/service/auth/usecase/GetUserService';
import { InfrastructureModule } from './InfrastructureModule';

@Module({
  controllers: [AuthController, UserController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('API_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('API_ACCESS_TOKEN_TTL_IN_MINUTES')}m`,
        },
      }),
    }),
    InfrastructureModule,
  ],
  providers: [
    HttpAuthService,
    HttpLocalStrategy,
    HttpJwtStrategy,
    {
      provide: AuthDITokens.CreateUserUseCase,
      useFactory: (userRepository) => new CreateUserService(userRepository),
      inject: [AuthDITokens.UserRepository],
    },
    {
      provide: AuthDITokens.LoginUseCase,
      useFactory: (userRepository, refreshTokenRepository, jwtService, configService) =>
        new LoginService(userRepository, refreshTokenRepository, jwtService, configService),
      inject: [AuthDITokens.UserRepository, AuthDITokens.RefreshTokenRepository, JwtService, ConfigService],
    },
    {
      provide: AuthDITokens.RefreshTokenUseCase,
      useFactory: (refreshTokenRepository, jwtService, configService) =>
        new RefreshTokenService(refreshTokenRepository, jwtService, configService),
      inject: [AuthDITokens.RefreshTokenRepository, JwtService, ConfigService],
    },
    {
      provide: AuthDITokens.GetUserUseCase,
      useFactory: (userRepository) => new GetUserService(userRepository),
      inject: [AuthDITokens.UserRepository],
    },
  ],
  exports: [HttpAuthService, JwtModule],
})
export class AuthModule {}

