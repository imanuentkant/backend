import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto } from '@application/api/http-rest/dto/review/CreateReviewDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { v4 as uuid } from 'uuid';

/**
 * Review Controller - Airbnb-like review system
 */
@Controller('api/reviews')
@ApiTags('Reviews')
export class ReviewController {
  
  /**
   * Create new review (after completed stay)
   */
  @Post()
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo review cho property' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async createReview(@Body() dto: CreateReviewDto, @Req() request: any) {
    const reviewerId = request.user.id;
    
    // Calculate average
    const average = (
      dto.ratingCleanliness +
      dto.ratingAccuracy +
      dto.ratingCheckin +
      dto.ratingCommunication +
      dto.ratingLocation +
      dto.ratingValue
    ) / 6;
    
    // Mock response
    return {
      id: uuid(),
      bookingId: dto.bookingId,
      reviewerId,
      ratings: {
        overall: dto.ratingOverall,
        cleanliness: dto.ratingCleanliness,
        accuracy: dto.ratingAccuracy,
        checkin: dto.ratingCheckin,
        communication: dto.ratingCommunication,
        location: dto.ratingLocation,
        value: dto.ratingValue,
        average: Math.round(average * 10) / 10,
      },
      comment: dto.comment,
      reviewer: {
        name: request.user.email,
        photo: 'https://via.placeholder.com/150',
      },
      isPublished: false,
      createdAt: new Date(),
      message: 'Review submitted. It will be published after the host also leaves a review or after 14 days.',
    };
  }
  
  /**
   * Get reviews for a property
   */
  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Lấy reviews của property' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  async getPropertyReviews(
    @Param('propertyId') propertyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // Mock data
    const mockReviews = [
      {
        id: uuid(),
        reviewer: {
          name: 'Alice Johnson',
          photo: 'https://via.placeholder.com/150',
          joinedDate: '2023-05-15',
        },
        ratings: {
          overall: 5,
          cleanliness: 5,
          accuracy: 5,
          checkin: 5,
          communication: 5,
          location: 5,
          value: 5,
          average: 5.0,
        },
        comment: 'Absolutely wonderful stay! The apartment was spotlessly clean, exactly as described, and the host was incredibly responsive. The location is perfect - walking distance to everything. Highly recommended!',
        hostResponse: 'Thank you so much Alice! It was a pleasure hosting you. You are welcome back anytime!',
        createdAt: '2025-09-15',
        stayDate: '2025-09-01',
      },
      {
        id: uuid(),
        reviewer: {
          name: 'Bob Smith',
          photo: 'https://via.placeholder.com/150',
          joinedDate: '2022-11-20',
        },
        ratings: {
          overall: 4,
          cleanliness: 5,
          accuracy: 4,
          checkin: 4,
          communication: 5,
          location: 4,
          value: 4,
          average: 4.3,
        },
        comment: 'Great place overall. Very clean and comfortable. Check-in was smooth. Only minor issue was some street noise at night, but manageable with windows closed. Good value for money.',
        createdAt: '2025-08-22',
        stayDate: '2025-08-15',
      },
      {
        id: uuid(),
        reviewer: {
          name: 'Carol Davis',
          photo: 'https://via.placeholder.com/150',
          joinedDate: '2024-01-10',
        },
        ratings: {
          overall: 5,
          cleanliness: 5,
          accuracy: 5,
          checkin: 5,
          communication: 5,
          location: 5,
          value: 5,
          average: 5.0,
        },
        comment: 'Perfect apartment for our family vacation! Kids loved the space and we appreciated the fully equipped kitchen. Host was super helpful with local recommendations. Will definitely stay again!',
        hostResponse: 'So happy you and your family enjoyed the stay! Hope to see you again soon.',
        createdAt: '2025-07-30',
        stayDate: '2025-07-20',
      },
    ];
    
    return {
      data: mockReviews,
      meta: {
        page,
        limit,
        totalItems: 24,
        totalPages: 3,
        hasNextPage: page < 3,
        hasPreviousPage: page > 1,
      },
      summary: {
        overallRating: 4.8,
        totalReviews: 24,
        ratings: {
          cleanliness: 4.9,
          accuracy: 4.7,
          checkin: 4.8,
          communication: 4.9,
          location: 4.8,
          value: 4.7,
        },
        distribution: {
          5: 18,
          4: 5,
          3: 1,
          2: 0,
          1: 0,
        },
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
    // Mock data
    return {
      data: [
        {
          id: uuid(),
          property: {
            id: uuid(),
            title: 'Cozy Apartment',
            location: 'Ho Chi Minh City',
            coverPhoto: 'https://via.placeholder.com/400x300',
          },
          ratings: {
            overall: 5,
            average: 4.8,
          },
          comment: 'Great place!',
          createdAt: '2025-09-15',
        },
      ],
      meta: {
        page: 1,
        total: 1,
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
  async canReview(@Param('bookingId') bookingId: string, @Req() request: any) {
    // Mock logic
    const daysAfterCheckout = 5; // Mock
    const canReview = daysAfterCheckout <= 14;
    
    return {
      bookingId,
      canReview,
      reason: canReview
        ? 'You can leave a review for this stay'
        : 'Review period has expired (14 days after checkout)',
      daysRemaining: Math.max(0, 14 - daysAfterCheckout),
    };
  }
}

