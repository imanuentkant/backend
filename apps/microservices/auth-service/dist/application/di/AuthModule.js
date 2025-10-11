"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const AuthController_1 = require("../api/http-rest/controller/AuthController");
const UserController_1 = require("../api/http-rest/controller/UserController");
const HttpAuthService_1 = require("../api/http-rest/auth/HttpAuthService");
const HttpJwtStrategy_1 = require("../api/http-rest/auth/passport/HttpJwtStrategy");
const HttpLocalStrategy_1 = require("../api/http-rest/auth/passport/HttpLocalStrategy");
const AuthDITokens_1 = require("../../core/domain/auth/di/AuthDITokens");
const CreateUserService_1 = require("../../core/service/auth/usecase/CreateUserService");
const LoginService_1 = require("../../core/service/auth/usecase/LoginService");
const RefreshTokenService_1 = require("../../core/service/auth/usecase/RefreshTokenService");
const GetUserService_1 = require("../../core/service/auth/usecase/GetUserService");
const InfrastructureModule_1 = require("./InfrastructureModule");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [AuthController_1.AuthController, UserController_1.UserController],
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('API_ACCESS_TOKEN_SECRET'),
                    signOptions: {
                        expiresIn: `${configService.get('API_ACCESS_TOKEN_TTL_IN_MINUTES')}m`,
                    },
                }),
            }),
            InfrastructureModule_1.InfrastructureModule,
        ],
        providers: [
            HttpAuthService_1.HttpAuthService,
            HttpLocalStrategy_1.HttpLocalStrategy,
            HttpJwtStrategy_1.HttpJwtStrategy,
            {
                provide: AuthDITokens_1.AuthDITokens.CreateUserUseCase,
                useFactory: (userRepository) => new CreateUserService_1.CreateUserService(userRepository),
                inject: [AuthDITokens_1.AuthDITokens.UserRepository],
            },
            {
                provide: AuthDITokens_1.AuthDITokens.LoginUseCase,
                useFactory: (userRepository, refreshTokenRepository, jwtService, configService) => new LoginService_1.LoginService(userRepository, refreshTokenRepository, jwtService, configService),
                inject: [AuthDITokens_1.AuthDITokens.UserRepository, AuthDITokens_1.AuthDITokens.RefreshTokenRepository, jwt_1.JwtService, config_1.ConfigService],
            },
            {
                provide: AuthDITokens_1.AuthDITokens.RefreshTokenUseCase,
                useFactory: (refreshTokenRepository, jwtService, configService) => new RefreshTokenService_1.RefreshTokenService(refreshTokenRepository, jwtService, configService),
                inject: [AuthDITokens_1.AuthDITokens.RefreshTokenRepository, jwt_1.JwtService, config_1.ConfigService],
            },
            {
                provide: AuthDITokens_1.AuthDITokens.GetUserUseCase,
                useFactory: (userRepository) => new GetUserService_1.GetUserService(userRepository),
                inject: [AuthDITokens_1.AuthDITokens.UserRepository],
            },
        ],
        exports: [HttpAuthService_1.HttpAuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=AuthModule.js.map