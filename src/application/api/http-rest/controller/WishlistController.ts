import { Controller, Get, Post, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

/**
 * Wishlist Controller - Save favorite properties
 */
@Controller('api/wishlists')
@ApiTags('Wishlists')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  
  /**
   * Add property to wishlist
   */
  @Post('properties/:propertyId')
  @ApiOperation({ summary: 'Thêm property vào wishlist' })
  @ApiResponse({ status: 201, description: 'Added to wishlist' })
  async addToWishlist(@Param('propertyId') propertyId: string, @Req() request: any) {
    return {
      id: UuidGenerator.generate(),
      propertyId,
      userId: request.user.id,
      addedAt: new Date(),
      message: 'Property added to your wishlist',
    };
  }
  
  /**
   * Remove from wishlist
   */
  @Delete('properties/:propertyId')
  @ApiOperation({ summary: 'Xóa khỏi wishlist' })
  @ApiResponse({ status: 200, description: 'Removed from wishlist' })
  async removeFromWishlist(@Param('propertyId') propertyId: string) {
    return {
      propertyId,
      removed: true,
      message: 'Property removed from wishlist',
    };
  }
  
  /**
   * Get user's wishlist
   */
  @Get()
  @ApiOperation({ summary: 'Lấy wishlist của user' })
  @ApiResponse({ status: 200, description: 'Wishlist items' })
  async getWishlist(@Req() request: any) {
    // Mock data
    return {
      data: [
        {
          id: UuidGenerator.generate(),
          property: {
            id: UuidGenerator.generate(),
            title: 'Cozy Apartment',
            location: 'Ho Chi Minh City',
            pricePerNight: 100,
            currency: 'USD',
            coverPhoto: 'https://via.placeholder.com/400x300',
            rating: 4.8,
            reviewCount: 24,
          },
          addedAt: '2025-10-01T10:00:00Z',
        },
        {
          id: UuidGenerator.generate(),
          property: {
            id: UuidGenerator.generate(),
            title: 'Beach Villa',
            location: 'Da Nang',
            pricePerNight: 300,
            currency: 'USD',
            coverPhoto: 'https://via.placeholder.com/400x300',
            rating: 4.9,
            reviewCount: 35,
          },
          addedAt: '2025-09-28T15:30:00Z',
        },
      ],
      meta: {
        total: 2,
      },
    };
  }
  
  /**
   * Check if property in wishlist
   */
  @Get('properties/:propertyId/check')
  @ApiOperation({ summary: 'Check if property in wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist status' })
  async checkWishlist(@Param('propertyId') propertyId: string, @Req() request: any) {
    return {
      propertyId,
      inWishlist: true, // Mock
      addedAt: '2025-10-01T10:00:00Z',
    };
  }
}

