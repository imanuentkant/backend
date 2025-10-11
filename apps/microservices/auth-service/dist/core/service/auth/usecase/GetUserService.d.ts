import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { GetUserPort } from '@core/domain/auth/port/usecase/GetUserPort';
import { GetUserUseCase } from '@core/domain/auth/usecase/GetUserUseCase';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
export declare class GetUserService implements GetUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    execute(payload: GetUserPort): Promise<UserUseCaseDto>;
}
