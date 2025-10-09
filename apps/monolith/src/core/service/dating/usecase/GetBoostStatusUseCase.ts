import { UseCase } from '@core/common/usecase/UseCase';
import { BoostRepositoryPort } from '@core/domain/dating/port/BoostRepositoryPort';

export interface GetBoostStatusUseCasePayload {
  customerId: string;
}

export interface BoostStatus {
  isActive: boolean;
  remainingMinutes: number;
  startedAt?: Date;
  expiresAt?: Date;
}

export class GetBoostStatusUseCase implements UseCase<GetBoostStatusUseCasePayload, BoostStatus> {
  constructor(
    private readonly boostRepository: BoostRepositoryPort,
  ) {}

  public async execute(payload: GetBoostStatusUseCasePayload): Promise<BoostStatus> {
    const boost = await this.boostRepository.findActiveBoostByCustomerId(payload.customerId);

    if (!boost || !boost.isCurrentlyActive()) {
      return {
        isActive: false,
        remainingMinutes: 0,
      };
    }

    return {
      isActive: true,
      remainingMinutes: boost.getRemainingMinutes(),
      startedAt: boost.getStartedAt(),
      expiresAt: boost.getExpiresAt(),
    };
  }
}

