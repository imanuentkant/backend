import { Transaction } from '@core/domain/payment/entity/Transaction';
import { TypeOrmTransaction } from '../entity/payment/TypeOrmTransaction';

export class TransactionMapper {
  public static toDomain(ormEntity: TypeOrmTransaction): Transaction {
    return new Transaction({
      id: ormEntity.id,
      userId: ormEntity.user_id,
      type: ormEntity.type,
      amount: Number(ormEntity.amount),
      currency: ormEntity.currency,
      status: ormEntity.status,
      description: ormEntity.description,
      relatedEntityId: ormEntity.related_entity_id,
      relatedEntityType: ormEntity.related_entity_type,
      metadata: ormEntity.metadata || {},
      date: ormEntity.date,
      createdAt: ormEntity.created_at,
    });
  }

  public static toOrm(domainEntity: Transaction): TypeOrmTransaction {
    const ormEntity = new TypeOrmTransaction();
    ormEntity.id = domainEntity.getId();
    ormEntity.user_id = domainEntity.getUserId();
    ormEntity.type = domainEntity.getType();
    ormEntity.amount = domainEntity.getAmount();
    ormEntity.currency = domainEntity.getCurrency();
    ormEntity.status = domainEntity.getStatus();
    ormEntity.description = domainEntity.getDescription();
    ormEntity.related_entity_id = domainEntity.getRelatedEntityId();
    ormEntity.related_entity_type = domainEntity.getRelatedEntityType();
    ormEntity.metadata = domainEntity.getMetadata();
    ormEntity.date = domainEntity.getDate();
    ormEntity.created_at = domainEntity.getCreatedAt();
    return ormEntity;
  }
}
