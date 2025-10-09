import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  id: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const ACCESS_TOKEN_SECRET = configService.get<string>('API_ACCESS_TOKEN_SECRET') || 'your-secret-key-change-in-production';
    const IGNORE_EXPIRATION = configService.get<string>('API_ACCESS_TOKEN_IGNORE_EXPIRATION') === 'true';
    
    console.log(`[API Gateway] JWT Strategy initialized`);
    console.log(`[API Gateway] Using SECRET: ${ACCESS_TOKEN_SECRET.substring(0, 10)}...`);
    console.log(`[API Gateway] Ignore Expiration: ${IGNORE_EXPIRATION}`);
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: IGNORE_EXPIRATION,
      secretOrKey: ACCESS_TOKEN_SECRET,
    });
  }

  /**
   * Passport automatically calls this method after verifying JWT signature
   * We just need to return user payload that will be attached to request.user
   */
  async validate(payload: JwtPayload): Promise<UserPayload> {
    if (!payload.id || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    console.log(`[API Gateway] JWT validated for user: ${payload.email}`);

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'USER',
    };
  }
}

