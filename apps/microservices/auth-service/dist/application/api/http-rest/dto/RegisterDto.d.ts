import { UserRole } from '@core/common/enums/UserEnums';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
}
