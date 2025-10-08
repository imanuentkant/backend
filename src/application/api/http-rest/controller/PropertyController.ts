import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePropertyDto } from '@application/api/http-rest/dto/property/CreatePropertyDto';
import { SearchPropertyDto } from '@application/api/http-rest/dto/property/SearchPropertyDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { PropertyType, PropertyStatus } from '@core/common/enums/PropertyEnums';
import { v4 as uuid } from 'uuid';

/**
 * Property Controller - Airbnb-like property management
 */
@Controller('api/properties')
@ApiTags('Properties')
export class PropertyController {
  
  /**
   * Tạo property listing mới (Host only)
   */
  @Post()
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo property listing mới' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  async createProperty(@Body() dto: CreatePropertyDto, @Req() request: any) {
    const hostId = request.user.id;
    
    // Mock response - sẽ thay bằng use case sau
    return {
      id: uuid(),
      hostId,
      title: dto.title,
      description: dto.description,
      propertyType: dto.propertyType,
      maxGuests: dto.maxGuests,
      bedrooms: dto.bedrooms,
      beds: dto.beds,
      bathrooms: dto.bathrooms,
      pricePerNight: dto.pricePerNight,
      currency: 'USD',
      cleaningFee: dto.cleaningFee || 0,
      minimumNights: dto.minimumNights || 1,
      maximumNights: dto.maximumNights || 365,
      instantBooking: dto.instantBooking || false,
      status: PropertyStatus.DRAFT,
      location: {
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        postalCode: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      amenities: [],
      photos: [],
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Search & List properties (Public)
   */
  @Get()
  @ApiOperation({ summary: 'Search properties' })
  @ApiResponse({ status: 200, description: 'List of properties' })
  async searchProperties(@Query() query: SearchPropertyDto) {
    // Mock data - sẽ thay bằng search use case sau
    const mockProperties = [
      {
        id: uuid(),
        title: 'Cozy Apartment in City Center',
        description: 'Beautiful modern apartment with stunning city views. Perfect for couples or small families. Walking distance to major attractions.',
        propertyType: PropertyType.APARTMENT,
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        pricePerNight: 100,
        currency: 'USD',
        cleaningFee: 20,
        status: PropertyStatus.ACTIVE,
        location: {
          city: 'Ho Chi Minh City',
          state: 'Ho Chi Minh',
          country: 'Vietnam',
          latitude: 10.8231,
          longitude: 106.6297,
        },
        amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'Washing Machine'],
        coverPhoto: 'https://via.placeholder.com/800x600',
        rating: 4.8,
        reviewCount: 24,
        instantBooking: true,
      },
      {
        id: uuid(),
        title: 'Luxury Villa with Private Pool',
        description: 'Stunning villa with private pool and garden. 5 minutes from beach. Perfect for families and groups.',
        propertyType: PropertyType.VILLA,
        maxGuests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 3,
        pricePerNight: 300,
        currency: 'USD',
        cleaningFee: 50,
        status: PropertyStatus.ACTIVE,
        location: {
          city: 'Da Nang',
          state: 'Da Nang',
          country: 'Vietnam',
          latitude: 16.0544,
          longitude: 108.2022,
        },
        amenities: ['WiFi', 'Kitchen', 'Pool', 'Garden', 'BBQ', 'Parking'],
        coverPhoto: 'https://via.placeholder.com/800x600',
        rating: 4.9,
        reviewCount: 42,
        instantBooking: false,
      },
      {
        id: uuid(),
        title: 'Charming House near Beach',
        description: 'Comfortable house with sea view. 2 minutes walk to the beach. Ideal for beach lovers.',
        propertyType: PropertyType.HOUSE,
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        pricePerNight: 150,
        currency: 'USD',
        cleaningFee: 30,
        status: PropertyStatus.ACTIVE,
        location: {
          city: 'Nha Trang',
          state: 'Khanh Hoa',
          country: 'Vietnam',
          latitude: 12.2388,
          longitude: 109.1967,
        },
        amenities: ['WiFi', 'Kitchen', 'Beach Access', 'Balcony', 'Air Conditioning'],
        coverPhoto: 'https://via.placeholder.com/800x600',
        rating: 4.7,
        reviewCount: 18,
        instantBooking: true,
      },
    ];
    
    // Apply filters (mock)
    let filtered = [...mockProperties];
    
    if (query.propertyType) {
      filtered = filtered.filter(p => p.propertyType === query.propertyType);
    }
    
    if (query.minPrice) {
      filtered = filtered.filter(p => p.pricePerNight >= query.minPrice!);
    }
    
    if (query.maxPrice) {
      filtered = filtered.filter(p => p.pricePerNight <= query.maxPrice!);
    }
    
    if (query.guests) {
      filtered = filtered.filter(p => p.maxGuests >= query.guests!);
    }
    
    if (query.instantBooking) {
      filtered = filtered.filter(p => p.instantBooking);
    }
    
    // Sort
    if (query.sortBy === 'price') {
      filtered.sort((a, b) => 
        query.sortOrder === 'desc' 
          ? b.pricePerNight - a.pricePerNight 
          : a.pricePerNight - b.pricePerNight
      );
    } else if (query.sortBy === 'rating') {
      filtered.sort((a, b) => 
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
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      meta: {
        page,
        limit,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNextPage: endIndex < filtered.length,
        hasPreviousPage: page > 1,
      },
    };
  }
  
  /**
   * Get property details (Public)
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get property details' })
  @ApiResponse({ status: 200, description: 'Property details' })
  async getProperty(@Param('id') id: string) {
    // Mock response
    return {
      id,
      title: 'Cozy Apartment in City Center',
      description: 'Beautiful modern apartment with stunning city views. Perfect for couples or small families. Walking distance to major attractions, restaurants, and shopping areas. The apartment is fully furnished with modern amenities.',
      propertyType: PropertyType.APARTMENT,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      pricePerNight: 100,
      currency: 'USD',
      cleaningFee: 20,
      serviceFeePercentage: 14,
      minimumNights: 1,
      maximumNights: 365,
      instantBooking: true,
      status: PropertyStatus.ACTIVE,
      host: {
        id: uuid(),
        name: 'John Doe',
        email: 'john@example.com',
        photo: 'https://via.placeholder.com/150',
        joinedDate: '2020-01-15',
        responseRate: 95,
        responseTime: 'within an hour',
        isSuperHost: true,
      },
      location: {
        address: '123 Main Street, District 1',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        country: 'Vietnam',
        postalCode: '700000',
        latitude: 10.8231,
        longitude: 106.6297,
      },
      amenities: [
        { id: uuid(), name: 'WiFi', icon: 'wifi', category: 'basic' },
        { id: uuid(), name: 'Kitchen', icon: 'kitchen', category: 'basic' },
        { id: uuid(), name: 'Air Conditioning', icon: 'ac', category: 'basic' },
        { id: uuid(), name: 'TV', icon: 'tv', category: 'entertainment' },
        { id: uuid(), name: 'Washing Machine', icon: 'washing', category: 'basic' },
      ],
      photos: [
        { id: uuid(), url: 'https://via.placeholder.com/800x600', isCover: true, order: 1 },
        { id: uuid(), url: 'https://via.placeholder.com/800x600', isCover: false, order: 2 },
        { id: uuid(), url: 'https://via.placeholder.com/800x600', isCover: false, order: 3 },
      ],
      rating: 4.8,
      reviewCount: 24,
      reviews: {
        overall: 4.8,
        cleanliness: 4.9,
        accuracy: 4.7,
        checkin: 4.8,
        communication: 4.9,
        location: 4.8,
        value: 4.7,
      },
      availability: {
        minStay: 1,
        maxStay: 365,
        advanceNotice: 1, // days
        preparationTime: 1, // days
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date(),
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
    // Mock response
    return {
      id,
      ...dto,
      updatedAt: new Date(),
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
    
    // Mock data
    return {
      data: [
        {
          id: uuid(),
          title: 'My Property 1',
          propertyType: PropertyType.APARTMENT,
          status: PropertyStatus.ACTIVE,
          pricePerNight: 100,
          bookingCount: 15,
          revenue: 1500,
          rating: 4.8,
          reviewCount: 10,
        },
        {
          id: uuid(),
          title: 'My Property 2',
          propertyType: PropertyType.HOUSE,
          status: PropertyStatus.DRAFT,
          pricePerNight: 150,
          bookingCount: 0,
          revenue: 0,
          rating: 0,
          reviewCount: 0,
        },
      ],
      meta: {
        page: 1,
        total: 2,
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

