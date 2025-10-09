import { UseCase } from '@core/common/usecase/UseCase';
import { Review } from '@core/domain/review/entity/Review';
import { ReviewRepositoryPort } from '@core/domain/review/port/ReviewRepositoryPort';

export type ListPropertyReviewsUseCasePayload = {
  propertyId: string;
  onlyPublished?: boolean;
};

export class ListPropertyReviewsUseCase implements UseCase<ListPropertyReviewsUseCasePayload, Review[]> {
  
  constructor(private readonly reviewRepository: ReviewRepositoryPort) {}
  
  async execute(payload: ListPropertyReviewsUseCasePayload): Promise<Review[]> {
    return this.reviewRepository.findByPropertyId(
      payload.propertyId,
      payload.onlyPublished !== false // Default true
    );
  }
}

