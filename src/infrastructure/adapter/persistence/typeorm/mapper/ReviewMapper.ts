import { Review } from '@core/domain/review/entity/Review';
import { TypeOrmReview } from '../entity/review/TypeOrmReview';

export class ReviewMapper {
  
  static toDomain(orm: TypeOrmReview): Review {
    return new Review({
      id: orm.id,
      bookingId: orm.bookingId,
      propertyId: orm.propertyId,
      reviewerId: orm.reviewerId,
      revieweeId: orm.revieweeId,
      ratingOverall: Number(orm.ratingOverall),
      ratingCleanliness: Number(orm.ratingCleanliness),
      ratingAccuracy: Number(orm.ratingAccuracy),
      ratingCheckin: Number(orm.ratingCheckin),
      ratingCommunication: Number(orm.ratingCommunication),
      ratingLocation: Number(orm.ratingLocation),
      ratingValue: Number(orm.ratingValue),
      comment: orm.comment,
      response: orm.response || undefined,
      isPublished: orm.isPublished,
      publishedAt: orm.publishedAt || undefined,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
  
  static toOrm(review: Review): TypeOrmReview {
    const orm = new TypeOrmReview();
    orm.id = review.getId();
    orm.bookingId = review.getBookingId();
    orm.propertyId = review.getPropertyId();
    orm.reviewerId = review.getReviewerId();
    orm.revieweeId = review.getRevieweeId();
    orm.ratingOverall = review.getRatingOverall();
    orm.ratingCleanliness = review.getRatingCleanliness();
    orm.ratingAccuracy = review.getRatingAccuracy();
    orm.ratingCheckin = review.getRatingCheckin();
    orm.ratingCommunication = review.getRatingCommunication();
    orm.ratingLocation = review.getRatingLocation();
    orm.ratingValue = review.getRatingValue();
    orm.comment = review.getComment();
    orm.response = review.getResponse() || null;
    orm.isPublished = review.getIsPublished();
    orm.publishedAt = review.getPublishedAt() || null;
    orm.createdAt = review.getCreatedAt();
    orm.updatedAt = review.getCreatedAt();
    return orm;
  }
}

