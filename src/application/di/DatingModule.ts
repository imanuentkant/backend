import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { TypeOrmDatingProfile } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmDatingProfile';
import { TypeOrmSwipe } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmSwipe';
import { TypeOrmMatch } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmMatch';
import { TypeOrmDateProposal } from '@infrastructure/adapter/persistence/typeorm/entity/dating/TypeOrmDateProposal';

// Repository Adapters
import { DatingProfileRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/DatingProfileRepositoryAdapter';
import { SwipeRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/SwipeRepositoryAdapter';
import { MatchRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/MatchRepositoryAdapter';
import { DateProposalRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/DateProposalRepositoryAdapter';

// Use Cases
import { CreateDatingProfileUseCase } from '@core/service/dating/usecase/CreateDatingProfileUseCase';
import { SwipeProfileUseCase } from '@core/service/dating/usecase/SwipeProfileUseCase';
import { GetMatchesUseCase } from '@core/service/dating/usecase/GetMatchesUseCase';
import { ProposeDateUseCase } from '@core/service/dating/usecase/ProposeDateUseCase';
import { RespondToDateProposalUseCase } from '@core/service/dating/usecase/RespondToDateProposalUseCase';
import { GetRecommendedProfilesUseCase } from '@core/service/dating/usecase/GetRecommendedProfilesUseCase';

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
    ) => {
      return new SwipeProfileUseCase(swipeRepo, matchRepo, profileRepo);
    },
    inject: [SwipeRepositoryAdapter, MatchRepositoryAdapter, DatingProfileRepositoryAdapter],
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
    ) => {
      return new GetRecommendedProfilesUseCase(profileRepo, swipeRepo);
    },
    inject: [DatingProfileRepositoryAdapter, SwipeRepositoryAdapter],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeOrmDatingProfile,
      TypeOrmSwipe,
      TypeOrmMatch,
      TypeOrmDateProposal,
    ]),
  ],
  controllers: [DatingController],
  providers: [
    // Repository Adapters
    DatingProfileRepositoryAdapter,
    SwipeRepositoryAdapter,
    MatchRepositoryAdapter,
    DateProposalRepositoryAdapter,

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
