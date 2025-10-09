import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { Subscription, SubscriptionStatus } from '@core/domain/dating/entity/Subscription';
import { TypeOrmSubscription } from '../entity/dating/TypeOrmSubscription';
import { SubscriptionMapper } from '../mapper/SubscriptionMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class SubscriptionRepositoryAdapter implements SubscriptionRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmSubscription)
    private readonly repository: Repository<TypeOrmSubscription>,
  ) {}

  async save(subscription: Subscription): Promise<Subscription> {
    let ormSub = SubscriptionMapper.toORM(subscription);
    
    if (!ormSub.id) {
      ormSub.id = uuidv7();
    }
    
    ormSub = await this.repository.save(ormSub);
    return SubscriptionMapper.toDomain(ormSub);
  }

  async findById(id: string): Promise<Nullable<Subscription>> {
    const ormSub = await this.repository.findOne({
      where: { id },
    });

    return ormSub ? SubscriptionMapper.toDomain(ormSub) : null;
  }

  async findByCustomerId(customerId: string): Promise<Nullable<Subscription>> {
    const ormSub = await this.repository.findOne({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });

    return ormSub ? SubscriptionMapper.toDomain(ormSub) : null;
  }

  async findActiveByCustomerId(customerId: string): Promise<Nullable<Subscription>> {
    const ormSub = await this.repository.findOne({
      where: {
        customerId,
        status: SubscriptionStatus.ACTIVE,
      },
      order: { createdAt: 'DESC' },
    });

    return ormSub ? SubscriptionMapper.toDomain(ormSub) : null;
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const ormSub = SubscriptionMapper.toORM(subscription);
    const updated = await this.repository.save(ormSub);
    return SubscriptionMapper.toDomain(updated);
  }
}

