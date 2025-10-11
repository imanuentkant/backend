"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRefreshTokenRepositoryAdapter = void 0;
const TypeOrmRefreshTokenMapper_1 = require("../mapper/TypeOrmRefreshTokenMapper");
class TypeOrmRefreshTokenRepositoryAdapter {
    constructor(repository) {
        this.repository = repository;
    }
    async findByToken(token) {
        const ormEntity = await this.repository.findOne({ where: { token } });
        if (ormEntity) {
            return TypeOrmRefreshTokenMapper_1.TypeOrmRefreshTokenMapper.toDomainEntity(ormEntity);
        }
        return undefined;
    }
    async findByUserId(userId) {
        const ormEntity = await this.repository.findOne({ where: { userId } });
        if (ormEntity) {
            return TypeOrmRefreshTokenMapper_1.TypeOrmRefreshTokenMapper.toDomainEntity(ormEntity);
        }
        return undefined;
    }
    async save(refreshToken) {
        const ormEntity = TypeOrmRefreshTokenMapper_1.TypeOrmRefreshTokenMapper.toOrmEntity(refreshToken);
        await this.repository.save(ormEntity);
    }
    async deleteByUserId(userId) {
        await this.repository.delete({ userId });
    }
}
exports.TypeOrmRefreshTokenRepositoryAdapter = TypeOrmRefreshTokenRepositoryAdapter;
//# sourceMappingURL=TypeOrmRefreshTokenRepositoryAdapter.js.map