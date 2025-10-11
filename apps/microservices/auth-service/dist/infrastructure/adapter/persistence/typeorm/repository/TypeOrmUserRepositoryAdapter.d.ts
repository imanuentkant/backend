import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';
import { Optional } from '@core/common/type/CommonTypes';
import { User } from '@core/domain/auth/entity/User';
import { UserRepositoryPort } from '@core/domain/auth/port/persistence/UserRepositoryPort';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/TypeOrmUser';
import { Repository } from 'typeorm';
export declare class TypeOrmUserRepositoryAdapter implements UserRepositoryPort {
    private readonly repository;
    private readonly userAlias;
    private readonly excludeRemovedUserClause;
    constructor(repository: Repository<TypeOrmUser>);
    findUser(by: {
        id?: string;
        email?: string;
    }, options?: RepositoryFindOptions): Promise<Optional<User>>;
    countUsers(by: {
        id?: string;
        email?: string;
    }, options?: RepositoryFindOptions): Promise<number>;
    addUser(user: User): Promise<{
        id: string;
    }>;
    updateUser(user: User): Promise<void>;
    private buildUserQueryBuilder;
    private extendQueryWithByProperties;
}
