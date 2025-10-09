import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { AsyncPersistCommand } from '@core/common/port/persistence/AsyncPersistencePort';
import { DataSource } from 'typeorm';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/TypeOrmUser';
import { TypeOrmPost } from '@infrastructure/adapter/persistence/typeorm/entity/post/TypeOrmPost';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/TypeOrmMedia';
import { TypeOrmPostMedia } from '@infrastructure/adapter/persistence/typeorm/entity/post-media/TypeOrmPostMedia';

@Injectable()
export class AsyncPersistenceWorker {
  private worker: Worker<AsyncPersistCommand>;
  constructor(private readonly config: ConfigService, private readonly dataSource: DataSource) {
    const connection = new IORedis(this.config.get<string>('REDIS_URL') || 'redis://localhost:6380', {
      maxRetriesPerRequest: null as any,
      enableReadyCheck: false,
    });

    this.worker = new Worker<AsyncPersistCommand>(
      'async_persistence',
      async job => {
        const { entity, action, payload } = job.data;
        try {
          switch (entity) {
            case 'user': {
              const repo = this.dataSource.getRepository(TypeOrmUser);
              if (action === 'create') await repo.insert(payload);
              else if (action === 'update') await repo.update(payload.id, payload);
              else if (action === 'delete') await repo.delete(payload.id);
              break;
            }
            case 'post': {
              const repo = this.dataSource.getRepository(TypeOrmPost);
              if (action === 'create') await repo.insert(payload);
              else if (action === 'update') await repo.update(payload.id, payload);
              else if (action === 'delete') await repo.delete(payload.id);
              break;
            }
            case 'media': {
              const repo = this.dataSource.getRepository(TypeOrmMedia);
              if (action === 'create') await repo.insert(payload);
              else if (action === 'update') await repo.update(payload.id, payload);
              else if (action === 'delete') await repo.delete(payload.id);
              break;
            }
            case 'post_media': {
              const repo = this.dataSource.getRepository(TypeOrmPostMedia);
              if (action === 'create') await repo.insert(payload);
              else if (action === 'update') {
                // update order by array of {mediaId, sortOrder}
                if (payload.mediaOrders && Array.isArray(payload.mediaOrders)) {
                  for (const item of payload.mediaOrders) {
                    await repo.update({ postId: payload.postId, mediaId: item.mediaId }, { sortOrder: item.sortOrder });
                  }
                }
              } else if (action === 'delete') {
                await repo.delete({ postId: payload.postId, mediaId: payload.mediaId });
              }
              break;
            }
            default:
              break;
          }
        } catch (e) {
          Logger.error(`Async persistence failed for ${entity}:${action} ${payload?.id || ''}`);
          throw e;
        }
      },
      { connection }
    );

    const events = new QueueEvents('async_persistence', { connection });
    events.on('failed', ({ jobId, failedReason }) => {
      Logger.error(`AsyncPersist job ${jobId} failed: ${failedReason}`);
    });
  }
}
