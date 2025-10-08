import { Review } from '@core/domain/review/entity/Review';
import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';

export interface ReviewRepositoryPort {
  
  /**
   * Tìm review theo ID
   */
  findById(id: string): Promise<Review | null>;
  
  /**
   * Tìm tất cả reviews với options
   */
  findAll(options?: RepositoryFindOptions): Promise<Review[]>;
  
  /**
   * Tìm reviews của một property
   */
  findByPropertyId(propertyId: string, options?: RepositoryFindOptions): Promise<Review[]>;
  
  /**
   * Tìm reviews của một user (as reviewer - guest)
   */
  findByReviewerId(reviewerId: string, options?: RepositoryFindOptions): Promise<Review[]>;
  
  /**
   * Tìm reviews của một user (as reviewee - host)
   */
  findByRevieweeId(revieweeId: string, options?: RepositoryFindOptions): Promise<Review[]>;
  
  /**
   * Tìm review cho một booking cụ thể
   */
  findByBookingId(bookingId: string): Promise<Review | null>;
  
  /**
   * Tính average rating của property
   */
  calculatePropertyAverageRating(propertyId: string): Promise<{
    overall: number;
    cleanliness: number;
    accuracy: number;
    checkin: number;
    communication: number;
    location: number;
    value: number;
    count: number;
  }>;
  
  /**
   * Lưu review
   */
  save(review: Review): Promise<Review>;
  
  /**
   * Count tổng số reviews
   */
  count(filters?: any): Promise<number>;
}

