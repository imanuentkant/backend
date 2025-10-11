import { UseCase } from '@core/common/usecase/UseCase';
import { CreateUserPort } from '@core/domain/auth/port/usecase/CreateUserPort';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';

export type CreateUserUseCase = UseCase<CreateUserPort, UserUseCaseDto>;

