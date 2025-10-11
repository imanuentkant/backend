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
export declare class LoginService implements LoginUseCase {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: UserRepositoryPort, refreshTokenRepository: RefreshTokenRepositoryPort, jwtService: JwtService, configService: ConfigService);
    execute(payload: LoginPort): Promise<LoginUseCaseDto>;
}
