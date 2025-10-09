import { UseCase } from '@core/common/usecase/UseCase';
import { Payout } from '@core/domain/payment/entity/Payout';
import { PayoutRepositoryPort } from '@core/domain/payment/port/PayoutRepositoryPort';

export interface GetHostPayoutsUseCasePayload {
  hostId: string;
  limit?: number;
  offset?: number;
}

export interface GetHostPayoutsUseCaseResult {
  data: Payout[];
  summary: {
    totalEarnings: number;
    pendingPayouts: number;
    availableForPayout: number;
    nextPayoutDate: string | null;
  };
}

/**
 * Use Case: Lấy danh sách payouts và summary cho host
 */
export class GetHostPayoutsUseCase
  implements UseCase<GetHostPayoutsUseCasePayload, GetHostPayoutsUseCaseResult>
{
  constructor(private readonly payoutRepository: PayoutRepositoryPort) {}

  public async execute(
    payload: GetHostPayoutsUseCasePayload,
  ): Promise<GetHostPayoutsUseCaseResult> {
    const [payouts, totalEarnings, pendingPayouts, availableForPayout] = await Promise.all([
      this.payoutRepository.findByHostId(payload.hostId, {
        limit: payload.limit || 20,
        offset: payload.offset || 0,
      }),
      this.payoutRepository.getTotalEarnings(payload.hostId),
      this.payoutRepository.getPendingPayouts(payload.hostId),
      this.payoutRepository.getAvailableForPayout(payload.hostId),
    ]);

    // Tính next payout date (thường là 15 ngày sau booking hoàn thành)
    const nextPayoutDate = this.calculateNextPayoutDate(payouts);

    return {
      data: payouts,
      summary: {
        totalEarnings,
        pendingPayouts,
        availableForPayout,
        nextPayoutDate,
      },
    };
  }

  private calculateNextPayoutDate(payouts: Payout[]): string | null {
    const pendingPayout = payouts.find(
      (p) => p.getExpectedArrivalDate() && new Date(p.getExpectedArrivalDate()!) > new Date(),
    );

    if (!pendingPayout || !pendingPayout.getExpectedArrivalDate()) {
      return null;
    }

    return pendingPayout.getExpectedArrivalDate()!.toISOString().split('T')[0];
  }
}
