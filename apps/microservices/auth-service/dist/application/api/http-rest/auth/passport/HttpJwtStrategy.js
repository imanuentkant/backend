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
exports.HttpJwtStrategy = void 0;
const HttpAuthService_1 = require("../HttpAuthService");
const Code_1 = require("../../../../../core/common/code/Code");
const Exception_1 = require("../../../../../core/common/exception/Exception");
const CoreAssert_1 = require("../../../../../core/common/util/assert/CoreAssert");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
let HttpJwtStrategy = class HttpJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(configService, authService) {
        const ACCESS_TOKEN_SECRET = configService.get('API_ACCESS_TOKEN_SECRET');
        if (!ACCESS_TOKEN_SECRET) {
            throw Exception_1.Exception.new({ code: Code_1.Code.INTERNAL_ERROR, overrideMessage: 'ACCESS_TOKEN_SECRET is not defined' });
        }
        const ACCESS_TOKEN_IGNORE_EXPIRATION = configService.get('API_ACCESS_TOKEN_IGNORE_EXPIRATION');
        if (!ACCESS_TOKEN_IGNORE_EXPIRATION) {
            throw Exception_1.Exception.new({
                code: Code_1.Code.INTERNAL_ERROR,
                overrideMessage: 'ACCESS_TOKEN_IGNORE_EXPIRATION is not defined',
            });
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: ACCESS_TOKEN_IGNORE_EXPIRATION === 'true',
            secretOrKey: ACCESS_TOKEN_SECRET,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(payload) {
        const user = CoreAssert_1.CoreAssert.notEmpty(await this.authService.getUser({ id: payload.id }), Exception_1.Exception.new({ code: Code_1.Code.UNAUTHORIZED_ERROR }));
        return { id: user.getId(), email: user.getEmail(), role: user.getRole() };
    }
};
exports.HttpJwtStrategy = HttpJwtStrategy;
exports.HttpJwtStrategy = HttpJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, HttpAuthService_1.HttpAuthService])
], HttpJwtStrategy);
//# sourceMappingURL=HttpJwtStrategy.js.map