import { AuditLogAsyncAppenderPort } from '@core/common/port/logger/AuditLogAsyncAppenderPort';
import { AuditLogEntry } from '@core/common/audit/AuditLogTypes';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AUDIT_LOG_QUEUE, AuditLogJob } from '@infrastructure/adapter/message/queue/AuditLogQueue';

@Injectable()
export class RedisAuditLogAsyncAppenderAdapter implements AuditLogAsyncAppenderPort {
  constructor(@Inject(AUDIT_LOG_QUEUE) private readonly queue: Queue<AuditLogJob>) {}
  public async append(entry: AuditLogEntry): Promise<void> {
    await this.queue.add('append', {
      actorId: entry.actorId,
      method: entry.method,
      path: entry.path,
      statusCode: entry.statusCode,
      ip: entry.ip,
      userAgent: entry.userAgent,
      body: entry.body,
      params: entry.params,
      query: entry.query,
      createdAt: entry.createdAt.toISOString(),
    });
  }
}
