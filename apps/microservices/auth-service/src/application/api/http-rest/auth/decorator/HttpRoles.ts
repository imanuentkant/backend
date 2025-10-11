import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@core/common/enums/UserEnums';

export const HttpRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

