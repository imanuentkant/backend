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
exports.UserController = void 0;
const HttpJwtAuthGuard_1 = require("../auth/guard/HttpJwtAuthGuard");
const HttpRoleAuthGuard_1 = require("../auth/guard/HttpRoleAuthGuard");
const HttpUser_1 = require("../auth/decorator/HttpUser");
const HttpRoles_1 = require("../auth/decorator/HttpRoles");
const CoreApiResponse_1 = require("../../../../core/common/api/CoreApiResponse");
const UserEnums_1 = require("../../../../core/common/enums/UserEnums");
const AuthDITokens_1 = require("../../../../core/domain/auth/di/AuthDITokens");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    constructor(getUserUseCase) {
        this.getUserUseCase = getUserUseCase;
    }
    async getMyProfile(user) {
        const result = await this.getUserUseCase.execute({ id: user.id });
        return CoreApiResponse_1.CoreApiResponse.success(result);
    }
    async getUserById(id) {
        const result = await this.getUserUseCase.execute({ id });
        return CoreApiResponse_1.CoreApiResponse.success(result);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin profile của user đang đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thông tin user' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    __param(0, (0, HttpUser_1.HttpUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(HttpRoleAuthGuard_1.HttpRoleAuthGuard),
    (0, HttpRoles_1.HttpRoles)(UserEnums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN ONLY] Lấy thông tin user theo ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thông tin user' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập (chỉ ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.UseGuards)(HttpJwtAuthGuard_1.HttpJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)(AuthDITokens_1.AuthDITokens.GetUserUseCase)),
    __metadata("design:paramtypes", [Object])
], UserController);
//# sourceMappingURL=UserController.js.map