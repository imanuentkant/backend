import { RefreshTokenRepositoryPort } from '@core/domain/auth/port/persistence/RefreshTokenRepositoryPort';
import { RefreshTokenPort } from '@core/domain/auth/port/usecase/RefreshTokenPort';
import { RefreshTokenUseCase } from '@core/domain/auth/usecase/RefreshTokenUseCase';
import { RefreshTokenUseCaseDto } from '@core/domain/auth/usecase/dto/RefreshTokenUseCaseDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class RefreshTokenService implements RefreshTokenUseCase {
    private readonly refreshTokenRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(refreshTokenRepository: RefreshTokenRepositoryPort, jwtService: JwtService, configService: ConfigService);
    execute(payload: RefreshTokenPort): Promise<RefreshTokenUseCaseDto>;
}
