import { UseCase } from '@core/common/usecase/UseCase';
import { DatingProfile } from '@core/domain/dating/entity/DatingProfile';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { SwipeRepositoryPort } from '@core/domain/dating/port/SwipeRepositoryPort';
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

    // Get nearby profiles based on location and preferences
    const location = myProfile.getLocation();
    const profiles = await this.profileRepository.findNearbyProfiles({
      customerId: payload.customerId,
      latitude: location.latitude || 0,
      longitude: location.longitude || 0,
      maxDistance: 50, // 50 km
      gender: myProfile.getInterestedIn().map(g => g.toString()),
      limit: payload.limit || 20,
    });

    // Filter out already swiped profiles
    // TODO: Implement filtering based on existing swipes

    return profiles;
  }
}
