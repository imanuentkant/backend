import { UseCase } from '@core/common/usecase/UseCase';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { ReviewRepositoryPort } from '@core/domain/review/port/ReviewRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface CheckReviewEligibilityUseCasePayload {
  bookingId: string;
  userId: string;
}

export interface CheckReviewEligibilityResult {
  canReview: boolean;
  reason: string;
  daysRemaining: number;
}

/**
 * Use Case: Kiểm tra xem user có thể review booking hay không
 */
export class CheckReviewEligibilityUseCase
  implements UseCase<CheckReviewEligibilityUseCasePayload, CheckReviewEligibilityResult>
{
  constructor(
    private readonly bookingRepository: BookingRepositoryPort,
    private readonly reviewRepository: ReviewRepositoryPort,
  ) {}

  public async execute(
    payload: CheckReviewEligibilityUseCasePayload,
  ): Promise<CheckReviewEligibilityResult> {
    // Get booking
    const booking = await this.bookingRepository.findById(payload.bookingId);

    if (!booking) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Booking ${payload.bookingId} not found`,
      });
    }

    // Check if booking belongs to user
    if (booking.getGuestId() !== payload.userId) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'You can only review your own bookings',
      });
    }

    // Check if booking is completed
    if (booking.getStatus() !== 'completed') {
      return {
        canReview: false,
        reason: 'Booking must be completed before you can leave a review',
        daysRemaining: 0,
      };
    }

    // Check if already reviewed
    const existingReview = await this.reviewRepository.findByBookingId(payload.bookingId);
    if (existingReview) {
      return {
        canReview: false,
        reason: 'You have already reviewed this stay',
        daysRemaining: 0,
      };
    }

    // Check review window (14 days after checkout)
    const checkoutDate = booking.getCheckOutDate();
    const now = new Date();
    const daysAfterCheckout = Math.floor(
      (now.getTime() - checkoutDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysRemaining = Math.max(0, 14 - daysAfterCheckout);

    if (daysAfterCheckout > 14) {
      return {
        canReview: false,
        reason: 'Review period has expired (14 days after checkout)',
        daysRemaining: 0,
      };
    }

    return {
      canReview: true,
      reason: 'You can leave a review for this stay',
      daysRemaining,
    };
  }
}
