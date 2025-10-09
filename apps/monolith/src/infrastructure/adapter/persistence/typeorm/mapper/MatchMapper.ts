import { Match } from '@core/domain/dating/entity/Match';
import { TypeOrmMatch } from '../entity/dating/TypeOrmMatch';

export class MatchMapper {
  public static toDomain(ormEntity: TypeOrmMatch): Match {
    return new Match({
      id: ormEntity.id,
      customer1Id: ormEntity.customer1_id,
      customer2Id: ormEntity.customer2_id,
      profile1Id: ormEntity.profile1_id,
      profile2Id: ormEntity.profile2_id,
      conversationId: ormEntity.conversation_id || undefined,
      matchedAt: ormEntity.matched_at,
      lastInteractionAt: ormEntity.last_interaction_at || undefined,
      isActive: ormEntity.is_active,
      unmatchedBy: ormEntity.unmatched_by || undefined,
      unmatchedAt: ormEntity.unmatched_at || undefined,
    });
  }

  public static toOrm(domainEntity: Match): TypeOrmMatch {
    const ormEntity = new TypeOrmMatch();
    ormEntity.id = domainEntity.getId();
    ormEntity.customer1_id = domainEntity.getCustomer1Id();
    ormEntity.customer2_id = domainEntity.getCustomer2Id();
    ormEntity.profile1_id = domainEntity.getProfile1Id();
    ormEntity.profile2_id = domainEntity.getProfile2Id();
    ormEntity.conversation_id = domainEntity.getConversationId() || null;
    ormEntity.matched_at = domainEntity.getMatchedAt();
    ormEntity.last_interaction_at = domainEntity.getLastInteractionAt() || null;
    ormEntity.is_active = domainEntity.getIsActive();
    ormEntity.unmatched_by = domainEntity.getUnmatchedBy() || null;
    ormEntity.unmatched_at = domainEntity.getUnmatchedAt() || null;
    return ormEntity;
  }
}
