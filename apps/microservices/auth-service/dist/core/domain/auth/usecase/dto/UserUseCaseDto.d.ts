import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { User } from '@core/domain/auth/entity/User';
export declare class UserUseCaseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    editedAt: Nullable<Date>;
    removedAt: Nullable<Date>;
    static newFromUser(user: User): UserUseCaseDto;
}
