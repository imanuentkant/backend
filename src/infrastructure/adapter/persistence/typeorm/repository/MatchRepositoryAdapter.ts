import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '@core/domain/dating/entity/Match';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';
import { TypeOrmMatch } from '../entity/dating/TypeOrmMatch';
import { MatchMapper } from '../mapper/MatchMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class MatchRepositoryAdapter implements MatchRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmMatch)
    private readonly repository: Repository<TypeOrmMatch>,
  ) {}

  async save(match: Match): Promise<Match> {
    if (!match.getId()) {
      (match as any).id = uuidv7();
    }
    
    const ormEntity = MatchMapper.toOrm(match);
    const saved = await this.repository.save(ormEntity);
    return MatchMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Nullable<Match>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? MatchMapper.toDomain(ormEntity) : null;
  }

  async findByCustomers(customer1Id: string, customer2Id: string): Promise<Nullable<Match>> {
    const ormEntity = await this.repository
      .createQueryBuilder('match')
      .where(
        '(match.customer1_id = :customer1Id AND match.customer2_id = :customer2Id) OR ' +
        '(match.customer1_id = :customer2Id AND match.customer2_id = :customer1Id)',
        { customer1Id, customer2Id }
      )
      .getOne();

    return ormEntity ? MatchMapper.toDomain(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Match[]> {
    const ormEntities = await this.repository
      .createQueryBuilder('match')
      .where('match.customer1_id = :customerId OR match.customer2_id = :customerId', { customerId })
      .andWhere('match.is_active = :isActive', { isActive: true })
      .orderBy('match.matched_at', 'DESC')
      .getMany();

    return ormEntities.map(e => MatchMapper.toDomain(e));
  }

  async update(match: Match): Promise<Match> {
    const ormEntity = MatchMapper.toOrm(match);
    const updated = await this.repository.save(ormEntity);
    return MatchMapper.toDomain(updated);
  }
}
