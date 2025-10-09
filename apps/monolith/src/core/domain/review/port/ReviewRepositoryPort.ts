import { Review } from '../entity/Review';
import { Optional } from '@core/common/type/CommonTypes';

export interface ReviewRepositoryPort {
  findById(id: string): Promise<Optional<Review>>;
  findByPropertyId(propertyId: string, onlyPublished?: boolean): Promise<Review[]>;
  findByReviewerId(reviewerId: string): Promise<Review[]>;
  findByBookingId(bookingId: string): Promise<Optional<Review>>;
  save(review: Review): Promise<Review>;
  delete(id: string): Promise<boolean>;
  getAverageRating(propertyId: string): Promise<number>;
  getRatingBreakdown(propertyId: string): Promise<{
    cleanliness: number;
    accuracy: number;
    checkin: number;
    communication: number;
    location: number;
    value: number;
  }>;
  countByProperty(propertyId: string, onlyPublished?: boolean): Promise<number>;
}

