import { UseCase } from '@core/common/usecase/UseCase';
import { Swipe, SwipeAction } from '@core/domain/dating/entity/Swipe';
import { Match } from '@core/domain/dating/entity/Match';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Nullable } from '@core/common/type/CommonTypes';

export interface SwipeProfileUseCasePayload {
  customerId: string;
  targetProfileId: string;
  action: SwipeAction;
  isSuperLike?: boolean;
}

export interface SwipeProfileUseCaseResult {
  swipe: Swipe;
  isMatch: boolean;
  match?: Match;
}

export class SwipeProfileUseCase implements UseCase<SwipeProfileUseCasePayload, SwipeProfileUseCaseResult> {
  constructor(
    private readonly swipeRepository: SwipeRepositoryPort,
    private readonly matchRepository: MatchRepositoryPort,
    private readonly profileRepository: DatingProfileRepositoryPort,
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
  ) {}

  public async execute(payload: SwipeProfileUseCasePayload): Promise<SwipeProfileUseCaseResult> {
    // Check swipe limit (free users only)
    const subscription = await this.subscriptionRepository.findActiveByCustomerId(payload.customerId);
    const isPremium = subscription?.isPremium() || false;

    if (!isPremium) {
      // Count today's swipes for free users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const allSwipes = await this.swipeRepository.findLikedProfiles(payload.customerId);
      const todaySwipes = allSwipes.filter(swipe => swipe.getCreatedAt() >= today);
      
      const FREE_DAILY_LIMIT = 50;
      if (todaySwipes.length >= FREE_DAILY_LIMIT) {
        throw Exception.new({
          code: Code.BAD_REQUEST_ERROR,
          overrideMessage: `Daily swipe limit reached (${FREE_DAILY_LIMIT} swipes). Upgrade to Premium for unlimited swipes!`,
        });
      }
    }

    // Verify target profile exists
    const targetProfile = await this.profileRepository.findById(payload.targetProfileId);
    if (!targetProfile) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Profile not found',
      });
    }

    // Check if already swiped
    const existingSwipe = await this.swipeRepository.findByCustomers(
      payload.customerId,
      payload.targetProfileId,
    );
    if (existingSwipe) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Already swiped on this profile',
      });
    }

    // Create swipe
    const swipe = new Swipe({
      fromCustomerId: payload.customerId,
      toProfileId: payload.targetProfileId,
      action: payload.action,
      isSuperLike: payload.isSuperLike,
    });

    const savedSwipe = await this.swipeRepository.save(swipe);

    // Check for mutual like (match)
    if (savedSwipe.isLike()) {
      const isMutualLike = await this.swipeRepository.checkMutualLike(
        payload.customerId,
        targetProfile.getCustomerId(),
      );

      if (isMutualLike) {
        // Create match
        const match = new Match({
          customer1Id: payload.customerId,
          customer2Id: targetProfile.getCustomerId(),
          profile1Id: payload.targetProfileId, // Note: needs own profile ID
          profile2Id: targetProfile.getId(),
        });

        const savedMatch = await this.matchRepository.save(match);

        return {
          swipe: savedSwipe,
          isMatch: true,
          match: savedMatch,
        };
      }
    }

    return {
      swipe: savedSwipe,
      isMatch: false,
    };
  }
}
