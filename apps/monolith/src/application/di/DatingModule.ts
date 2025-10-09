import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { TypeOrmDatingProfile } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmDatingProfile';
import { TypeOrmSwipe } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmSwipe';
import { TypeOrmMatch } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmMatch';
import { TypeOrmDateProposal } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmDateProposal';
import { TypeOrmBlockedUser } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmBlockedUser';
import { TypeOrmUserReport } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmUserReport';
import { TypeOrmDatingSettings } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmDatingSettings';
import { TypeOrmProfileView } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmProfileView';
import { TypeOrmBoost } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmBoost';
import { TypeOrmSubscription } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmSubscription';

// Repository Adapters
import { DatingProfileRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/DatingProfileRepositoryAdapter';
import { SwipeRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/SwipeRepositoryAdapter';
import { MatchRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/MatchRepositoryAdapter';
import { DateProposalRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/DateProposalRepositoryAdapter';
import { BlockedUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/BlockedUserRepositoryAdapter';
import { UserReportRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/UserReportRepositoryAdapter';
import { DatingSettingsRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/DatingSettingsRepositoryAdapter';
import { ProfileViewRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/ProfileViewRepositoryAdapter';
import { BoostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/BoostRepositoryAdapter';
import { SubscriptionRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/SubscriptionRepositoryAdapter';

// Use Cases
import { CreateDatingProfileUseCase } from '@core/service/dating/usecase/CreateDatingProfileUseCase';
import { SwipeProfileUseCase } from '@core/service/dating/usecase/SwipeProfileUseCase';
import { GetMatchesUseCase } from '@core/service/dating/usecase/GetMatchesUseCase';
import { ProposeDateUseCase } from '@core/service/dating/usecase/ProposeDateUseCase';
import { RespondToDateProposalUseCase } from '@core/service/dating/usecase/RespondToDateProposalUseCase';
import { GetRecommendedProfilesUseCase } from '@core/service/dating/usecase/GetRecommendedProfilesUseCase';
import { BlockUserUseCase } from '@core/service/dating/usecase/BlockUserUseCase';
import { UnblockUserUseCase } from '@core/service/dating/usecase/UnblockUserUseCase';
import { GetBlockedUsersUseCase } from '@core/service/dating/usecase/GetBlockedUsersUseCase';
import { ReportUserUseCase } from '@core/service/dating/usecase/ReportUserUseCase';
import { UpdateDatingSettingsUseCase } from '@core/service/dating/usecase/UpdateDatingSettingsUseCase';
import { GetDatingSettingsUseCase } from '@core/service/dating/usecase/GetDatingSettingsUseCase';
import { GetDateProposalsUseCase } from '@core/service/dating/usecase/GetDateProposalsUseCase';
import { TrackProfileViewUseCase } from '@core/service/dating/usecase/TrackProfileViewUseCase';
import { GetProfileViewStatsUseCase } from '@core/service/dating/usecase/GetProfileViewStatsUseCase';
import { GetReceivedLikesUseCase } from '@core/service/dating/usecase/GetReceivedLikesUseCase';
import { UndoLastSwipeUseCase } from '@core/service/dating/usecase/UndoLastSwipeUseCase';
import { ActivateBoostUseCase } from '@core/service/dating/usecase/ActivateBoostUseCase';
import { GetBoostStatusUseCase } from '@core/service/dating/usecase/GetBoostStatusUseCase';
import { CreateSubscriptionUseCase } from '@core/service/dating/usecase/CreateSubscriptionUseCase';
import { GetSubscriptionStatusUseCase } from '@core/service/dating/usecase/GetSubscriptionStatusUseCase';
import { CancelSubscriptionUseCase } from '@core/service/dating/usecase/CancelSubscriptionUseCase';
import { UpgradeSubscriptionUseCase } from '@core/service/dating/usecase/UpgradeSubscriptionUseCase';
import { CheckSwipeLimitUseCase } from '@core/service/dating/usecase/CheckSwipeLimitUseCase';

// Controller
import { DatingController } from '@application/api/http-rest/controller/DatingController';

const useCaseProviders = [
  {
    provide: CreateDatingProfileUseCase,
    useFactory: (profileRepo: DatingProfileRepositoryAdapter) => {
      return new CreateDatingProfileUseCase(profileRepo);
    },
    inject: [DatingProfileRepositoryAdapter],
  },
  {
    provide: SwipeProfileUseCase,
    useFactory: (
      swipeRepo: SwipeRepositoryAdapter,
      matchRepo: MatchRepositoryAdapter,
      profileRepo: DatingProfileRepositoryAdapter,
      subscriptionRepo: SubscriptionRepositoryAdapter,
    ) => {
      return new SwipeProfileUseCase(swipeRepo, matchRepo, profileRepo, subscriptionRepo);
    },
    inject: [SwipeRepositoryAdapter, MatchRepositoryAdapter, DatingProfileRepositoryAdapter, SubscriptionRepositoryAdapter],
  },
  {
    provide: GetMatchesUseCase,
    useFactory: (matchRepo: MatchRepositoryAdapter) => {
      return new GetMatchesUseCase(matchRepo);
    },
    inject: [MatchRepositoryAdapter],
  },
  {
    provide: ProposeDateUseCase,
    useFactory: (
      proposalRepo: DateProposalRepositoryAdapter,
      matchRepo: MatchRepositoryAdapter,
    ) => {
      return new ProposeDateUseCase(proposalRepo, matchRepo);
    },
    inject: [DateProposalRepositoryAdapter, MatchRepositoryAdapter],
  },
  {
    provide: RespondToDateProposalUseCase,
    useFactory: (proposalRepo: DateProposalRepositoryAdapter) => {
      return new RespondToDateProposalUseCase(proposalRepo);
    },
    inject: [DateProposalRepositoryAdapter],
  },
  {
    provide: GetRecommendedProfilesUseCase,
    useFactory: (
      profileRepo: DatingProfileRepositoryAdapter,
      swipeRepo: SwipeRepositoryAdapter,
      blockedRepo: BlockedUserRepositoryAdapter,
      boostRepo: BoostRepositoryAdapter,
      settingsRepo: DatingSettingsRepositoryAdapter,
    ) => {
      return new GetRecommendedProfilesUseCase(profileRepo, swipeRepo, blockedRepo, boostRepo, settingsRepo);
    },
    inject: [DatingProfileRepositoryAdapter, SwipeRepositoryAdapter, BlockedUserRepositoryAdapter, BoostRepositoryAdapter, DatingSettingsRepositoryAdapter],
  },
  {
    provide: BlockUserUseCase,
    useFactory: (
      blockedRepo: BlockedUserRepositoryAdapter,
      matchRepo: MatchRepositoryAdapter,
    ) => {
      return new BlockUserUseCase(blockedRepo, matchRepo);
    },
    inject: [BlockedUserRepositoryAdapter, MatchRepositoryAdapter],
  },
  {
    provide: UnblockUserUseCase,
    useFactory: (blockedRepo: BlockedUserRepositoryAdapter) => {
      return new UnblockUserUseCase(blockedRepo);
    },
    inject: [BlockedUserRepositoryAdapter],
  },
  {
    provide: GetBlockedUsersUseCase,
    useFactory: (blockedRepo: BlockedUserRepositoryAdapter) => {
      return new GetBlockedUsersUseCase(blockedRepo);
    },
    inject: [BlockedUserRepositoryAdapter],
  },
  {
    provide: ReportUserUseCase,
    useFactory: (reportRepo: UserReportRepositoryAdapter) => {
      return new ReportUserUseCase(reportRepo);
    },
    inject: [UserReportRepositoryAdapter],
  },
  {
    provide: UpdateDatingSettingsUseCase,
    useFactory: (settingsRepo: DatingSettingsRepositoryAdapter) => {
      return new UpdateDatingSettingsUseCase(settingsRepo);
    },
    inject: [DatingSettingsRepositoryAdapter],
  },
  {
    provide: GetDatingSettingsUseCase,
    useFactory: (settingsRepo: DatingSettingsRepositoryAdapter) => {
      return new GetDatingSettingsUseCase(settingsRepo);
    },
    inject: [DatingSettingsRepositoryAdapter],
  },
  {
    provide: GetDateProposalsUseCase,
    useFactory: (proposalRepo: DateProposalRepositoryAdapter) => {
      return new GetDateProposalsUseCase(proposalRepo);
    },
    inject: [DateProposalRepositoryAdapter],
  },
  {
    provide: TrackProfileViewUseCase,
    useFactory: (viewRepo: ProfileViewRepositoryAdapter) => {
      return new TrackProfileViewUseCase(viewRepo);
    },
    inject: [ProfileViewRepositoryAdapter],
  },
  {
    provide: GetProfileViewStatsUseCase,
    useFactory: (
      viewRepo: ProfileViewRepositoryAdapter,
      profileRepo: DatingProfileRepositoryAdapter,
    ) => {
      return new GetProfileViewStatsUseCase(viewRepo, profileRepo);
    },
    inject: [ProfileViewRepositoryAdapter, DatingProfileRepositoryAdapter],
  },
  {
    provide: GetReceivedLikesUseCase,
    useFactory: (
      swipeRepo: SwipeRepositoryAdapter,
      matchRepo: MatchRepositoryAdapter,
      profileRepo: DatingProfileRepositoryAdapter,
    ) => {
      return new GetReceivedLikesUseCase(swipeRepo, matchRepo, profileRepo);
    },
    inject: [SwipeRepositoryAdapter, MatchRepositoryAdapter, DatingProfileRepositoryAdapter],
  },
  {
    provide: UndoLastSwipeUseCase,
    useFactory: (
      swipeRepo: SwipeRepositoryAdapter,
      matchRepo: MatchRepositoryAdapter,
      profileRepo: DatingProfileRepositoryAdapter,
    ) => {
      return new UndoLastSwipeUseCase(swipeRepo, matchRepo, profileRepo);
    },
    inject: [SwipeRepositoryAdapter, MatchRepositoryAdapter, DatingProfileRepositoryAdapter],
  },
  {
    provide: ActivateBoostUseCase,
    useFactory: (
      boostRepo: BoostRepositoryAdapter,
      profileRepo: DatingProfileRepositoryAdapter,
    ) => {
      return new ActivateBoostUseCase(boostRepo, profileRepo);
    },
    inject: [BoostRepositoryAdapter, DatingProfileRepositoryAdapter],
  },
  {
    provide: GetBoostStatusUseCase,
    useFactory: (boostRepo: BoostRepositoryAdapter) => {
      return new GetBoostStatusUseCase(boostRepo);
    },
    inject: [BoostRepositoryAdapter],
  },
  {
    provide: CreateSubscriptionUseCase,
    useFactory: (subscriptionRepo: SubscriptionRepositoryAdapter) => {
      return new CreateSubscriptionUseCase(subscriptionRepo);
    },
    inject: [SubscriptionRepositoryAdapter],
  },
  {
    provide: GetSubscriptionStatusUseCase,
    useFactory: (subscriptionRepo: SubscriptionRepositoryAdapter) => {
      return new GetSubscriptionStatusUseCase(subscriptionRepo);
    },
    inject: [SubscriptionRepositoryAdapter],
  },
  {
    provide: CancelSubscriptionUseCase,
    useFactory: (subscriptionRepo: SubscriptionRepositoryAdapter) => {
      return new CancelSubscriptionUseCase(subscriptionRepo);
    },
    inject: [SubscriptionRepositoryAdapter],
  },
  {
    provide: UpgradeSubscriptionUseCase,
    useFactory: (subscriptionRepo: SubscriptionRepositoryAdapter) => {
      return new UpgradeSubscriptionUseCase(subscriptionRepo);
    },
    inject: [SubscriptionRepositoryAdapter],
  },
  {
    provide: CheckSwipeLimitUseCase,
    useFactory: (
      profileRepo: DatingProfileRepositoryAdapter,
      swipeRepo: SwipeRepositoryAdapter,
      subscriptionRepo: SubscriptionRepositoryAdapter,
    ) => {
      return new CheckSwipeLimitUseCase(profileRepo, swipeRepo, subscriptionRepo);
    },
    inject: [DatingProfileRepositoryAdapter, SwipeRepositoryAdapter, SubscriptionRepositoryAdapter],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeOrmDatingProfile,
      TypeOrmSwipe,
      TypeOrmMatch,
      TypeOrmDateProposal,
      TypeOrmBlockedUser,
      TypeOrmUserReport,
      TypeOrmDatingSettings,
      TypeOrmProfileView,
      TypeOrmBoost,
      TypeOrmSubscription,
    ]),
  ],
  controllers: [DatingController],
  providers: [
    // Repository Adapters
    DatingProfileRepositoryAdapter,
    SwipeRepositoryAdapter,
    MatchRepositoryAdapter,
    DateProposalRepositoryAdapter,
    BlockedUserRepositoryAdapter,
    UserReportRepositoryAdapter,
    DatingSettingsRepositoryAdapter,
    ProfileViewRepositoryAdapter,
    BoostRepositoryAdapter,
    SubscriptionRepositoryAdapter,

    // Use Cases
    ...useCaseProviders,
  ],
  exports: [
    DatingProfileRepositoryAdapter,
    SwipeRepositoryAdapter,
    MatchRepositoryAdapter,
    DateProposalRepositoryAdapter,
  ],
})
export class DatingModule {}
