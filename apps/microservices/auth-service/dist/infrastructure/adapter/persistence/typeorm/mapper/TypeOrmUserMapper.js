"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmUserMapper = void 0;
const User_1 = require("../../../../../core/domain/auth/entity/User");
const TypeOrmUser_1 = require("../entity/TypeOrmUser");
class TypeOrmUserMapper {
    static toOrmEntity(domainUser) {
        const ormUser = new TypeOrmUser_1.TypeOrmUser();
        ormUser.id = domainUser.getId();
        ormUser.firstName = domainUser.getFirstName();
        ormUser.lastName = domainUser.getLastName();
        ormUser.email = domainUser.getEmail();
        ormUser.role = domainUser.getRole();
        ormUser.password = domainUser.getPassword();
        ormUser.createdAt = domainUser.getCreatedAt();
        ormUser.editedAt = domainUser.getEditedAt();
        ormUser.removedAt = domainUser.getRemovedAt();
        return ormUser;
    }
    static toOrmEntities(domainUsers) {
        return domainUsers.map((domainUser) => this.toOrmEntity(domainUser));
    }
    static toDomainEntity(ormUser) {
        const domainUser = new User_1.User({
            firstName: ormUser.firstName,
            lastName: ormUser.lastName,
            email: ormUser.email,
            role: ormUser.role,
            password: ormUser.password,
            id: ormUser.id,
            createdAt: ormUser.createdAt,
            editedAt: ormUser.editedAt,
            removedAt: ormUser.removedAt,
        });
        return domainUser;
    }
    static toDomainEntities(ormUsers) {
        return ormUsers.map((ormUser) => this.toDomainEntity(ormUser));
    }
}
exports.TypeOrmUserMapper = TypeOrmUserMapper;
//# sourceMappingURL=TypeOrmUserMapper.js.map