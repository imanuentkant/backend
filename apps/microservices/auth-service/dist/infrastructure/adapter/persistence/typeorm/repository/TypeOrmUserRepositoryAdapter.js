"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmUserRepositoryAdapter = void 0;
const TypeOrmUserMapper_1 = require("../mapper/TypeOrmUserMapper");
const TypeOrmUser_1 = require("../entity/TypeOrmUser");
class TypeOrmUserRepositoryAdapter {
    constructor(repository) {
        this.userAlias = 'user';
        this.excludeRemovedUserClause = `"${this.userAlias}"."removedAt" IS NULL`;
        this.repository = repository;
    }
    async findUser(by, options = {}) {
        let domainEntity;
        const query = this.buildUserQueryBuilder();
        this.extendQueryWithByProperties(by, query);
        if (!options.includeRemoved) {
            query.andWhere(this.excludeRemovedUserClause);
        }
        const ormEntity = await query.getOne();
        if (ormEntity) {
            domainEntity = TypeOrmUserMapper_1.TypeOrmUserMapper.toDomainEntity(ormEntity);
        }
        return domainEntity;
    }
    async countUsers(by, options = {}) {
        const query = this.buildUserQueryBuilder();
        this.extendQueryWithByProperties(by, query);
        if (!options.includeRemoved) {
            query.andWhere(this.excludeRemovedUserClause);
        }
        return query.getCount();
    }
    async addUser(user) {
        const ormUser = TypeOrmUserMapper_1.TypeOrmUserMapper.toOrmEntity(user);
        const insertResult = await this.repository
            .createQueryBuilder(this.userAlias)
            .insert()
            .into(TypeOrmUser_1.TypeOrmUser)
            .values([ormUser])
            .execute();
        return {
            id: insertResult.identifiers[0].id,
        };
    }
    async updateUser(user) {
        const ormUser = TypeOrmUserMapper_1.TypeOrmUserMapper.toOrmEntity(user);
        await this.repository.update(ormUser.id, ormUser);
    }
    buildUserQueryBuilder() {
        return this.repository.createQueryBuilder(this.userAlias).select();
    }
    extendQueryWithByProperties(by, query) {
        if (by.id) {
            query.andWhere(`"${this.userAlias}"."id" = :id`, { id: by.id });
        }
        if (by.email) {
            query.andWhere(`"${this.userAlias}"."email" = :email`, { email: by.email });
        }
    }
}
exports.TypeOrmUserRepositoryAdapter = TypeOrmUserRepositoryAdapter;
//# sourceMappingURL=TypeOrmUserRepositoryAdapter.js.map