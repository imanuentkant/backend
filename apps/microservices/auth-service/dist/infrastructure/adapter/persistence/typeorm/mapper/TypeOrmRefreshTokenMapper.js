"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRefreshTokenMapper = void 0;
const RefreshToken_1 = require("../../../../../core/domain/auth/entity/RefreshToken");
const TypeOrmRefreshToken_1 = require("../entity/TypeOrmRefreshToken");
class TypeOrmRefreshTokenMapper {
    static toOrmEntity(domainEntity) {
        const ormEntity = new TypeOrmRefreshToken_1.TypeOrmRefreshToken();
        ormEntity.id = domainEntity.getId();
        ormEntity.userId = domainEntity.getUserId();
        ormEntity.token = domainEntity.getToken();
        ormEntity.expiresAt = domainEntity.getExpiresAt();
        ormEntity.createdAt = domainEntity.getCreatedAt();
        return ormEntity;
    }
    static toDomainEntity(ormEntity) {
        const domainEntity = new RefreshToken_1.RefreshToken({
            id: ormEntity.id,
            userId: ormEntity.userId,
            token: ormEntity.token,
            expiresAt: ormEntity.expiresAt,
            createdAt: ormEntity.createdAt,
        });
        return domainEntity;
    }
}
exports.TypeOrmRefreshTokenMapper = TypeOrmRefreshTokenMapper;
//# sourceMappingURL=TypeOrmRefreshTokenMapper.js.map