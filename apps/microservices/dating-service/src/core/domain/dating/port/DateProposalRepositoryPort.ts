import { DateProposal } from '../entity/DateProposal';
import { Nullable } from '@core/common/type/CommonTypes';

export interface DateProposalRepositoryPort {
  save(proposal: DateProposal): Promise<DateProposal>;
  
  findById(id: string): Promise<Nullable<DateProposal>>;
  
  findByMatchId(matchId: string): Promise<DateProposal[]>;
  
  findByCustomerId(customerId: string): Promise<DateProposal[]>;
  
  update(proposal: DateProposal): Promise<DateProposal>;
}
