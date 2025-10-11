"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const Code_1 = require("../../../common/code/Code");
const Exception_1 = require("../../../common/exception/Exception");
const CoreAssert_1 = require("../../../common/util/assert/CoreAssert");
class RefreshTokenService {
    constructor(refreshTokenRepository, jwtService, configService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async execute(payload) {
        CoreAssert_1.CoreAssert.notEmpty(payload.refreshToken, Exception_1.Exception.new({ code: Code_1.Code.UNAUTHORIZED_ERROR, overrideMessage: 'Refresh token is required.' }));
        let tokenPayload;
        try {
            tokenPayload = this.jwtService.verify(payload.refreshToken, {
                secret: this.configService.get('API_REFRESH_TOKEN_SECRET'),
            });
            CoreAssert_1.CoreAssert.isTrue(tokenPayload.type === 'refresh', Exception_1.Exception.new({ code: Code_1.Code.UNAUTHORIZED_ERROR, overrideMessage: 'Invalid token type.' }));
        }
        catch (error) {
            throw Exception_1.Exception.new({ code: Code_1.Code.UNAUTHORIZED_ERROR, overrideMessage: 'Invalid or expired refresh token.' });
        }
        const storedToken = await this.refreshTokenRepository.findByToken(payload.refreshToken);
        CoreAssert_1.CoreAssert.notEmpty(storedToken, Exception_1.Exception.new({ code: Code_1.Code.UNAUTHORIZED_ERROR, overrideMessage: 'Refresh token not found.' }));
        CoreAssert_1.CoreAssert.isFalse(storedToken.isExpired(), Exception_1.Exception.new({ code: Code_1.Code.UNAUTHORIZED_ERROR, overrideMessage: 'Refresh token has expired.' }));
        const accessToken = this.jwtService.sign({ id: tokenPayload.id });
        return {
            accessToken,
        };
    }
}
exports.RefreshTokenService = RefreshTokenService;
//# sourceMappingURL=RefreshTokenService.js.map