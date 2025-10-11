import { UseCase } from '@core/common/usecase/UseCase';
import { LoginPort } from '@core/domain/auth/port/usecase/LoginPort';
import { LoginUseCaseDto } from '@core/domain/auth/usecase/dto/LoginUseCaseDto';
export type LoginUseCase = UseCase<LoginPort, LoginUseCaseDto>;
