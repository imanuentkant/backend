import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateProposal } from '@core/domain/dating/entity/DateProposal';
import { DateProposalRepositoryPort } from '@core/domain/dating/port/DateProposalRepositoryPort';
import { TypeOrmDateProposal } from '../entity/dating/TypeOrmDateProposal';
import { DateProposalMapper } from '../mapper/DateProposalMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DateProposalRepositoryAdapter implements DateProposalRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmDateProposal)
    private readonly repository: Repository<TypeOrmDateProposal>,
  ) {}

  async save(proposal: DateProposal): Promise<DateProposal> {
    if (!proposal.getId()) {
      (proposal as any).id = uuidv7();
    }
    
    const ormEntity = DateProposalMapper.toOrm(proposal);
    const saved = await this.repository.save(ormEntity);
    return DateProposalMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Nullable<DateProposal>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? DateProposalMapper.toDomain(ormEntity) : null;
  }

  async findByMatchId(matchId: string): Promise<DateProposal[]> {
    const ormEntities = await this.repository.find({
      where: { match_id: matchId },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map(e => DateProposalMapper.toDomain(e));
  }

  async findByCustomerId(customerId: string): Promise<DateProposal[]> {
    const ormEntities = await this.repository
      .createQueryBuilder('proposal')
      .where('proposal.proposed_by = :customerId OR proposal.proposed_to = :customerId', { customerId })
      .orderBy('proposal.created_at', 'DESC')
      .getMany();

    return ormEntities.map(e => DateProposalMapper.toDomain(e));
  }

  async update(proposal: DateProposal): Promise<DateProposal> {
    const ormEntity = DateProposalMapper.toOrm(proposal);
    const updated = await this.repository.save(ormEntity);
    return DateProposalMapper.toDomain(updated);
  }
}
