import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export type AuditLogJob = {
  actorId: string | null;
  method: string;
  path: string;
  statusCode: number;
  ip: string | null;
  userAgent: string | null;
  body: any;
  params: any;
  query: any;
  createdAt: string;
};

export const AUDIT_LOG_QUEUE = Symbol('AUDIT_LOG_QUEUE');

export const AuditLogQueueProvider: Provider = {
  provide: AUDIT_LOG_QUEUE,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Queue<AuditLogJob> => {
    const connection = new IORedis(
      config.get<string>('REDIS_URL') || 'redis://localhost:6379',
      { maxRetriesPerRequest: null as any, enableReadyCheck: false }
    );
    const queue = new Queue<AuditLogJob>('audit_log', { connection });
    return queue;
  },
};
