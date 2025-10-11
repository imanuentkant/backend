import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/domain/auth/entity/User';
import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { CreateUserPort } from '@core/domain/auth/port/usecase/CreateUserPort';
import { CreateUserUseCase } from '@core/domain/auth/usecase/CreateUserUseCase';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';

export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(payload: CreateUserPort): Promise<UserUseCaseDto> {
    const doesUserExist: boolean = !!(await this.userRepository.countUsers({ email: payload.email }));
    CoreAssert.isFalse(
      doesUserExist,
      Exception.new({ code: Code.ENTITY_ALREADY_EXISTS_ERROR, overrideMessage: 'User already exists.' }),
    );

    const user: User = await User.new({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
      password: payload.password,
    });

    await this.userRepository.addUser(user);

    return UserUseCaseDto.newFromUser(user);
  }
}

