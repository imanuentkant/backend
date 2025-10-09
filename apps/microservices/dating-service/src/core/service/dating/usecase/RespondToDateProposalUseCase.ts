import { UseCase } from '@core/common/usecase/UseCase';
import { DateProposal } from '@core/domain/dating/entity/DateProposal';
import { DateProposalRepositoryPort } from '@core/domain/dating/port/DateProposalRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface RespondToDateProposalUseCasePayload {
  proposalId: string;
  customerId: string;
  accept: boolean;
  message?: string;
}

export class RespondToDateProposalUseCase implements UseCase<RespondToDateProposalUseCasePayload, DateProposal> {
  constructor(private readonly proposalRepository: DateProposalRepositoryPort) {}

  public async execute(payload: RespondToDateProposalUseCasePayload): Promise<DateProposal> {
    const proposal = await this.proposalRepository.findById(payload.proposalId);

    if (!proposal) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Date proposal not found',
      });
    }

    if (proposal.getProposedTo() !== payload.customerId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You cannot respond to this proposal',
      });
    }

    if (!proposal.isPending()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'This proposal has already been responded to',
      });
    }

    if (payload.accept) {
      proposal.accept(payload.message);
    } else {
      proposal.decline(payload.message);
    }

    return this.proposalRepository.update(proposal);
  }
}
