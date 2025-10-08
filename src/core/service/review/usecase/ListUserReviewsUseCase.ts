import { UseCase } from '@core/common/usecase/UseCase';
import { Review } from '@core/domain/review/entity/Review';
import { ReviewRepositoryPort } from '@core/domain/review/port/ReviewRepositoryPort';

export interface ListUserReviewsUseCasePayload {
  userId: string;
}

/**
 * Use Case: Lấy danh sách reviews mà user đã viết
 */
export class ListUserReviewsUseCase implements UseCase<ListUserReviewsUseCasePayload, Review[]> {
  constructor(private readonly reviewRepository: ReviewRepositoryPort) {}

  public async execute(payload: ListUserReviewsUseCasePayload): Promise<Review[]> {
    // TODO: Implement findByUserId in repository
    // For now return empty array
    return [];
  }
}
