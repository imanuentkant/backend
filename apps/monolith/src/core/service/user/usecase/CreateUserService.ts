import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/domain/user/entity/User';
import { AsyncPersistencePort } from '@core/common/port/persistence/AsyncPersistencePort';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';
import { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUseCase';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';

export class CreateUserService implements CreateUserUseCase {
  
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly asyncPersistence: AsyncPersistencePort,
  ) {}
  
  public async execute(payload: CreateUserPort): Promise<UserUseCaseDto> {
    const doesUserExist: boolean = !! await this.userRepository.countUsers({email: payload.email});
    CoreAssert.isFalse(doesUserExist, Exception.new({code: Code.ENTITY_ALREADY_EXISTS_ERROR, overrideMessage: 'User already exists.'}));

    const user: User = await User.new({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
      password: payload.password,
    });
    
    await this.asyncPersistence.enqueue({
      entity: 'user',
      action: 'create',
      payload: TypeSafeUser.toPersistencePayload(user),
    });
    
    return UserUseCaseDto.newFromUser(user);
  }
  
}

// helper để tránh lộ entity ra khỏi core service
class TypeSafeUser {
  static toPersistencePayload(user: User) {
    return {
      id: user.getId(),
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      email: user.getEmail(),
      role: user.getRole(),
      password: user.getPassword(),
      createdAt: user.getCreatedAt(),
      editedAt: user.getEditedAt(),
      removedAt: user.getRemovedAt(),
    };
  }
}
