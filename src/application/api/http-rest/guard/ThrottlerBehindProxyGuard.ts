import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

/**
 * Custom ThrottlerGuard để handle rate limiting khi app đằng sau proxy/load balancer
 * Sử dụng X-Forwarded-For header để lấy real IP
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Lấy IP thật từ X-Forwarded-For header (khi đằng sau proxy)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
    
    return ip;
  }
}

