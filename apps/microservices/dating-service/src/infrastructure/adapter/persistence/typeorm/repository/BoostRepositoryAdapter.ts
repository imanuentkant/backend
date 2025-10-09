import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { BoostRepositoryPort } from '@core/domain/dating/port/BoostRepositoryPort';
import { Boost } from '@core/domain/dating/entity/Boost';
import { TypeOrmBoost } from '../entity/dating/TypeOrmBoost';
import { BoostMapper } from '../mapper/BoostMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class BoostRepositoryAdapter implements BoostRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmBoost)
    private readonly repository: Repository<TypeOrmBoost>,
  ) {}

  async save(boost: Boost): Promise<Boost> {
    let ormBoost = BoostMapper.toORM(boost);
    
    if (!ormBoost.id) {
      ormBoost.id = uuidv7();
    }
    
    ormBoost = await this.repository.save(ormBoost);
    return BoostMapper.toDomain(ormBoost);
  }

  async findById(id: string): Promise<Nullable<Boost>> {
    const ormBoost = await this.repository.findOne({
      where: { id },
    });

    return ormBoost ? BoostMapper.toDomain(ormBoost) : null;
  }

  async findActiveBoostByCustomerId(customerId: string): Promise<Nullable<Boost>> {
    const now = new Date();
    
    const ormBoost = await this.repository.findOne({
      where: {
        customerId,
        isActive: true,
        expiresAt: MoreThan(now),
      },
      order: { startedAt: 'DESC' },
    });

    return ormBoost ? BoostMapper.toDomain(ormBoost) : null;
  }

  async findByCustomerId(customerId: string): Promise<Boost[]> {
    const ormBoosts = await this.repository.find({
      where: { customerId },
      order: { startedAt: 'DESC' },
    });

    return ormBoosts.map(b => BoostMapper.toDomain(b));
  }

  async findAllActiveBoostedCustomers(): Promise<string[]> {
    const now = new Date();
    
    const ormBoosts = await this.repository.find({
      where: {
        isActive: true,
        expiresAt: MoreThan(now),
      },
    });

    return ormBoosts.map(b => b.customerId);
  }

  async update(boost: Boost): Promise<Boost> {
    const ormBoost = BoostMapper.toORM(boost);
    const updated = await this.repository.save(ormBoost);
    return BoostMapper.toDomain(updated);
  }
}

