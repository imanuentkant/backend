import { UseCase } from '@core/common/usecase/UseCase';
import { UserReport, ReportReason } from '@core/domain/dating/entity/UserReport';
import { UserReportRepositoryPort } from '@core/domain/dating/port/UserReportRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface ReportUserUseCasePayload {
  reporterId: string;
  reportedId: string;
  reason: ReportReason;
  description?: string;
}

export class ReportUserUseCase implements UseCase<ReportUserUseCasePayload, UserReport> {
  constructor(
    private readonly reportRepository: UserReportRepositoryPort,
  ) {}

  public async execute(payload: ReportUserUseCasePayload): Promise<UserReport> {
    if (payload.reporterId === payload.reportedId) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Cannot report yourself',
      });
    }

    const report = new UserReport({
      reporterId: payload.reporterId,
      reportedId: payload.reportedId,
      reason: payload.reason,
      description: payload.description,
    });

    return this.reportRepository.save(report);
  }
}

