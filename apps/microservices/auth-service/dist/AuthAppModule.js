"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const AuthModule_1 = require("./application/di/AuthModule");
const DatabaseModule_1 = require("./application/di/DatabaseModule");
const NestHttpExceptionFilter_1 = require("./application/api/http-rest/exception-filter/NestHttpExceptionFilter");
let AuthAppModule = class AuthAppModule {
};
exports.AuthAppModule = AuthAppModule;
exports.AuthAppModule = AuthAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    '.env',
                    '../../../infrastructure/env/.env.auth',
                    '../../../infrastructure/env/.env.development',
                ],
            }),
            DatabaseModule_1.DatabaseModule,
            AuthModule_1.AuthModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: NestHttpExceptionFilter_1.NestHttpExceptionFilter,
            },
        ],
    })
], AuthAppModule);
//# sourceMappingURL=AuthAppModule.js.map