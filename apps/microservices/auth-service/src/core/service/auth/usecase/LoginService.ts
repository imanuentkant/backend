import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
import { User } from '@core/domain/auth/entity/User';
import { RefreshTokenRepositoryPort } from '@core/domain/auth/port/persistence/RefreshTokenRepositoryPort';
import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { LoginPort } from '@core/domain/auth/port/usecase/LoginPort';
import { LoginUseCase } from '@core/domain/auth/usecase/LoginUseCase';
import { LoginUseCaseDto } from '@core/domain/auth/usecase/dto/LoginUseCaseDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
  id: string;
};

export type RefreshTokenPayload = {
  id: string;
  type: 'refresh';
};

export class LoginService implements LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(payload: LoginPort): Promise<LoginUseCaseDto> {
    // Validate user credentials
    const user: Optional<User> = await this.userRepository.findUser({ email: payload.email });
    CoreAssert.notEmpty(
      user,
      Exception.new({ code: Code.WRONG_CREDENTIALS_ERROR, overrideMessage: 'Invalid credentials.' }),
    );

    const isPasswordValid: boolean = await user!.comparePassword(payload.password);
    CoreAssert.isTrue(
      isPasswordValid,
      Exception.new({ code: Code.WRONG_CREDENTIALS_ERROR, overrideMessage: 'Invalid credentials.' }),
    );

    // Generate tokens
    const accessPayload: JwtPayload = { id: user!.getId() };
    const refreshPayload: RefreshTokenPayload = { id: user!.getId(), type: 'refresh' };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('API_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>('API_REFRESH_TOKEN_TTL_IN_DAYS')}d`,
    });

    // Save refresh token
    const refreshTokenTTL = Number(this.configService.get<string>('API_REFRESH_TOKEN_TTL_IN_DAYS')) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshTokenTTL);

    // Delete old refresh token if exists
    await this.refreshTokenRepository.deleteByUserId(user!.getId());

    const refreshTokenEntity = await RefreshToken.new({
      userId: user!.getId(),
      token: refreshToken,
      expiresAt: expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      id: user!.getId(),
      accessToken,
      refreshToken,
    };
  }
}

