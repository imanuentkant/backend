import { UseCase } from '@core/common/usecase/UseCase';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface UndoLastSwipeUseCasePayload {
  customerId: string;
  isPremium?: boolean; // Premium: 10/day, Free: 1/day (validation can be added later)
}

export class UndoLastSwipeUseCase implements UseCase<UndoLastSwipeUseCasePayload, { success: boolean; message: string }> {
  constructor(
    private readonly swipeRepository: SwipeRepositoryPort,
    private readonly matchRepository: MatchRepositoryPort,
    private readonly profileRepository: DatingProfileRepositoryPort,
  ) {}

  public async execute(payload: UndoLastSwipeUseCasePayload): Promise<{ success: boolean; message: string }> {
    // Get last swipe
    const lastSwipe = await this.swipeRepository.findLastSwipeByCustomer(payload.customerId);

    if (!lastSwipe) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'No swipes to undo',
      });
    }

    // Check if swipe was a like and resulted in a match
    if (lastSwipe.isLike()) {
      // Get the target profile's customer ID
      const targetProfile = await this.profileRepository.findById(lastSwipe.getToProfileId());
      
      if (targetProfile) {
        const targetCustomerId = targetProfile.getCustomerId();
        
        // Check if there's a match
        const match = await this.matchRepository.findByCustomers(
          payload.customerId,
          targetCustomerId,
        );

        // Delete match if exists
        if (match) {
          await this.matchRepository.delete(match);
        }
      }
    }

    // Delete the swipe
    await this.swipeRepository.delete(lastSwipe);

    return {
      success: true,
      message: 'Last swipe undone successfully',
    };
  }
}

