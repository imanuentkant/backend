import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { GetUserUseCase } from '@core/domain/auth/usecase/GetUserUseCase';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
export declare class UserController {
    private readonly getUserUseCase;
    constructor(getUserUseCase: GetUserUseCase);
    getMyProfile(user: HttpUserPayload): Promise<CoreApiResponse<UserUseCaseDto>>;
    getUserById(id: string): Promise<CoreApiResponse<UserUseCaseDto>>;
}
