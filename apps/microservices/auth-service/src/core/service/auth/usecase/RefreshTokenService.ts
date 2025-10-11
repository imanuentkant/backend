import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Optional } from '@core/common/type/CommonTypes';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
import { RefreshTokenRepositoryPort } from '@core/domain/auth/port/persistence/RefreshTokenRepositoryPort';
import { RefreshTokenPort } from '@core/domain/auth/port/usecase/RefreshTokenPort';
import { RefreshTokenUseCase } from '@core/domain/auth/usecase/RefreshTokenUseCase';
import { RefreshTokenUseCaseDto } from '@core/domain/auth/usecase/dto/RefreshTokenUseCaseDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayload } from './LoginService';

export class RefreshTokenService implements RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(payload: RefreshTokenPort): Promise<RefreshTokenUseCaseDto> {
    CoreAssert.notEmpty(
      payload.refreshToken,
      Exception.new({ code: Code.UNAUTHORIZED_ERROR, overrideMessage: 'Refresh token is required.' }),
    );

    // Verify token
    let tokenPayload: RefreshTokenPayload;
    try {
      tokenPayload = this.jwtService.verify(payload.refreshToken, {
        secret: this.configService.get('API_REFRESH_TOKEN_SECRET'),
      }) as RefreshTokenPayload;

      CoreAssert.isTrue(
        tokenPayload.type === 'refresh',
        Exception.new({ code: Code.UNAUTHORIZED_ERROR, overrideMessage: 'Invalid token type.' }),
      );
    } catch (error) {
      throw Exception.new({ code: Code.UNAUTHORIZED_ERROR, overrideMessage: 'Invalid or expired refresh token.' });
    }

    // Check if token exists in database
    const storedToken: Optional<RefreshToken> = await this.refreshTokenRepository.findByToken(
      payload.refreshToken,
    );
    CoreAssert.notEmpty(
      storedToken,
      Exception.new({ code: Code.UNAUTHORIZED_ERROR, overrideMessage: 'Refresh token not found.' }),
    );

    // Check if token is expired
    CoreAssert.isFalse(
      storedToken!.isExpired(),
      Exception.new({ code: Code.UNAUTHORIZED_ERROR, overrideMessage: 'Refresh token has expired.' }),
    );

    // Generate new access token
    const accessToken = this.jwtService.sign({ id: tokenPayload.id });

    return {
      accessToken,
    };
  }
}

