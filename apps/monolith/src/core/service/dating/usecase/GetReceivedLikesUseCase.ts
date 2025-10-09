import { UseCase } from '@core/common/usecase/UseCase';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { DatingProfile } from '@core/domain/dating/entity/DatingProfile';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface GetReceivedLikesUseCasePayload {
  customerId: string;
  isPremium?: boolean; // Premium users see full profiles
}

export interface ReceivedLikesResult {
  count: number;
  profiles?: DatingProfile[]; // Only for premium users
}

export class GetReceivedLikesUseCase implements UseCase<GetReceivedLikesUseCasePayload, ReceivedLikesResult> {
  constructor(
    private readonly swipeRepository: SwipeRepositoryPort,
    private readonly matchRepository: MatchRepositoryPort,
    private readonly profileRepository: DatingProfileRepositoryPort,
  ) {}

  public async execute(payload: GetReceivedLikesUseCasePayload): Promise<ReceivedLikesResult> {
    // Get user's profile
    const userProfile = await this.profileRepository.findByCustomerId(payload.customerId);
    if (!userProfile) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Dating profile not found',
      });
    }

    const userProfileId = userProfile.getId()!;

    // Get all swipes where user was liked
    const receivedSwipes = await this.swipeRepository.findByTargetProfileId(userProfileId);

    // Filter only "like" and "super_like" actions
    const likes = receivedSwipes.filter(swipe => 
      swipe.getAction() === 'like' || swipe.getAction() === 'super_like'
    );

    // Get all user's matches to exclude already matched profiles
    const userMatches = await this.matchRepository.findByCustomerId(payload.customerId);
    const matchedProfileIds = new Set<string>();
    
    userMatches.forEach(match => {
      const otherProfileId = match.getOtherCustomerId(payload.customerId);
      matchedProfileIds.add(otherProfileId);
    });

    // Filter out already matched profiles
    const unmatchedLikes = likes.filter(like => 
      !matchedProfileIds.has(like.getFromCustomerId())
    );

    const result: ReceivedLikesResult = {
      count: unmatchedLikes.length,
    };

    // Premium users can see full profiles
    if (payload.isPremium && unmatchedLikes.length > 0) {
      const likerIds = unmatchedLikes.map(like => like.getFromCustomerId());
      const profiles: DatingProfile[] = [];

      for (const likerId of likerIds) {
        const profile = await this.profileRepository.findByCustomerId(likerId);
        if (profile) {
          profiles.push(profile);
        }
      }

      result.profiles = profiles;
    }

    return result;
  }
}

