import { Injectable, Logger } from '@nestjs/common';

/**
 * Service để collect metrics cho monitoring
 * Trong production, integrate với Prometheus hoặc DataDog
 */
@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private metrics: Map<string, number> = new Map();

  /**
   * Increment counter metric
   */
  incrementCounter(name: string, labels?: Record<string, string>): void {
    const key = this.generateKey(name, labels);
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
  }

  /**
   * Set gauge metric
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.generateKey(name, labels);
    this.metrics.set(key, value);
  }

  /**
   * Record histogram value (response time, etc.)
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    // Simplified histogram - in production use proper histogram implementation
    const key = this.generateKey(name, labels);
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, (current + value) / 2); // Simple average
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Generate metric key with labels
   */
  private generateKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    
    return `${name}{${labelStr}}`;
  }

  /**
   * Track API request
   */
  trackRequest(method: string, path: string, statusCode: number, duration: number): void {
    this.incrementCounter('http_requests_total', { method, path, status: statusCode.toString() });
    this.recordHistogram('http_request_duration_ms', duration, { method, path });
  }

  /**
   * Track database query
   */
  trackDatabaseQuery(query: string, duration: number, success: boolean): void {
    this.incrementCounter('db_queries_total', { success: success.toString() });
    this.recordHistogram('db_query_duration_ms', duration);
  }

  /**
   * Track cache hit/miss
   */
  trackCacheAccess(hit: boolean): void {
    this.incrementCounter('cache_access_total', { hit: hit.toString() });
  }
}

