import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { HttpRoleAuthGuard } from '@application/api/http-rest/auth/guard/HttpRoleAuthGuard';
import { HttpUser } from '@application/api/http-rest/auth/decorator/HttpUser';
import { HttpRoles } from '@application/api/http-rest/auth/decorator/HttpRoles';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserRole } from '@core/common/enums/UserEnums';
import { AuthDITokens } from '@core/domain/auth/di/AuthDITokens';
import { GetUserUseCase } from '@core/domain/auth/usecase/GetUserUseCase';
import { UserUseCaseDto } from '@core/domain/auth/usecase/dto/UserUseCaseDto';
import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject(AuthDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin profile của user đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  public async getMyProfile(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<UserUseCaseDto>> {
    const result = await this.getUserUseCase.execute({ id: user.id });
    return CoreApiResponse.success(result);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpRoleAuthGuard)
  @HttpRoles(UserRole.ADMIN)
  @ApiOperation({ summary: '[ADMIN ONLY] Lấy thông tin user theo ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập (chỉ ADMIN)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user' })
  public async getUserById(@Param('id') id: string): Promise<CoreApiResponse<UserUseCaseDto>> {
    const result = await this.getUserUseCase.execute({ id });
    return CoreApiResponse.success(result);
  }
}

