import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Optional } from '@core/common/type/CommonTypes';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/domain/auth/entity/User';
import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { GetUserPort } from '@core/domain/auth/port/usecase/GetUserPort';
import { GetUserUseCase } from '@core/domain/auth/usecase/GetUserUseCase';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';

export class GetUserService implements GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(payload: GetUserPort): Promise<UserUseCaseDto> {
    const user: Optional<User> = await this.userRepository.findUser({
      id: payload.id,
      email: payload.email,
    });

    CoreAssert.notEmpty(
      user,
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'User not found.' }),
    );

    return UserUseCaseDto.newFromUser(user!);
  }
}

