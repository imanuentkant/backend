import { Controller, Get, Post, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { AddToWishlistUseCase } from '@core/service/wishlist/usecase/AddToWishlistUseCase';
import { RemoveFromWishlistUseCase } from '@core/service/wishlist/usecase/RemoveFromWishlistUseCase';
import { GetWishlistUseCase } from '@core/service/wishlist/usecase/GetWishlistUseCase';
import { CheckWishlistUseCase } from '@core/service/wishlist/usecase/CheckWishlistUseCase';
import { GetPropertyUseCase } from '@core/service/property/usecase/GetPropertyUseCase';
import {
  AddToWishlistResponseDto,
  RemoveFromWishlistResponseDto,
  GetWishlistResponseDto,
  CheckWishlistResponseDto,
} from '@application/api/http-rest/dto/wishlist/WishlistResponseDto';
import { Request } from 'express';

/**
 * Wishlist Controller - Save favorite properties/vehicles
 */
@Controller('api/wishlists')
@ApiTags('Wishlists')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(
    private addToWishlistUseCase: AddToWishlistUseCase,
    private removeFromWishlistUseCase: RemoveFromWishlistUseCase,
    private getWishlistUseCase: GetWishlistUseCase,
    private checkWishlistUseCase: CheckWishlistUseCase,
    private getPropertyUseCase: GetPropertyUseCase,
  ) {}
  
  /**
   * Add property to wishlist
   */
  @Post('properties/:propertyId')
  @ApiOperation({ summary: 'Thêm property vào wishlist' })
  @ApiResponse({ status: 201, description: 'Added to wishlist', type: AddToWishlistResponseDto })
  async addToWishlist(
    @Param('propertyId') propertyId: string,
    @Req() request: Request,
  ): Promise<AddToWishlistResponseDto> {
    const userId = (request as any).user.id;

    const item = await this.addToWishlistUseCase.execute({
      userId,
      bookableType: 'property',
      bookableId: propertyId,
    });

    return {
      id: item.getId(),
      bookableId: propertyId,
      bookableType: 'property',
      userId,
      addedAt: item.getAddedAt(),
      message: 'Property added to your wishlist',
    };
  }
  
  /**
   * Remove from wishlist
   */
  @Delete('properties/:propertyId')
  @ApiOperation({ summary: 'Xóa khỏi wishlist' })
  @ApiResponse({ status: 200, description: 'Removed from wishlist', type: RemoveFromWishlistResponseDto })
  async removeFromWishlist(
    @Param('propertyId') propertyId: string,
    @Req() request: Request,
  ): Promise<RemoveFromWishlistResponseDto> {
    const userId = (request as any).user.id;

    await this.removeFromWishlistUseCase.execute({
      userId,
      bookableType: 'property',
      bookableId: propertyId,
    });

    return {
      bookableId: propertyId,
      removed: true,
      message: 'Property removed from wishlist',
    };
  }
  
  /**
   * Get user's wishlist
   */
  @Get()
  @ApiOperation({ summary: 'Lấy wishlist của user' })
  @ApiResponse({ status: 200, description: 'Wishlist items', type: GetWishlistResponseDto })
  async getWishlist(@Req() request: Request): Promise<GetWishlistResponseDto> {
    const userId = (request as any).user.id;

    const items = await this.getWishlistUseCase.execute({ userId });

    // Fetch property/vehicle details for each item
    const dataWithDetails = await Promise.all(
      items.map(async (item) => {
        let bookableDetails = null;
        
        if (item.getBookableType() === 'property') {
          try {
            const property = await this.getPropertyUseCase.execute({
              id: item.getBookableId(),
            });
            bookableDetails = {
              id: property.getId(),
              title: property.getTitle(),
              location: property.getLocation(),
              pricePerNight: property.getPricePerNight(),
              currency: property.getCurrency(),
              coverPhoto: property.getCoverPhotoId(),
              // TODO: Add rating and reviewCount from reviews
            };
          } catch (error) {
            // Property không tồn tại hoặc đã bị xóa
            bookableDetails = null;
          }
        }
        // TODO: Handle vehicle type similarly

        return {
          id: item.getId(),
          bookableType: item.getBookableType(),
          bookableId: item.getBookableId(),
          bookable: bookableDetails,
          addedAt: item.getAddedAt().toISOString(),
        };
      }),
    );

    return {
      data: dataWithDetails,
      meta: {
        total: items.length,
      },
    };
  }
  
  /**
   * Check if property in wishlist
   */
  @Get('properties/:propertyId/check')
  @ApiOperation({ summary: 'Check if property in wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist status', type: CheckWishlistResponseDto })
  async checkWishlist(
    @Param('propertyId') propertyId: string,
    @Req() request: Request,
  ): Promise<CheckWishlistResponseDto> {
    const userId = (request as any).user.id;

    const result = await this.checkWishlistUseCase.execute({
      userId,
      bookableType: 'property',
      bookableId: propertyId,
    });

    return {
      bookableId: propertyId,
      inWishlist: result.inWishlist,
      addedAt: result.item?.getAddedAt().toISOString(),
    };
  }
}

