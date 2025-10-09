import { UseCase } from '@core/common/usecase/UseCase';
import { DateProposal } from '@core/domain/dating/entity/DateProposal';
import { DateProposalRepositoryPort } from '@core/domain/dating/port/DateProposalRepositoryPort';

export interface GetDateProposalsUseCasePayload {
  customerId: string;
  type?: 'sent' | 'received' | 'all'; // Filter by proposal type
}

export class GetDateProposalsUseCase implements UseCase<GetDateProposalsUseCasePayload, DateProposal[]> {
  constructor(
    private readonly proposalRepository: DateProposalRepositoryPort,
  ) {}

  public async execute(payload: GetDateProposalsUseCasePayload): Promise<DateProposal[]> {
    const proposals = await this.proposalRepository.findByCustomerId(payload.customerId);

    // Filter based on type if specified
    if (payload.type === 'sent') {
      return proposals.filter(p => p.getProposedBy() === payload.customerId);
    }

    if (payload.type === 'received') {
      return proposals.filter(p => p.getProposedTo() === payload.customerId);
    }

    // Return all proposals (sent + received)
    return proposals;
  }
}

