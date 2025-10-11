import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable } from '@core/common/type/CommonTypes';

export type CreateUserEntityPayload = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt?: Date;
  editedAt?: Nullable<Date>;
  removedAt?: Nullable<Date>;
};

