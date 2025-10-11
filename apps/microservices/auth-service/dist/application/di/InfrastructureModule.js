"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const AuthDITokens_1 = require("../../core/domain/auth/di/AuthDITokens");
const TypeOrmUser_1 = require("../../infrastructure/adapter/persistence/typeorm/entity/TypeOrmUser");
const TypeOrmRefreshToken_1 = require("../../infrastructure/adapter/persistence/typeorm/entity/TypeOrmRefreshToken");
const TypeOrmUserRepositoryAdapter_1 = require("../../infrastructure/adapter/persistence/typeorm/repository/TypeOrmUserRepositoryAdapter");
const TypeOrmRefreshTokenRepositoryAdapter_1 = require("../../infrastructure/adapter/persistence/typeorm/repository/TypeOrmRefreshTokenRepositoryAdapter");
let InfrastructureModule = class InfrastructureModule {
};
exports.InfrastructureModule = InfrastructureModule;
exports.InfrastructureModule = InfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([TypeOrmUser_1.TypeOrmUser, TypeOrmRefreshToken_1.TypeOrmRefreshToken])],
        providers: [
            {
                provide: AuthDITokens_1.AuthDITokens.UserRepository,
                useFactory: (dataSource) => {
                    const repository = dataSource.getRepository(TypeOrmUser_1.TypeOrmUser);
                    return new TypeOrmUserRepositoryAdapter_1.TypeOrmUserRepositoryAdapter(repository);
                },
                inject: [typeorm_2.DataSource],
            },
            {
                provide: AuthDITokens_1.AuthDITokens.RefreshTokenRepository,
                useFactory: (dataSource) => {
                    const repository = dataSource.getRepository(TypeOrmRefreshToken_1.TypeOrmRefreshToken);
                    return new TypeOrmRefreshTokenRepositoryAdapter_1.TypeOrmRefreshTokenRepositoryAdapter(repository);
                },
                inject: [typeorm_2.DataSource],
            },
        ],
        exports: [AuthDITokens_1.AuthDITokens.UserRepository, AuthDITokens_1.AuthDITokens.RefreshTokenRepository],
    })
], InfrastructureModule);
//# sourceMappingURL=InfrastructureModule.js.map