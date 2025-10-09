import { UserReport, ReportStatus } from '../entity/UserReport';
import { Nullable } from '@core/common/type/CommonTypes';

export interface UserReportRepositoryPort {
  save(report: UserReport): Promise<UserReport>;
  
  findById(id: string): Promise<Nullable<UserReport>>;
  
  findByReported(reportedId: string): Promise<UserReport[]>;
  
  findPendingReports(): Promise<UserReport[]>;
  
  findByStatus(status: ReportStatus): Promise<UserReport[]>;
  
  countByReported(reportedId: string): Promise<number>;
  
  update(report: UserReport): Promise<UserReport>;
}
