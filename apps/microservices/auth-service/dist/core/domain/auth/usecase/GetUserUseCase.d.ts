import { UseCase } from '@core/common/usecase/UseCase';
import { GetUserPort } from '@core/domain/auth/port/usecase/GetUserPort';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
export type GetUserUseCase = UseCase<GetUserPort, UserUseCaseDto>;
