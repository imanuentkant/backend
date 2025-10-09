import { UseCase } from '@core/common/usecase/UseCase';
import { DatingProfile } from '@core/domain/dating/entity/DatingProfile';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
import { BlockedUserRepositoryPort } from '@core/domain/dating/port/BlockedUserRepositoryPort';
import { BoostRepositoryPort } from '@core/domain/dating/port/BoostRepositoryPort';
import { DatingSettingsRepositoryPort } from '@core/domain/dating/port/DatingSettingsRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface GetRecommendedProfilesUseCasePayload {
  customerId: string;
  limit?: number;
}

export class GetRecommendedProfilesUseCase implements UseCase<GetRecommendedProfilesUseCasePayload, DatingProfile[]> {
  constructor(
    private readonly profileRepository: DatingProfileRepositoryPort,
    private readonly swipeRepository: SwipeRepositoryPort,
    private readonly blockedUserRepository: BlockedUserRepositoryPort,
    private readonly boostRepository: BoostRepositoryPort,
    private readonly settingsRepository: DatingSettingsRepositoryPort,
  ) {}

  public async execute(payload: GetRecommendedProfilesUseCasePayload): Promise<DatingProfile[]> {
    // Get customer's profile
    const myProfile = await this.profileRepository.findByCustomerId(payload.customerId);
    
    if (!myProfile) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Dating profile not found. Please create one first.',
      });
    }

    if (!myProfile.isProfileActive()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Your dating profile is not active',
      });
    }

    // Get user's dating settings
    const settings = await this.settingsRepository.findByCustomerId(payload.customerId);
    const maxDistance = settings?.getMaxDistance() || 50;
    const ageMin = settings?.getAgeMin() || 18;
    const ageMax = settings?.getAgeMax() || 99;
    const onlyShowVerified = settings?.getOnlyShowVerified() || false;

    // Get nearby profiles based on location and preferences
    const location = myProfile.getLocation();
    let profiles = await this.profileRepository.findNearbyProfiles({
      customerId: payload.customerId,
      latitude: location.latitude || 0,
      longitude: location.longitude || 0,
      maxDistance,
      gender: myProfile.getInterestedIn().map(g => g.toString()),
      limit: (payload.limit || 20) * 2, // Get more to filter
    });

    // Get blocked users (both ways)
    const blockedByMe = await this.blockedUserRepository.findByBlockerId(payload.customerId);
    const blockedMe = await this.blockedUserRepository.findByBlockedId(payload.customerId);
    const blockedUserIds = new Set([
      ...blockedByMe.map(b => b.getBlockedId()),
      ...blockedMe.map(b => b.getBlockerId()),
    ]);

    // Get already swiped profiles
    const mySwipes = await this.swipeRepository.findLikedProfiles(payload.customerId);
    const swipedProfileIds = new Set(mySwipes.map(s => s.getToProfileId()));

    // Filter profiles
    profiles = profiles.filter(profile => {
      const profileId = profile.getId();
      const customerId = profile.getCustomerId();
      const age = profile.getAge();

      // Exclude blocked users
      if (blockedUserIds.has(customerId)) return false;

      // Exclude already swiped
      if (swipedProfileIds.has(profileId!)) return false;

      // Age filter
      if (age < ageMin || age > ageMax) return false;

      // Verified only filter
      if (onlyShowVerified && !profile.isProfileVerified()) return false;

      return true;
    });

    // Get boosted profiles
    const boostedCustomerIds = await this.boostRepository.findAllActiveBoostedCustomers();
    const boostedProfiles: DatingProfile[] = [];
    const regularProfiles: DatingProfile[] = [];

    profiles.forEach(profile => {
      if (boostedCustomerIds.includes(profile.getCustomerId())) {
        boostedProfiles.push(profile);
      } else {
        regularProfiles.push(profile);
      }
    });

    // Boosted profiles shown first
    const result = [...boostedProfiles, ...regularProfiles];

    // Limit to requested amount
    return result.slice(0, payload.limit || 20);
  }
}
