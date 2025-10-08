import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Health check endpoints cho monitoring và load balancer
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Basic liveness check
   * Load balancer sử dụng để check xem service có đang chạy không
   */
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Service đang chạy' })
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness check - kiểm tra service có sẵn sàng nhận traffic không
   * Bao gồm database connection check
   */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({ status: 200, description: 'Service sẵn sàng' })
  @ApiResponse({ status: 503, description: 'Service chưa sẵn sàng' })
  async getReadiness() {
    const checks = {
      database: await this.checkDatabase(),
      // Có thể thêm các checks khác: redis, external APIs, etc.
    };

    const isHealthy = Object.values(checks).every((check) => check.status === 'up');

    return {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  /**
   * Detailed health check với thông tin về các dependencies
   */
  @Get()
  @ApiOperation({ summary: 'Detailed health check' })
  @ApiResponse({ status: 200, description: 'Health information' })
  async getHealth() {
    const dbCheck = await this.checkDatabase();
    
    return {
      status: dbCheck.status === 'up' ? 'healthy' : 'unhealthy',
      version: this.configService.get('API_VERSION', '1.0.0'),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV', 'development'),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
      },
      checks: {
        database: dbCheck,
      },
    };
  }

  /**
   * Kiểm tra kết nối database
   */
  private async checkDatabase(): Promise<{ status: string; responseTime?: number; error?: string }> {
    try {
      const startTime = Date.now();
      await this.dataSource.query('SELECT 1');
      const responseTime = Date.now() - startTime;

      return {
        status: 'up',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

