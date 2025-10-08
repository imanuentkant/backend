import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepositoryPort } from '@core/domain/payment/port/TransactionRepositoryPort';
import { Transaction } from '@core/domain/payment/entity/Transaction';
import { TypeOrmTransaction } from '../entity/payment/TypeOrmTransaction';
import { TransactionMapper } from '../mapper/TransactionMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmTransaction)
    private readonly repository: Repository<TypeOrmTransaction>,
  ) {}

  public async save(transaction: Transaction): Promise<Transaction> {
    let id = transaction.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const transactionWithId = new Transaction({
      id,
      userId: transaction.getUserId(),
      type: transaction.getType(),
      amount: transaction.getAmount(),
      currency: transaction.getCurrency(),
      status: transaction.getStatus(),
      description: transaction.getDescription(),
      relatedEntityId: transaction.getRelatedEntityId(),
      relatedEntityType: transaction.getRelatedEntityType(),
      metadata: transaction.getMetadata(),
      date: transaction.getDate(),
      createdAt: transaction.getCreatedAt(),
    });

    const ormEntity = TransactionMapper.toOrm(transactionWithId);
    const saved = await this.repository.save(ormEntity);
    return TransactionMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<Transaction>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? TransactionMapper.toDomain(ormEntity) : null;
  }

  public async findByUserId(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Transaction[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .orderBy('transaction.date', 'DESC');

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }
    if (options?.offset) {
      queryBuilder.skip(options.offset);
    }

    const ormEntities = await queryBuilder.getMany();
    return ormEntities.map((entity) => TransactionMapper.toDomain(entity));
  }

  public async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { user_id: userId } });
  }
}
