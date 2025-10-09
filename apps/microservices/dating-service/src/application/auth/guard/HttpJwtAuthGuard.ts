import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Simple JWT Auth Guard for Microservice
 * Assumes API Gateway already validated token and forwarded user info in headers
 */
@Injectable()
export class HttpJwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if user info exists (forwarded from API Gateway)
    const userId = request.headers['x-user-id'];
    const userEmail = request.headers['x-user-email'];
    
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    // Attach user to request
    request.user = {
      id: userId,
      email: userEmail,
      // Add more fields as needed
    };
    
    return true;
  }
}

