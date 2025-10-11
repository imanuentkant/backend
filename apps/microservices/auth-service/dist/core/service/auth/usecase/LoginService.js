"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const Code_1 = require("../../../common/code/Code");
const Exception_1 = require("../../../common/exception/Exception");
const CoreAssert_1 = require("../../../common/util/assert/CoreAssert");
const RefreshToken_1 = require("../../../domain/auth/entity/RefreshToken");
class LoginService {
    constructor(userRepository, refreshTokenRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async execute(payload) {
        const user = await this.userRepository.findUser({ email: payload.email });
        CoreAssert_1.CoreAssert.notEmpty(user, Exception_1.Exception.new({ code: Code_1.Code.WRONG_CREDENTIALS_ERROR, overrideMessage: 'Invalid credentials.' }));
        const isPasswordValid = await user.comparePassword(payload.password);
        CoreAssert_1.CoreAssert.isTrue(isPasswordValid, Exception_1.Exception.new({ code: Code_1.Code.WRONG_CREDENTIALS_ERROR, overrideMessage: 'Invalid credentials.' }));
        const accessPayload = { id: user.getId() };
        const refreshPayload = { id: user.getId(), type: 'refresh' };
        const accessToken = this.jwtService.sign(accessPayload);
        const refreshToken = this.jwtService.sign(refreshPayload, {
            secret: this.configService.get('API_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('API_REFRESH_TOKEN_TTL_IN_DAYS')}d`,
        });
        const refreshTokenTTL = Number(this.configService.get('API_REFRESH_TOKEN_TTL_IN_DAYS')) || 7;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + refreshTokenTTL);
        await this.refreshTokenRepository.deleteByUserId(user.getId());
        const refreshTokenEntity = await RefreshToken_1.RefreshToken.new({
            userId: user.getId(),
            token: refreshToken,
            expiresAt: expiresAt,
        });
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return {
            id: user.getId(),
            accessToken,
            refreshToken,
        };
    }
}
exports.LoginService = LoginService;
//# sourceMappingURL=LoginService.js.map