import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { AsyncPersistCommand } from '@core/common/port/persistence/AsyncPersistencePort';

export const ASYNC_PERSISTENCE_QUEUE = Symbol('ASYNC_PERSISTENCE_QUEUE');

export const AsyncPersistenceQueueProvider: Provider = {
  provide: ASYNC_PERSISTENCE_QUEUE,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Queue<AsyncPersistCommand> => {
    const connection = new IORedis(
      config.get<string>('REDIS_URL') || 'redis://localhost:6380',
      { maxRetriesPerRequest: null as any, enableReadyCheck: false }
    );
    return new Queue<AsyncPersistCommand>('async_persistence', { connection });
  },
};
