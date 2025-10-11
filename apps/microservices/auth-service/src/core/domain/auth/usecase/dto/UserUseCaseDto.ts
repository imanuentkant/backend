import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { User } from '@core/domain/auth/entity/User';

export class UserUseCaseDto {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public role: UserRole;
  public createdAt: Date;
  public editedAt: Nullable<Date>;
  public removedAt: Nullable<Date>;

  public static newFromUser(user: User): UserUseCaseDto {
    return {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      role: user.getRole(),
      createdAt: user.getCreatedAt(),
      editedAt: user.getEditedAt(),
      removedAt: user.getRemovedAt(),
    };
  }
}

