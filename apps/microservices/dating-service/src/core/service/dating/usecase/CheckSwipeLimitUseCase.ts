import { UseCase } from '@core/common/usecase/UseCase';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
import { SubscriptionRepositoryPort } from '@core/domain/dating/port/SubscriptionRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface CheckSwipeLimitUseCasePayload {
  customerId: string;
}

export interface CheckSwipeLimitUseCaseResult {
  canSwipe: boolean;
  isPremium: boolean;
  remainingSwipes: number;
  dailyLimit: number;
  swipesUsedToday: number;
  resetAt: Date;
}

const FREE_DAILY_LIMIT = 50;

export class CheckSwipeLimitUseCase implements UseCase<CheckSwipeLimitUseCasePayload, CheckSwipeLimitUseCaseResult> {
  constructor(
    private readonly profileRepository: DatingProfileRepositoryPort,
    private readonly swipeRepository: SwipeRepositoryPort,
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
  ) {}

  public async execute(payload: CheckSwipeLimitUseCasePayload): Promise<CheckSwipeLimitUseCaseResult> {
    const profile = await this.profileRepository.findByCustomerId(payload.customerId);

    if (!profile) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Dating profile not found',
      });
    }

    // Check subscription status
    const subscription = await this.subscriptionRepository.findActiveByCustomerId(payload.customerId);
    const isPremium = subscription?.isPremium() || false;

    // Calculate reset time (midnight tonight)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Premium users have unlimited swipes
    if (isPremium) {
      return {
        canSwipe: true,
        isPremium: true,
        remainingSwipes: -1, // Unlimited
        dailyLimit: -1,
        swipesUsedToday: 0,
        resetAt: tomorrow,
      };
    }

    // Count today's swipes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all swipes by customer
    const allSwipes = await this.swipeRepository.findLikedProfiles(payload.customerId);
    
    // Filter swipes from today
    const todaySwipes = allSwipes.filter(swipe => {
      const swipeDate = swipe.getCreatedAt();
      return swipeDate >= today;
    });

    const swipeCount = todaySwipes.length;
    const remaining = Math.max(0, FREE_DAILY_LIMIT - swipeCount);

    return {
      canSwipe: swipeCount < FREE_DAILY_LIMIT,
      isPremium: false,
      remainingSwipes: remaining,
      dailyLimit: FREE_DAILY_LIMIT,
      swipesUsedToday: swipeCount,
      resetAt: tomorrow,
    };
  }
}
