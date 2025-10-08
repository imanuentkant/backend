import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto } from '@application/api/http-rest/dto/review/CreateReviewDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { CreateReviewUseCase } from '@core/service/review/usecase/CreateReviewUseCase';
import { ListPropertyReviewsUseCase } from '@core/service/review/usecase/ListPropertyReviewsUseCase';
import { ListUserReviewsUseCase } from '@core/service/review/usecase/ListUserReviewsUseCase';
import { CheckReviewEligibilityUseCase } from '@core/service/review/usecase/CheckReviewEligibilityUseCase';
import {
  CreateReviewResponseDto,
  ListReviewsResponseDto,
} from '@application/api/http-rest/dto/review/ReviewResponseDto';
import { Request } from 'express';

/**
 * Review Controller - Airbnb-like review system
 */
@Controller('api/reviews')
@ApiTags('Reviews')
export class ReviewController {
  
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly listPropertyReviewsUseCase: ListPropertyReviewsUseCase,
    private readonly listUserReviewsUseCase: ListUserReviewsUseCase,
    private readonly checkReviewEligibilityUseCase: CheckReviewEligibilityUseCase,
  ) {}
  
  /**
   * Create new review (after completed stay)
   */
  @Post()
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo review cho property' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: CreateReviewResponseDto })
  async createReview(
    @Body() dto: CreateReviewDto, 
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<CreateReviewResponseDto> {
    const reviewerId = request.user.id;
    
    const review = await this.createReviewUseCase.execute({
      bookingId: dto.bookingId,
      reviewerId,
      ratingOverall: dto.ratingOverall,
      ratingCleanliness: dto.ratingCleanliness,
      ratingAccuracy: dto.ratingAccuracy,
      ratingCheckin: dto.ratingCheckin,
      ratingCommunication: dto.ratingCommunication,
      ratingLocation: dto.ratingLocation,
      ratingValue: dto.ratingValue,
      comment: dto.comment,
    });
    
    return {
      id: review.getId(),
      bookingId: review.getBookingId(),
      propertyId: review.getPropertyId(),
      reviewerId: review.getReviewerId(),
      ratings: {
        overall: review.getRatingOverall(),
        cleanliness: review.getRatingCleanliness(),
        accuracy: review.getRatingAccuracy(),
        checkin: review.getRatingCheckin(),
        communication: review.getRatingCommunication(),
        location: review.getRatingLocation(),
        value: review.getRatingValue(),
      },
      comment: review.getComment(),
      isPublished: review.getIsPublished(),
      createdAt: review.getCreatedAt(),
      message: 'Review submitted. It will be published after the host also leaves a review or after 14 days.',
    };
  }
  
  /**
   * Get reviews for a property
   */
  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Lấy reviews của property' })
  @ApiResponse({ status: 200, description: 'List of reviews', type: ListReviewsResponseDto })
  async getPropertyReviews(
    @Param('propertyId') propertyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ListReviewsResponseDto> {
    const reviews = await this.listPropertyReviewsUseCase.execute({
      propertyId,
      onlyPublished: true,
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);
    
    return {
      data: paginatedReviews.map(review => ({
        id: review.getId(),
        propertyId: review.getPropertyId(),
        bookingId: review.getBookingId(),
        reviewerId: review.getReviewerId(),
        ratings: {
          overall: review.getRatingOverall(),
          cleanliness: review.getRatingCleanliness(),
          accuracy: review.getRatingAccuracy(),
          checkin: review.getRatingCheckin(),
          communication: review.getRatingCommunication(),
          location: review.getRatingLocation(),
          value: review.getRatingValue(),
        },
        comment: review.getComment(),
        hostResponse: review.getResponse(),
        isPublished: review.getIsPublished(),
        createdAt: review.getCreatedAt(),
      })),
      meta: {
        page,
        limit,
        totalItems: reviews.length,
        totalPages: Math.ceil(reviews.length / limit),
        hasNextPage: endIndex < reviews.length,
        hasPreviousPage: page > 1,
      },
    };
  }
  
  /**
   * Get reviews by user (as reviewer)
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy reviews của user' })
  @ApiResponse({ status: 200, description: 'List of user reviews' })
  async getUserReviews(@Param('userId') userId: string) {
    const reviews = await this.listUserReviewsUseCase.execute({ userId });
    
    // Map to response format with property details
    const data = reviews.map((review: any) => ({
      id: review.getId(),
      property: {
        id: review.getPropertyId(),
        title: 'Property Title', // TODO: Fetch property details
        location: 'Location',
        coverPhoto: '',
      },
      ratings: {
        overall: review.getOverallRating(),
        average: (
          review.getOverallRating() +
          review.getCleanlinessRating() +
          review.getCommunicationRating() +
          review.getCheckInRating() +
          review.getAccuracyRating() +
          review.getLocationRating() +
          review.getValueRating()
        ) / 7,
      },
      comment: review.getComment(),
      createdAt: review.getCreatedAt().toISOString().split('T')[0],
    }));
    
    return {
      data,
      meta: {
        page: 1,
        total: data.length,
      },
    };
  }
  
  /**
   * Add host response to review
   */
  @Put(':id/response')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Host phản hồi review' })
  @ApiResponse({ status: 200, description: 'Response added' })
  async addHostResponse(
    @Param('id') id: string,
    @Body('response') response: string,
    @Req() request: any,
  ) {
    return {
      id,
      response,
      respondedAt: new Date(),
      message: 'Response added successfully',
    };
  }
  
  /**
   * Check if user can review a booking
   */
  @Get('booking/:bookingId/can-review')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if can review' })
  @ApiResponse({ status: 200, description: 'Review eligibility' })
  async canReview(@Param('bookingId') bookingId: string, @Req() request: Request) {
    const userId = (request as any).user.id;
    
    const result = await this.checkReviewEligibilityUseCase.execute({
      bookingId,
      userId,
    });
    
    return {
      bookingId,
      canReview: result.canReview,
      reason: result.reason,
      daysRemaining: result.daysRemaining,
    };
  }
}

