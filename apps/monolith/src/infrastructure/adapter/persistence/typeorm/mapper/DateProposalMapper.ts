import { DateProposal } from '@core/domain/dating/entity/DateProposal';
import { TypeOrmDateProposal } from '../entity/dating/TypeOrmDateProposal';

export class DateProposalMapper {
  public static toDomain(ormEntity: TypeOrmDateProposal): DateProposal {
    return new DateProposal({
      id: ormEntity.id,
      matchId: ormEntity.match_id,
      proposedBy: ormEntity.proposed_by,
      proposedTo: ormEntity.proposed_to,
      proposedDate: ormEntity.proposed_date,
      location: ormEntity.location,
      activity: ormEntity.activity,
      notes: ormEntity.notes || undefined,
      status: ormEntity.status,
      respondedAt: ormEntity.responded_at || undefined,
      responseMessage: ormEntity.response_message || undefined,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: DateProposal): TypeOrmDateProposal {
    const ormEntity = new TypeOrmDateProposal();
    ormEntity.id = domainEntity.getId();
    ormEntity.match_id = domainEntity.getMatchId();
    ormEntity.proposed_by = domainEntity.getProposedBy();
    ormEntity.proposed_to = domainEntity.getProposedTo();
    ormEntity.proposed_date = domainEntity.getProposedDate();
    ormEntity.location = domainEntity.getLocation();
    ormEntity.activity = domainEntity.getActivity();
    ormEntity.notes = domainEntity.getNotes() || null;
    ormEntity.status = domainEntity.getStatus();
    ormEntity.responded_at = domainEntity.getRespondedAt() || null;
    ormEntity.response_message = domainEntity.getResponseMessage() || null;
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}
