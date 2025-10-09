import { UseCase } from '@core/common/usecase/UseCase';
import { Match } from '@core/domain/dating/entity/Match';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';

export interface GetMatchesUseCasePayload {
  customerId: string;
}

export class GetMatchesUseCase implements UseCase<GetMatchesUseCasePayload, Match[]> {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  public async execute(payload: GetMatchesUseCasePayload): Promise<Match[]> {
    return this.matchRepository.findByCustomerId(payload.customerId);
  }
}
