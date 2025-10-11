import { UserRole } from '@core/common/enums/UserEnums';
export declare class TypeOrmUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    createdAt: Date;
    editedAt: Date;
    removedAt: Date;
}
