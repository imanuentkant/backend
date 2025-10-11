import { UseCase } from '@core/common/usecase/UseCase';
import { RefreshTokenPort } from '@core/domain/auth/port/usecase/RefreshTokenPort';
import { RefreshTokenUseCaseDto } from '@core/domain/auth/usecase/dto/RefreshTokenUseCaseDto';

export type RefreshTokenUseCase = UseCase<RefreshTokenPort, RefreshTokenUseCaseDto>;

