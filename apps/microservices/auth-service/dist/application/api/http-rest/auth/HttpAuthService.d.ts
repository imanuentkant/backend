import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { User } from '@core/domain/auth/entity/User';
export declare class HttpAuthService {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    validateUser(username: string, password: string): Promise<Nullable<HttpUserPayload>>;
    getUser(by: {
        id: string;
    }): Promise<Optional<User>>;
}
