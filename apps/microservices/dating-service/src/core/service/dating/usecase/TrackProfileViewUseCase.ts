import { UseCase } from '@core/common/usecase/UseCase';
import { ProfileView } from '@core/domain/dating/entity/ProfileView';
import { ProfileViewRepositoryPort } from '@core/domain/dating/port/ProfileViewRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface TrackProfileViewUseCasePayload {
  profileId: string;
  viewerId: string;
}

export class TrackProfileViewUseCase implements UseCase<TrackProfileViewUseCasePayload, ProfileView> {
  constructor(
    private readonly profileViewRepository: ProfileViewRepositoryPort,
  ) {}

  public async execute(payload: TrackProfileViewUseCasePayload): Promise<ProfileView> {
    // Prevent self-viewing
    if (payload.profileId === payload.viewerId) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Cannot track self profile view',
      });
    }

    const profileView = new ProfileView({
      profileId: payload.profileId,
      viewerId: payload.viewerId,
    });

    return this.profileViewRepository.save(profileView);
  }
}

