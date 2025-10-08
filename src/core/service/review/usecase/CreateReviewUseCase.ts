import { UseCase } from '@core/common/usecase/UseCase';
import { Review } from '@core/domain/review/entity/Review';
import { ReviewRepositoryPort } from '@core/domain/review/port/ReviewRepositoryPort';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type CreateReviewUseCasePayload = {
  bookingId: string;
  reviewerId: string;
  ratingOverall: number;
  ratingCleanliness: number;
  ratingAccuracy: number;
  ratingCheckin: number;
  ratingCommunication: number;
  ratingLocation: number;
  ratingValue: number;
  comment: string;
};

export class CreateReviewUseCase implements UseCase<CreateReviewUseCasePayload, Review> {
  
  constructor(
    private readonly reviewRepository: ReviewRepositoryPort,
    private readonly bookingRepository: BookingRepositoryPort,
  ) {}
  
  async execute(payload: CreateReviewUseCasePayload): Promise<Review> {
    // Validate booking exists
    const booking = await this.bookingRepository.findById(payload.bookingId);
    if (!booking) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Booking with id ${payload.bookingId} not found`,
      });
    }
    
    // Validate booking is completed
    if (booking.getStatus() !== 'completed') {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Can only review completed bookings',
      });
    }
    
    // Check if review already exists
    const existingReview = await this.reviewRepository.findByBookingId(payload.bookingId);
    if (existingReview) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Review already exists for this booking',
      });
    }
    
    // Validate reviewer is the guest
    if (booking.getGuestId() !== payload.reviewerId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'Only the guest can review this booking',
      });
    }
    
    // Create review
    const review = new Review({
      id: UuidGenerator.generate(),
      bookingId: payload.bookingId,
      propertyId: booking.getPropertyId(),
      reviewerId: payload.reviewerId,
      revieweeId: 'host-id', // TODO: Get from property
      ratingOverall: payload.ratingOverall,
      ratingCleanliness: payload.ratingCleanliness,
      ratingAccuracy: payload.ratingAccuracy,
      ratingCheckin: payload.ratingCheckin,
      ratingCommunication: payload.ratingCommunication,
      ratingLocation: payload.ratingLocation,
      ratingValue: payload.ratingValue,
      comment: payload.comment,
      isPublished: false, // Pending moderation
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return await this.reviewRepository.save(review);
  }
}

