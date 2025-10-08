import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmReview } from '@infrastructure/adapter/persistence/typeorm/entity/review/TypeOrmReview';
import { ReviewRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/ReviewRepositoryAdapter';
import { CreateReviewUseCase } from '@core/service/review/usecase/CreateReviewUseCase';
import { ListPropertyReviewsUseCase } from '@core/service/review/usecase/ListPropertyReviewsUseCase';
import { ListUserReviewsUseCase } from '@core/service/review/usecase/ListUserReviewsUseCase';
import { CheckReviewEligibilityUseCase } from '@core/service/review/usecase/CheckReviewEligibilityUseCase';
import { ReviewController } from '@application/api/http-rest/controller/ReviewController';
import { BookingModule } from './BookingModule';

const reviewRepositoryProvider: Provider = {
  provide: 'ReviewRepositoryPort',
  useClass: ReviewRepositoryAdapter,
};

const createReviewUseCaseProvider: Provider = {
  provide: CreateReviewUseCase,
  useFactory: (reviewRepo: ReviewRepositoryAdapter, bookingRepo: any) => 
    new CreateReviewUseCase(reviewRepo, bookingRepo),
  inject: ['ReviewRepositoryPort', 'BookingRepositoryPort'],
};

const listPropertyReviewsUseCaseProvider: Provider = {
  provide: ListPropertyReviewsUseCase,
  useFactory: (repository: ReviewRepositoryAdapter) => new ListPropertyReviewsUseCase(repository),
  inject: ['ReviewRepositoryPort'],
};

const listUserReviewsUseCaseProvider: Provider = {
  provide: ListUserReviewsUseCase,
  useFactory: (repository: ReviewRepositoryAdapter) => new ListUserReviewsUseCase(repository),
  inject: ['ReviewRepositoryPort'],
};

const checkReviewEligibilityUseCaseProvider: Provider = {
  provide: CheckReviewEligibilityUseCase,
  useFactory: (bookingRepo: any, reviewRepo: ReviewRepositoryAdapter) => 
    new CheckReviewEligibilityUseCase(bookingRepo, reviewRepo),
  inject: ['BookingRepositoryPort', 'ReviewRepositoryPort'],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmReview]),
    BookingModule,
  ],
  controllers: [ReviewController],
  providers: [
    reviewRepositoryProvider,
    createReviewUseCaseProvider,
    listPropertyReviewsUseCaseProvider,
    listUserReviewsUseCaseProvider,
    checkReviewEligibilityUseCaseProvider,
  ],
  exports: [
    'ReviewRepositoryPort',
    CreateReviewUseCase,
    ListPropertyReviewsUseCase,
    ListUserReviewsUseCase,
    CheckReviewEligibilityUseCase,
  ],
})
export class ReviewModule {}

