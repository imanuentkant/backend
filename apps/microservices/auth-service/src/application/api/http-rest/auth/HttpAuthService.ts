import { Injectable, Inject } from '@nestjs/common';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { User } from '@core/domain/auth/entity/User';
import { AuthDITokens } from '@core/domain/auth/di/AuthDITokens';

@Injectable()
export class HttpAuthService {
  constructor(
    @Inject(AuthDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  public async validateUser(username: string, password: string): Promise<Nullable<HttpUserPayload>> {
    const user: Optional<User> = await this.userRepository.findUser({ email: username });

    if (user) {
      const isPasswordValid: boolean = await user.comparePassword(password);
      if (isPasswordValid) {
        return { id: user.getId(), email: user.getEmail(), role: user.getRole() };
      }
    }

    return null;
  }

  public async getUser(by: { id: string }): Promise<Optional<User>> {
    return this.userRepository.findUser(by);
  }
}

