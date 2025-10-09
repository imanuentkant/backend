import { UserReport } from '@core/domain/dating/entity/UserReport';
import { TypeOrmUserReport } from '../entity/dating/TypeOrmUserReport';

export class UserReportMapper {
  public static toDomain(ormEntity: TypeOrmUserReport): UserReport {
    return new UserReport({
      id: ormEntity.id,
      reporterId: ormEntity.reporter_id,
      reportedId: ormEntity.reported_id,
      reason: ormEntity.reason,
      description: ormEntity.description || undefined,
      status: ormEntity.status,
      reviewedBy: ormEntity.reviewed_by || undefined,
      reviewedAt: ormEntity.reviewed_at || undefined,
      actionTaken: ormEntity.action_taken || undefined,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: UserReport): TypeOrmUserReport {
    const ormEntity = new TypeOrmUserReport();
    ormEntity.id = domainEntity.getId();
    ormEntity.reporter_id = domainEntity.getReporterId();
    ormEntity.reported_id = domainEntity.getReportedId();
    ormEntity.reason = domainEntity.getReason();
    ormEntity.description = domainEntity.getDescription() || null;
    ormEntity.status = domainEntity.getStatus();
    ormEntity.reviewed_by = domainEntity.getReviewedBy() || null;
    ormEntity.reviewed_at = domainEntity.getReviewedAt() || null;
    ormEntity.action_taken = domainEntity.getActionTaken() || null;
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}

