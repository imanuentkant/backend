import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { AuditLogJob } from './AuditLogQueue';
import { DataSource } from 'typeorm';
import { TypeOrmAuditLog } from '@infrastructure/adapter/persistence/typeorm/entity/audit/TypeOrmAuditLog';
import { Collection, MongoClient } from 'mongodb';

@Injectable()
export class AuditLogWorker {
  private worker: Worker<AuditLogJob>;

  constructor(private readonly config: ConfigService, private readonly dataSource: DataSource) {
    const connection = new IORedis(
      this.config.get<string>('REDIS_URL') || 'redis://localhost:6379',
      { maxRetriesPerRequest: null as any, enableReadyCheck: false }
    );
    this.worker = new Worker<AuditLogJob>(
      'audit_log',
      async job => {
        const repo = this.dataSource.getRepository(TypeOrmAuditLog);
        const ormLog = repo.create({
          actorId: job.data.actorId,
          method: job.data.method,
          path: job.data.path,
          statusCode: job.data.statusCode,
          ip: job.data.ip,
          userAgent: job.data.userAgent,
          body: job.data.body,
          params: job.data.params,
          query: job.data.query,
        });
        const uri = this.config.get<string>('MONGO_URI') || 'mongodb://localhost:27017';
        const dbName = this.config.get<string>('MONGO_DB') || 'audit';
        const client = new MongoClient(uri);
        await client.connect();
        const collection: Collection = client.db(dbName).collection('audit_log');
        await Promise.all([
          repo.insert(ormLog),
          collection.insertOne({ ...job.data })
        ]);
        await client.close();
      },
      { connection }
    );

    const events = new QueueEvents('audit_log', { connection });
    events.on('failed', ({ jobId, failedReason }) => {
      Logger.error(`AuditLog job ${jobId} failed: ${failedReason}`);
    });
  }
}
