import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ASYNC_PERSISTENCE_QUEUE } from '@infrastructure/adapter/message/queue/AsyncPersistenceQueue';
import { AsyncPersistCommand, AsyncPersistencePort } from '@core/common/port/persistence/AsyncPersistencePort';

@Injectable()
export class AsyncPersistenceQueueAdapter implements AsyncPersistencePort {
  constructor(@Inject(ASYNC_PERSISTENCE_QUEUE) private readonly queue: Queue<AsyncPersistCommand>) {}
  public async enqueue(command: AsyncPersistCommand): Promise<void> {
    await this.queue.add('persist', command);
  }
  public async enqueueMany(commands: AsyncPersistCommand[]): Promise<void> {
    if (!commands.length) return;
    await this.queue.addBulk(commands.map(cmd => ({ name: 'persist', data: cmd })) as any);
  }
}
