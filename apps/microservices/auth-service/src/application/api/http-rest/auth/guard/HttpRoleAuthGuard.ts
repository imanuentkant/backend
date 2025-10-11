import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@core/common/enums/UserEnums';
import { HttpRequestWithUser } from '@application/api/http-rest/auth/type/HttpAuthTypes';

@Injectable()
export class HttpRoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<HttpRequestWithUser>();
    const user = request.user;

    return requiredRoles.some((role) => user.role === role);
  }
}

