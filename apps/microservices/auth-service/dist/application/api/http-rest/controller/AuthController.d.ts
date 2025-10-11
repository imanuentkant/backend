import { HttpRequestWithUser, HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { LoginDto } from '@application/api/http-rest/dto/LoginDto';
import { RefreshTokenDto } from '@application/api/http-rest/dto/RefreshTokenDto';
import { RegisterDto } from '@application/api/http-rest/dto/RegisterDto';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { CreateUserUseCase } from '@core/domain/auth/usecase/CreateUserUseCase';
import { LoginUseCase } from '@core/domain/auth/usecase/LoginUseCase';
import { RefreshTokenUseCase } from '@core/domain/auth/usecase/RefreshTokenUseCase';
import { GetUserUseCase } from '@core/domain/auth/usecase/GetUserUseCase';
import { LoginUseCaseDto } from '@core/domain/auth/usecase/dto/LoginUseCaseDto';
import { RefreshTokenUseCaseDto } from '@core/domain/auth/usecase/dto/RefreshTokenUseCaseDto';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
export declare class AuthController {
    private readonly createUserUseCase;
    private readonly loginUseCase;
    private readonly refreshTokenUseCase;
    private readonly getUserUseCase;
    constructor(createUserUseCase: CreateUserUseCase, loginUseCase: LoginUseCase, refreshTokenUseCase: RefreshTokenUseCase, getUserUseCase: GetUserUseCase);
    register(registerDto: RegisterDto): Promise<CoreApiResponse<UserUseCaseDto>>;
    login(request: HttpRequestWithUser, loginDto: LoginDto): Promise<CoreApiResponse<LoginUseCaseDto>>;
    refresh(body: RefreshTokenDto): Promise<CoreApiResponse<RefreshTokenUseCaseDto>>;
    getProfile(user: HttpUserPayload): Promise<CoreApiResponse<UserUseCaseDto>>;
    getCurrentUser(user: HttpUserPayload): Promise<CoreApiResponse<HttpUserPayload>>;
    adminGetUsers(user: HttpUserPayload): Promise<CoreApiResponse<{
        message: string;
    }>>;
    hostDashboard(user: HttpUserPayload): Promise<CoreApiResponse<{
        message: string;
    }>>;
}
