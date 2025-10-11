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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLocalStrategy = void 0;
const HttpAuthService_1 = require("../HttpAuthService");
const Code_1 = require("../../../../../core/common/code/Code");
const Exception_1 = require("../../../../../core/common/exception/Exception");
const CoreAssert_1 = require("../../../../../core/common/util/assert/CoreAssert");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_local_1 = require("passport-local");
const config_1 = require("@nestjs/config");
let HttpLocalStrategy = class HttpLocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(configService, authService) {
        const LOGIN_USERNAME_FIELD = configService.get('API_LOGIN_USERNAME_FIELD') || 'email';
        const LOGIN_PASSWORD_FIELD = configService.get('API_LOGIN_PASSWORD_FIELD') || 'password';
        super({
            usernameField: LOGIN_USERNAME_FIELD,
            passwordField: LOGIN_PASSWORD_FIELD,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(username, password) {
        return CoreAssert_1.CoreAssert.notEmpty(await this.authService.validateUser(username, password), Exception_1.Exception.new({ code: Code_1.Code.WRONG_CREDENTIALS_ERROR }));
    }
};
exports.HttpLocalStrategy = HttpLocalStrategy;
exports.HttpLocalStrategy = HttpLocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, HttpAuthService_1.HttpAuthService])
], HttpLocalStrategy);
//# sourceMappingURL=HttpLocalStrategy.js.map