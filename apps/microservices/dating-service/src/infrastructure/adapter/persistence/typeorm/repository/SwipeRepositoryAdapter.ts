import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swipe, SwipeAction } from '@core/domain/dating/entity/Swipe';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
import { TypeOrmSwipe } from '../entity/dating/TypeOrmSwipe';
import { SwipeMapper } from '../mapper/SwipeMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class SwipeRepositoryAdapter implements SwipeRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmSwipe)
    private readonly repository: Repository<TypeOrmSwipe>,
  ) {}

  async save(swipe: Swipe): Promise<Swipe> {
    if (!swipe.getId()) {
      (swipe as any).id = uuidv7();
    }
    
    const ormEntity = SwipeMapper.toOrm(swipe);
    const saved = await this.repository.save(ormEntity);
    return SwipeMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Nullable<Swipe>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? SwipeMapper.toDomain(ormEntity) : null;
  }

  async findByCustomers(fromCustomerId: string, toProfileId: string): Promise<Nullable<Swipe>> {
    const ormEntity = await this.repository.findOne({
      where: {
        from_customer_id: fromCustomerId,
        to_profile_id: toProfileId,
      },
    });
    return ormEntity ? SwipeMapper.toDomain(ormEntity) : null;
  }

  async findLikedProfiles(customerId: string): Promise<Swipe[]> {
    const ormEntities = await this.repository.find({
      where: {
        from_customer_id: customerId,
        action: SwipeAction.LIKE,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return ormEntities.map(e => SwipeMapper.toDomain(e));
  }

  async checkMutualLike(customer1Id: string, customer2Id: string): Promise<boolean> {
    // Check if customer2 has liked customer1's profile
    const reverseSwipe = await this.repository
      .createQueryBuilder('swipe')
      .innerJoin('dating_profiles', 'profile', 'swipe.to_profile_id = profile.id')
      .where('swipe.from_customer_id = :customer2Id', { customer2Id })
      .andWhere('profile.customer_id = :customer1Id', { customer1Id })
      .andWhere('swipe.action = :action', { action: SwipeAction.LIKE })
      .getOne();

    return !!reverseSwipe;
  }

  async findByTargetProfileId(targetProfileId: string): Promise<Swipe[]> {
    const ormEntities = await this.repository.find({
      where: {
        to_profile_id: targetProfileId,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return ormEntities.map(e => SwipeMapper.toDomain(e));
  }

  async findLastSwipeByCustomer(customerId: string): Promise<Nullable<Swipe>> {
    const ormEntity = await this.repository.findOne({
      where: {
        from_customer_id: customerId,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return ormEntity ? SwipeMapper.toDomain(ormEntity) : null;
  }

  async delete(swipe: Swipe): Promise<void> {
    const swipeId = swipe.getId();
    if (swipeId) {
      await this.repository.delete(swipeId);
    }
  }
}
