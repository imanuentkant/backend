"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const HttpLocalAuthGuard_1 = require("../auth/guard/HttpLocalAuthGuard");
const HttpJwtAuthGuard_1 = require("../auth/guard/HttpJwtAuthGuard");
const HttpRoleAuthGuard_1 = require("../auth/guard/HttpRoleAuthGuard");
const HttpUser_1 = require("../auth/decorator/HttpUser");
const HttpRoles_1 = require("../auth/decorator/HttpRoles");
const LoginDto_1 = require("../dto/LoginDto");
const RefreshTokenDto_1 = require("../dto/RefreshTokenDto");
const RegisterDto_1 = require("../dto/RegisterDto");
const CoreApiResponse_1 = require("../../../../core/common/api/CoreApiResponse");
const UserEnums_1 = require("../../../../core/common/enums/UserEnums");
const AuthDITokens_1 = require("../../../../core/domain/auth/di/AuthDITokens");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(createUserUseCase, loginUseCase, refreshTokenUseCase, getUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.loginUseCase = loginUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.getUserUseCase = getUserUseCase;
    }
    async register(registerDto) {
        const result = await this.createUserUseCase.execute(registerDto);
        return CoreApiResponse_1.CoreApiResponse.success(result);
    }
    async login(request, loginDto) {
        const result = await this.loginUseCase.execute({
            email: loginDto.email,
            password: loginDto.password,
        });
        return CoreApiResponse_1.CoreApiResponse.success(result);
    }
    async refresh(body) {
        const result = await this.refreshTokenUseCase.execute({ refreshToken: body.refreshToken });
        return CoreApiResponse_1.CoreApiResponse.success(result);
    }
    async getProfile(user) {
        const result = await this.getUserUseCase.execute({ id: user.id });
        return CoreApiResponse_1.CoreApiResponse.success(result);
    }
    async getCurrentUser(user) {
        return CoreApiResponse_1.CoreApiResponse.success(user);
    }
    async adminGetUsers(user) {
        return CoreApiResponse_1.CoreApiResponse.success({
            message: `Admin ${user.email} accessed user list`,
        });
    }
    async hostDashboard(user) {
        return CoreApiResponse_1.CoreApiResponse.success({
            message: `Host ${user.email} accessed dashboard`,
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng ký user mới' }),
    (0, swagger_1.ApiBody)({ type: RegisterDto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User đã được tạo thành công' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dữ liệu không hợp lệ' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email đã tồn tại' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(HttpLocalAuthGuard_1.HttpLocalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng nhập' }),
    (0, swagger_1.ApiBody)({ type: LoginDto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Đăng nhập thành công, trả về access token và refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Email hoặc password không đúng' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, LoginDto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiBody)({ type: RefreshTokenDto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Access token mới được tạo thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Refresh token không hợp lệ hoặc đã hết hạn' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(HttpJwtAuthGuard_1.HttpJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin profile của user hiện tại' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thông tin user' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' }),
    __param(0, (0, HttpUser_1.HttpUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(HttpJwtAuthGuard_1.HttpJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin user từ JWT token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thông tin user từ token' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' }),
    __param(0, (0, HttpUser_1.HttpUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('admin/users'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(HttpJwtAuthGuard_1.HttpJwtAuthGuard, HttpRoleAuthGuard_1.HttpRoleAuthGuard),
    (0, HttpRoles_1.HttpRoles)(UserEnums_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN ONLY] Lấy danh sách users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách users' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập (chỉ ADMIN)' }),
    __param(0, (0, HttpUser_1.HttpUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminGetUsers", null);
__decorate([
    (0, common_1.Get)('host/dashboard'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(HttpJwtAuthGuard_1.HttpJwtAuthGuard, HttpRoleAuthGuard_1.HttpRoleAuthGuard),
    (0, HttpRoles_1.HttpRoles)(UserEnums_1.UserRole.HOST, UserEnums_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[HOST/ADMIN] Truy cập host dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập (chỉ HOST hoặc ADMIN)' }),
    __param(0, (0, HttpUser_1.HttpUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "hostDashboard", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Authentication'),
    __param(0, (0, common_1.Inject)(AuthDITokens_1.AuthDITokens.CreateUserUseCase)),
    __param(1, (0, common_1.Inject)(AuthDITokens_1.AuthDITokens.LoginUseCase)),
    __param(2, (0, common_1.Inject)(AuthDITokens_1.AuthDITokens.RefreshTokenUseCase)),
    __param(3, (0, common_1.Inject)(AuthDITokens_1.AuthDITokens.GetUserUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AuthController);
//# sourceMappingURL=AuthController.js.map