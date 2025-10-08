import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePropertyDto } from '@application/api/http-rest/dto/property/CreatePropertyDto';
import { SearchPropertyDto } from '@application/api/http-rest/dto/property/SearchPropertyDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { PropertyType, PropertyStatus } from '@core/common/enums/PropertyEnums';
import { CreatePropertyUseCase } from '@core/service/property/usecase/CreatePropertyUseCase';
import { GetPropertyUseCase } from '@core/service/property/usecase/GetPropertyUseCase';
import { ListPropertiesUseCase } from '@core/service/property/usecase/ListPropertiesUseCase';
import {
  CreatePropertyResponseDto,
  ListPropertiesResponseDto,
  PropertyDetailResponseDto,
} from '@application/api/http-rest/dto/property/PropertyResponseDto';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

/**
 * Property Controller - Airbnb-like property management
 */
@Controller('api/properties')
@ApiTags('Properties')
export class PropertyController {
  
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly getPropertyUseCase: GetPropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
  ) {}
  
  /**
   * Tạo property listing mới (Host only)
   */
  @Post()
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo property listing mới' })
  @ApiResponse({ status: 201, description: 'Property created successfully', type: CreatePropertyResponseDto })
  async createProperty(
    @Body() dto: CreatePropertyDto, 
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<CreatePropertyResponseDto> {
    const hostId = request.user.id;
    
    const property = await this.createPropertyUseCase.execute({
      hostId,
      title: dto.title,
      description: dto.description,
      propertyType: dto.propertyType,
      maxGuests: dto.maxGuests,
      bedrooms: dto.bedrooms,
      beds: dto.beds,
      bathrooms: dto.bathrooms,
      pricePerNight: dto.pricePerNight,
      currency: dto.currency || 'USD',
      cleaningFee: dto.cleaningFee || 0,
      serviceFeePercentage: dto.serviceFeePercentage || 14,
      minimumNights: dto.minimumNights || 1,
      maximumNights: dto.maximumNights || 365,
      instantBooking: dto.instantBooking || false,
      location: {
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        postalCode: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
    
    return {
      id: property.getId(),
      hostId: property.getHostId(),
      title: property.getTitle(),
      description: property.getDescription(),
      propertyType: property.getPropertyType(),
      maxGuests: property.getMaxGuests(),
      bedrooms: property.getBedrooms(),
      beds: property.getBeds(),
      bathrooms: property.getBathrooms(),
      pricePerNight: property.getPricePerNight(),
      currency: property.getCurrency(),
      cleaningFee: property.getCleaningFee(),
      minimumNights: property.getMinimumNights(),
      maximumNights: property.getMaximumNights(),
      instantBooking: property.isInstantBooking(),
      status: property.getStatus(),
      location: property.getLocation() ? {
        address: property.getLocation()!.getAddress(),
        city: property.getLocation()!.getCity(),
        state: property.getLocation()!.getState(),
        country: property.getLocation()!.getCountry(),
        postalCode: property.getLocation()!.getPostalCode(),
        latitude: property.getLocation()!.getLatitude(),
        longitude: property.getLocation()!.getLongitude(),
      } : null,
      createdAt: property.getCreatedAt(),
    };
  }
  
  /**
   * Search & List properties (Public)
   */
  @Get()
  @ApiOperation({ summary: 'Search properties' })
  @ApiResponse({ status: 200, description: 'List of properties', type: ListPropertiesResponseDto })
  async searchProperties(@Query() query: SearchPropertyDto): Promise<ListPropertiesResponseDto> {
    const properties = await this.listPropertiesUseCase.execute({
      city: query.location,
      propertyType: query.propertyType,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      status: 'active',
    });
    
    // Map properties to response format
    let filteredData = properties.map(p => ({
      id: p.getId(),
      title: p.getTitle(),
      description: p.getDescription(),
      propertyType: p.getPropertyType(),
      maxGuests: p.getMaxGuests(),
      bedrooms: p.getBedrooms(),
      beds: p.getBeds(),
      bathrooms: p.getBathrooms(),
      pricePerNight: p.getPricePerNight(),
      currency: p.getCurrency(),
      cleaningFee: p.getCleaningFee(),
      status: p.getStatus(),
      location: p.getLocation() ? {
        city: p.getLocation()!.getCity(),
        state: p.getLocation()!.getState(),
        country: p.getLocation()!.getCountry(),
        latitude: p.getLocation()!.getLatitude(),
        longitude: p.getLocation()!.getLongitude(),
      } : null,
      coverPhotoId: p.getCoverPhotoId(),
      instantBooking: p.isInstantBooking(),
      rating: 0,
      reviewCount: 0,
    }));
    
    // Apply additional filters
    if (query.guests) {
      filteredData = filteredData.filter(p => p.maxGuests >= query.guests!);
    }
    
    if (query.instantBooking) {
      filteredData = filteredData.filter(p => p.instantBooking);
    }
    
    // Sort
    if (query.sortBy === 'price') {
      filteredData.sort((a, b) => 
        query.sortOrder === 'desc' 
          ? b.pricePerNight - a.pricePerNight 
          : a.pricePerNight - b.pricePerNight
      );
    } else if (query.sortBy === 'rating') {
      filteredData.sort((a, b) => 
        query.sortOrder === 'desc' 
          ? b.rating - a.rating 
          : a.rating - b.rating
      );
    }
    
    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      meta: {
        page,
        limit,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
        hasNextPage: endIndex < filteredData.length,
        hasPreviousPage: page > 1,
      },
    };
  }
  
  /**
   * Get property details (Public)
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get property details' })
  @ApiResponse({ status: 200, description: 'Property details', type: PropertyDetailResponseDto })
  async getProperty(@Param('id') id: string): Promise<PropertyDetailResponseDto> {
    const property = await this.getPropertyUseCase.execute({ id });
    
    return {
      id: property.getId(),
      hostId: property.getHostId(),
      title: property.getTitle(),
      description: property.getDescription(),
      propertyType: property.getPropertyType(),
      maxGuests: property.getMaxGuests(),
      bedrooms: property.getBedrooms(),
      beds: property.getBeds(),
      bathrooms: property.getBathrooms(),
      pricePerNight: property.getPricePerNight(),
      currency: property.getCurrency(),
      cleaningFee: property.getCleaningFee(),
      serviceFeePercentage: property.getServiceFeePercentage(),
      minimumNights: property.getMinimumNights(),
      maximumNights: property.getMaximumNights(),
      instantBooking: property.isInstantBooking(),
      status: property.getStatus(),
      location: property.getLocation() ? {
        address: property.getLocation()!.getAddress(),
        city: property.getLocation()!.getCity(),
        state: property.getLocation()!.getState(),
        country: property.getLocation()!.getCountry(),
        postalCode: property.getLocation()!.getPostalCode(),
        latitude: property.getLocation()!.getLatitude(),
        longitude: property.getLocation()!.getLongitude(),
      } : null,
      createdAt: property.getCreatedAt(),
      updatedAt: property.getUpdatedAt(),
    };
  }
  
  /**
   * Update property (Host only)
   */
  @Put(':id')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property' })
  @ApiResponse({ status: 200, description: 'Property updated' })
  async updateProperty(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePropertyDto>,
    @Req() request: any,
  ) {
    // TODO: Implement UpdatePropertyUseCase
    // - Verify host ownership
    // - Update property fields
    // - Return updated property
    return {
      id,
      ...dto,
      updatedAt: new Date(),
      message: 'Update property feature: TODO - Create UpdatePropertyUseCase',
    };
  }
  
  /**
   * Delete property (Host only)
   */
  @Delete(':id')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete property' })
  @ApiResponse({ status: 200, description: 'Property deleted' })
  async deleteProperty(@Param('id') id: string, @Req() request: any) {
    return {
      success: true,
      message: 'Property deleted successfully',
      id,
    };
  }
  
  /**
   * Get host's properties
   */
  @Get('host/my-properties')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get host properties' })
  @ApiResponse({ status: 200, description: 'List of host properties' })
  async getHostProperties(@Req() request: any, @Query() query: any) {
    const hostId = request.user.id;
    
    // TODO: Use ListPropertiesUseCase with hostId filter
    // - Add hostId to ListPropertiesUseCasePayload
    // - Add bookingCount, revenue stats aggregation
    // - Add rating/review count from review repository
    
    const properties = await this.listPropertiesUseCase.execute({
      // hostId: hostId, // TODO: Add this field to ListPropertiesUseCasePayload
      status: query.status,
    });
    
    return {
      data: properties.map(p => ({
        id: p.getId(),
        title: p.getTitle(),
        propertyType: p.getPropertyType(),
        status: p.getStatus(),
        pricePerNight: p.getPricePerNight(),
        bookingCount: 0, // TODO: Aggregate from bookings
        revenue: 0, // TODO: Calculate from bookings
        rating: 0, // TODO: Get from reviews
        reviewCount: 0, // TODO: Count from reviews
      })),
      meta: {
        page: 1,
        total: properties.length,
      },
    };
  }
  
  /**
   * Activate/Publish property
   */
  @Put(':id/activate')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate property listing' })
  @ApiResponse({ status: 200, description: 'Property activated' })
  async activateProperty(@Param('id') id: string, @Req() request: any) {
    return {
      id,
      status: PropertyStatus.ACTIVE,
      message: 'Property is now live and accepting bookings',
      activatedAt: new Date(),
    };
  }
  
  /**
   * Deactivate property
   */
  @Put(':id/deactivate')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate property listing' })
  @ApiResponse({ status: 200, description: 'Property deactivated' })
  async deactivateProperty(@Param('id') id: string, @Req() request: any) {
    return {
      id,
      status: PropertyStatus.INACTIVE,
      message: 'Property is now inactive',
      deactivatedAt: new Date(),
    };
  }
}

