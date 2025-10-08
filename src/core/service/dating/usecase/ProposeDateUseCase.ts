import { UseCase } from '@core/common/usecase/UseCase';
import { DateProposal } from '@core/domain/dating/entity/DateProposal';
import { DateProposalRepositoryPort } from '@core/domain/dating/port/DateProposalRepositoryPort';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface ProposeDateUseCasePayload {
  matchId: string;
  customerId: string;
  proposedDate: Date;
  location: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  activity: string;
  notes?: string;
}

export class ProposeDateUseCase implements UseCase<ProposeDateUseCasePayload, DateProposal> {
  constructor(
    private readonly proposalRepository: DateProposalRepositoryPort,
    private readonly matchRepository: MatchRepositoryPort,
  ) {}

  public async execute(payload: ProposeDateUseCasePayload): Promise<DateProposal> {
    // Verify match exists
    const match = await this.matchRepository.findById(payload.matchId);
    if (!match) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Match not found',
      });
    }

    if (!match.isMatchFor(payload.customerId)) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You are not part of this match',
      });
    }

    if (!match.getIsActive()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'This match is no longer active',
      });
    }

    const otherCustomerId = match.getOtherCustomerId(payload.customerId);

    const proposal = new DateProposal({
      matchId: payload.matchId,
      proposedBy: payload.customerId,
      proposedTo: otherCustomerId,
      proposedDate: payload.proposedDate,
      location: payload.location,
      activity: payload.activity,
      notes: payload.notes,
    });

    return this.proposalRepository.save(proposal);
  }
}
