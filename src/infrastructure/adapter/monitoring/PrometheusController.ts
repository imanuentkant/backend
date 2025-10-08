import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { MetricsService } from './MetricsService';

/**
 * Controller để expose metrics cho Prometheus
 */
@ApiTags('Monitoring')
@Controller('metrics')
export class PrometheusController {
  constructor(private metricsService: MetricsService) {}

  /**
   * Endpoint cho Prometheus scraping
   * Format: Prometheus text format
   */
  @Get()
  @ApiExcludeEndpoint() // Hide from Swagger
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  getMetrics(): string {
    const metrics = this.metricsService.getAllMetrics();
    
    // Convert to Prometheus text format
    const lines: string[] = [];
    
    for (const [key, value] of Object.entries(metrics)) {
      lines.push(`${key} ${value}`);
    }
    
    return lines.join('\n');
  }
}

