import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Cấu hình bảo mật cho ứng dụng
 * Centralized security configuration
 */
@Injectable()
export class SecurityConfig {
  constructor(private configService: ConfigService) {}

  /**
   * Cấu hình CORS
   */
  getCorsConfig() {
    return {
      origin: this.getAllowedOrigins(),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        this.configService.get('API_ACCESS_TOKEN_HEADER', 'x-api-token'),
      ],
      exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
      credentials: true,
      maxAge: 86400, // 24 hours
    };
  }

  /**
   * Cấu hình Helmet security headers
   */
  getHelmetConfig() {
    return {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' as const },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const },
    };
  }

  /**
   * Cấu hình Rate Limiting
   */
  getRateLimitConfig() {
    return {
      ttl: this.configService.get('RATE_LIMIT_TTL', 60), // seconds
      limit: this.configService.get('RATE_LIMIT_MAX', 100), // requests
      ignoreUserAgents: [
        /health-check/i,
        /monitoring/i,
      ],
    };
  }

  /**
   * Lấy danh sách origins được phép
   */
  private getAllowedOrigins(): string[] | boolean {
    const env = this.configService.get('NODE_ENV', 'development');
    
    if (env === 'development') {
      return true; // Allow all in development
    }

    const allowedOriginsStr = this.configService.get('ALLOWED_ORIGINS', '');
    if (!allowedOriginsStr) {
      return ['https://yourdomain.com']; // Default production domain
    }

    return allowedOriginsStr.split(',').map((origin: string) => origin.trim());
  }

  /**
   * Kiểm tra có nên enable HTTPS enforcement
   */
  shouldEnforceHttps(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }
}

