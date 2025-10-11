import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { CreateUserPort } from '@core/domain/auth/port/usecase/CreateUserPort';
import { CreateUserUseCase } from '@core/domain/auth/usecase/CreateUserUseCase';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
export declare class CreateUserService implements CreateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    execute(payload: CreateUserPort): Promise<UserUseCaseDto>;
}
