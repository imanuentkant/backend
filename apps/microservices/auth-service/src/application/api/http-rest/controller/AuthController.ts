import { HttpLocalAuthGuard } from '@application/api/http-rest/auth/guard/HttpLocalAuthGuard';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { HttpRoleAuthGuard } from '@application/api/http-rest/auth/guard/HttpRoleAuthGuard';
import { HttpUser } from '@application/api/http-rest/auth/decorator/HttpUser';
import { HttpRoles } from '@application/api/http-rest/auth/decorator/HttpRoles';
import { HttpRequestWithUser, HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { LoginDto } from '@application/api/http-rest/dto/LoginDto';
import { RefreshTokenDto } from '@application/api/http-rest/dto/RefreshTokenDto';
import { RegisterDto } from '@application/api/http-rest/dto/RegisterDto';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserRole } from '@core/common/enums/UserEnums';
import { AuthDITokens } from '@core/domain/auth/di/AuthDITokens';
import { CreateUserUseCase } from '@core/domain/auth/usecase/CreateUserUseCase';
import { LoginUseCase } from '@core/domain/auth/usecase/LoginUseCase';
import { RefreshTokenUseCase } from '@core/domain/auth/usecase/RefreshTokenUseCase';
import { GetUserUseCase } from '@core/domain/auth/usecase/GetUserUseCase';
import { LoginUseCaseDto } from '@core/domain/auth/usecase/dto/LoginUseCaseDto';
import { RefreshTokenUseCaseDto } from '@core/domain/auth/usecase/dto/RefreshTokenUseCaseDto';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    @Inject(AuthDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(AuthDITokens.LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @Inject(AuthDITokens.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @Inject(AuthDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký user mới' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  public async register(@Body() registerDto: RegisterDto): Promise<CoreApiResponse<UserUseCaseDto>> {
    const result = await this.createUserUseCase.execute(registerDto);
    return CoreApiResponse.success(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthGuard)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về access token và refresh token' })
  @ApiResponse({ status: 401, description: 'Email hoặc password không đúng' })
  public async login(
    @Req() request: HttpRequestWithUser,
    @Body() loginDto: LoginDto,
  ): Promise<CoreApiResponse<LoginUseCaseDto>> {
    // LocalStrategy đã validate credentials, bây giờ tạo tokens
    const result = await this.loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
    });
    return CoreApiResponse.success(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Access token mới được tạo thành công' })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ hoặc đã hết hạn' })
  public async refresh(@Body() body: RefreshTokenDto): Promise<CoreApiResponse<RefreshTokenUseCaseDto>> {
    const result = await this.refreshTokenUseCase.execute({ refreshToken: body.refreshToken });
    return CoreApiResponse.success(result);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin profile của user hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  public async getProfile(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<UserUseCaseDto>> {
    const result = await this.getUserUseCase.execute({ id: user.id });
    return CoreApiResponse.success(result);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user từ JWT token' })
  @ApiResponse({ status: 200, description: 'Thông tin user từ token' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  public async getCurrentUser(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<HttpUserPayload>> {
    return CoreApiResponse.success(user);
  }

  @Get('admin/users')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpJwtAuthGuard, HttpRoleAuthGuard)
  @HttpRoles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN ONLY] Lấy danh sách users' })
  @ApiResponse({ status: 200, description: 'Danh sách users' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập (chỉ ADMIN)' })
  public async adminGetUsers(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<{ message: string }>> {
    return CoreApiResponse.success({
      message: `Admin ${user.email} accessed user list`,
    });
  }

  @Get('host/dashboard')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpJwtAuthGuard, HttpRoleAuthGuard)
  @HttpRoles(UserRole.HOST, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[HOST/ADMIN] Truy cập host dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập (chỉ HOST hoặc ADMIN)' })
  public async hostDashboard(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<{ message: string }>> {
    return CoreApiResponse.success({
      message: `Host ${user.email} accessed dashboard`,
    });
  }
}

