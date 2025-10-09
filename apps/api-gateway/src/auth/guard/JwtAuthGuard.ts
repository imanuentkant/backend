import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Call parent AuthGuard which will invoke JwtStrategy
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      console.error(`[API Gateway] Auth failed for ${request.url}:`, info?.message || err?.message);
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user;
  }
}

