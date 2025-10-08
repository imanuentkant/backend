import { UseCase } from '@core/common/usecase/UseCase';
import { Transaction } from '@core/domain/payment/entity/Transaction';
import { TransactionRepositoryPort } from '@core/domain/payment/port/TransactionRepositoryPort';

export interface GetTransactionHistoryUseCasePayload {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetTransactionHistoryUseCaseResult {
  data: Transaction[];
  total: number;
}

/**
 * Use Case: Lấy lịch sử transactions của user
 */
export class GetTransactionHistoryUseCase
  implements UseCase<GetTransactionHistoryUseCasePayload, GetTransactionHistoryUseCaseResult>
{
  constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

  public async execute(
    payload: GetTransactionHistoryUseCasePayload,
  ): Promise<GetTransactionHistoryUseCaseResult> {
    const [transactions, total] = await Promise.all([
      this.transactionRepository.findByUserId(payload.userId, {
        limit: payload.limit || 20,
        offset: payload.offset || 0,
      }),
      this.transactionRepository.countByUserId(payload.userId),
    ]);

    return {
      data: transactions,
      total,
    };
  }
}
