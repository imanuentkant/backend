import { UseCase } from '@core/common/usecase/UseCase';
import { ProfileViewRepositoryPort } from '@core/domain/dating/port/ProfileViewRepositoryPort';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface GetProfileViewStatsUseCasePayload {
  customerId: string;
  isPremium?: boolean; // Premium users can see full viewer list
}

export interface ProfileViewStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  recentViewers?: Array<{
    viewerId: string;
    viewedAt: Date;
  }>;
}

export class GetProfileViewStatsUseCase implements UseCase<GetProfileViewStatsUseCasePayload, ProfileViewStats> {
  constructor(
    private readonly profileViewRepository: ProfileViewRepositoryPort,
    private readonly profileRepository: DatingProfileRepositoryPort,
  ) {}

  public async execute(payload: GetProfileViewStatsUseCasePayload): Promise<ProfileViewStats> {
    // Get user's dating profile
    const profile = await this.profileRepository.findByCustomerId(payload.customerId);
    if (!profile) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Dating profile not found',
      });
    }

    const profileId = profile.getId()!;
    const now = new Date();

    // Calculate date ranges
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get counts
    const [total, today, thisWeek, thisMonth] = await Promise.all([
      this.profileViewRepository.countByProfileId(profileId),
      this.profileViewRepository.countByProfileIdAndDateRange(profileId, todayStart, now),
      this.profileViewRepository.countByProfileIdAndDateRange(profileId, weekStart, now),
      this.profileViewRepository.countByProfileIdAndDateRange(profileId, monthStart, now),
    ]);

    const stats: ProfileViewStats = {
      total,
      today,
      thisWeek,
      thisMonth,
    };

    // Premium users can see who viewed their profile
    if (payload.isPremium) {
      const recentViews = await this.profileViewRepository.getRecentViewers(profileId, 50);
      stats.recentViewers = recentViews.map(v => ({
        viewerId: v.getViewerId(),
        viewedAt: v.getViewedAt(),
      }));
    }

    return stats;
  }
}

