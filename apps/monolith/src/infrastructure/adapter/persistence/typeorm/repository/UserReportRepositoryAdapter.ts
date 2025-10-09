import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReport, ReportStatus } from '@core/domain/dating/entity/UserReport';
import { UserReportRepositoryPort } from '@core/domain/dating/port/UserReportRepositoryPort';
import { TypeOrmUserReport } from '../entity/dating/TypeOrmUserReport';
import { UserReportMapper } from '../mapper/UserReportMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UserReportRepositoryAdapter implements UserReportRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmUserReport)
    private readonly repository: Repository<TypeOrmUserReport>,
  ) {}

  async save(report: UserReport): Promise<UserReport> {
    if (!report.getId()) {
      (report as any).id = uuidv7();
    }

    const ormEntity = UserReportMapper.toOrm(report);
    const saved = await this.repository.save(ormEntity);
    return UserReportMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Nullable<UserReport>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? UserReportMapper.toDomain(ormEntity) : null;
  }

  async findByReported(reportedId: string): Promise<UserReport[]> {
    const ormEntities = await this.repository.find({
      where: { reported_id: reportedId },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map(e => UserReportMapper.toDomain(e));
  }

  async findPendingReports(): Promise<UserReport[]> {
    const ormEntities = await this.repository.find({
      where: { status: ReportStatus.PENDING },
      order: { created_at: 'ASC' },
    });
    return ormEntities.map(e => UserReportMapper.toDomain(e));
  }

  async findByStatus(status: ReportStatus): Promise<UserReport[]> {
    const ormEntities = await this.repository.find({
      where: { status },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map(e => UserReportMapper.toDomain(e));
  }

  async countByReported(reportedId: string): Promise<number> {
    return this.repository.count({
      where: { reported_id: reportedId },
    });
  }

  async update(report: UserReport): Promise<UserReport> {
    const ormEntity = UserReportMapper.toOrm(report);
    const updated = await this.repository.save(ormEntity);
    return UserReportMapper.toDomain(updated);
  }
}

