import { User } from '@core/domain/auth/entity/User';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmUser';
export declare class TypeOrmUserMapper {
    static toOrmEntity(domainUser: User): TypeOrmUser;
    static toOrmEntities(domainUsers: User[]): TypeOrmUser[];
    static toDomainEntity(ormUser: TypeOrmUser): User;
    static toDomainEntities(ormUsers: TypeOrmUser[]): User[];
}
