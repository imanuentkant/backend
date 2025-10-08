import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookingDto } from '@application/api/http-rest/dto/booking/CreateBookingDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { BookingStatus, CancellationPolicy } from '@core/common/enums/BookingEnums';
import { v4 as uuid } from 'uuid';

/**
 * Booking Controller - Airbnb-like booking management
 */
@Controller('api/bookings')
@ApiTags('Bookings')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  
  /**
   * Create new booking
   */
  @Post()
  @ApiOperation({ summary: 'Tạo booking mới' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async createBooking(@Body() dto: CreateBookingDto, @Req() request: any) {
    const guestId = request.user.id;
    
    // Calculate pricing
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const pricePerNight = 100; // Mock price
    const subtotal = pricePerNight * nights;
    const cleaningFee = 20;
    const serviceFee = subtotal * 0.14;
    const total = subtotal + cleaningFee + serviceFee;
    
    // Mock response
    return {
      id: uuid(),
      propertyId: dto.propertyId,
      guestId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      numberOfGuests: dto.numberOfGuests,
      totalNights: nights,
      pricing: {
        pricePerNight,
        nights,
        subtotal,
        cleaningFee,
        serviceFee,
        total,
        currency: 'USD',
      },
      status: BookingStatus.PENDING,
      cancellationPolicy: CancellationPolicy.FLEXIBLE,
      specialRequests: dto.specialRequests,
      property: {
        id: dto.propertyId,
        title: 'Cozy Apartment in City Center',
        location: 'Ho Chi Minh City, Vietnam',
        coverPhoto: 'https://via.placeholder.com/400x300',
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      message: 'Booking request sent. Host has 24 hours to respond.',
    };
  }
  
  /**
   * Get all bookings for current user
   */
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bookings của user' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async getUserBookings(@Req() request: any, @Query('status') status?: string) {
    const userId = request.user.id;
    
    // Mock data
    const mockBookings = [
      {
        id: uuid(),
        propertyId: uuid(),
        checkInDate: '2025-11-01',
        checkOutDate: '2025-11-05',
        totalNights: 4,
        numberOfGuests: 2,
        total: 476,
        currency: 'USD',
        status: BookingStatus.CONFIRMED,
        property: {
          title: 'Cozy Apartment',
          location: 'Ho Chi Minh City',
          coverPhoto: 'https://via.placeholder.com/400x300',
        },
        host: {
          name: 'John Doe',
          photo: 'https://via.placeholder.com/150',
        },
        createdAt: '2025-10-01',
      },
      {
        id: uuid(),
        propertyId: uuid(),
        checkInDate: '2025-12-15',
        checkOutDate: '2025-12-20',
        totalNights: 5,
        numberOfGuests: 4,
        total: 1270,
        currency: 'USD',
        status: BookingStatus.PENDING,
        property: {
          title: 'Luxury Villa',
          location: 'Da Nang',
          coverPhoto: 'https://via.placeholder.com/400x300',
        },
        host: {
          name: 'Jane Smith',
          photo: 'https://via.placeholder.com/150',
        },
        createdAt: '2025-10-08',
      },
    ];
    
    let filtered = [...mockBookings];
    if (status) {
      filtered = filtered.filter(b => b.status === status);
    }
    
    return {
      data: filtered,
      meta: {
        page: 1,
        total: filtered.length,
        upcoming: filtered.filter(b => b.status === BookingStatus.CONFIRMED).length,
        past: 0,
        cancelled: filtered.filter(b => b.status === BookingStatus.CANCELLED).length,
      },
    };
  }
  
  /**
   * Get booking details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết booking' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  async getBooking(@Param('id') id: string, @Req() request: any) {
    // Mock response
    return {
      id,
      propertyId: uuid(),
      guestId: request.user.id,
      checkInDate: '2025-11-01',
      checkOutDate: '2025-11-05',
      numberOfGuests: 2,
      totalNights: 4,
      pricing: {
        pricePerNight: 100,
        nights: 4,
        subtotal: 400,
        cleaningFee: 20,
        serviceFee: 56,
        total: 476,
        currency: 'USD',
      },
      status: BookingStatus.CONFIRMED,
      cancellationPolicy: CancellationPolicy.FLEXIBLE,
      specialRequests: 'Late check-in around 10 PM',
      property: {
        id: uuid(),
        title: 'Cozy Apartment in City Center',
        address: '123 Main Street, District 1',
        location: 'Ho Chi Minh City, Vietnam',
        coverPhoto: 'https://via.placeholder.com/800x600',
        checkInTime: '14:00',
        checkOutTime: '12:00',
      },
      host: {
        id: uuid(),
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+84 123 456 789',
        photo: 'https://via.placeholder.com/150',
        responseRate: 95,
        isSuperHost: true,
      },
      guest: {
        id: request.user.id,
        name: request.user.email,
        email: request.user.email,
        phone: '+84 987 654 321',
      },
      confirmedAt: '2025-10-02T10:30:00Z',
      createdAt: '2025-10-01T15:20:00Z',
      canCancel: true,
      canReview: false,
      refundAmount: 476, // Full refund với flexible policy
    };
  }
  
  /**
   * Confirm booking (Host only)
   */
  @Put(':id/confirm')
  @ApiOperation({ summary: 'Xác nhận booking (Host)' })
  @ApiResponse({ status: 200, description: 'Booking confirmed' })
  async confirmBooking(@Param('id') id: string, @Req() request: any) {
    return {
      id,
      status: BookingStatus.CONFIRMED,
      confirmedAt: new Date(),
      message: 'Booking confirmed successfully. Guest has been notified.',
    };
  }
  
  /**
   * Reject booking (Host only)
   */
  @Put(':id/reject')
  @ApiOperation({ summary: 'Từ chối booking (Host)' })
  @ApiResponse({ status: 200, description: 'Booking rejected' })
  async rejectBooking(@Param('id') id: string, @Body('reason') reason?: string) {
    return {
      id,
      status: BookingStatus.REJECTED,
      reason: reason || 'Property not available for selected dates',
      rejectedAt: new Date(),
      message: 'Booking rejected. Guest has been notified.',
    };
  }
  
  /**
   * Cancel booking
   */
  @Put(':id/cancel')
  @ApiOperation({ summary: 'Hủy booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  async cancelBooking(@Param('id') id: string, @Body('reason') reason?: string) {
    // Mock refund calculation
    const refundAmount = 476; // Mock
    const refundPercentage = 100;
    
    return {
      id,
      status: BookingStatus.CANCELLED,
      reason: reason || 'Cancelled by guest',
      cancelledAt: new Date(),
      refund: {
        amount: refundAmount,
        percentage: refundPercentage,
        currency: 'USD',
        processedIn: '5-10 business days',
      },
      message: `Booking cancelled. You will receive a ${refundPercentage}% refund of ${refundAmount} USD.`,
    };
  }
  
  /**
   * Calculate booking price
   */
  @Post('calculate-price')
  @ApiOperation({ summary: 'Tính giá booking' })
  @ApiResponse({ status: 200, description: 'Price breakdown' })
  async calculatePrice(@Body() dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const pricePerNight = 100; // Mock - should fetch from property
    const subtotal = pricePerNight * nights;
    const cleaningFee = 20;
    const serviceFee = subtotal * 0.14;
    const total = subtotal + cleaningFee + serviceFee;
    
    return {
      propertyId: dto.propertyId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      nights,
      pricing: {
        pricePerNight,
        nights,
        subtotal,
        cleaningFee,
        serviceFee: {
          amount: serviceFee,
          percentage: 14,
        },
        total,
        currency: 'USD',
      },
      breakdown: [
        { label: `${pricePerNight} USD × ${nights} nights`, amount: subtotal },
        { label: 'Cleaning fee', amount: cleaningFee },
        { label: 'Service fee', amount: serviceFee },
      ],
    };
  }
  
  /**
   * Get bookings as host
   */
  @Get('host/reservations')
  @ApiOperation({ summary: 'Lấy danh sách reservations (Host)' })
  @ApiResponse({ status: 200, description: 'List of reservations' })
  async getHostReservations(@Req() request: any, @Query('status') status?: string) {
    // Mock data
    return {
      data: [
        {
          id: uuid(),
          propertyId: uuid(),
          propertyTitle: 'My Cozy Apartment',
          guest: {
            name: 'Alice Johnson',
            photo: 'https://via.placeholder.com/150',
            joinedDate: '2023-05-15',
          },
          checkInDate: '2025-11-10',
          checkOutDate: '2025-11-15',
          totalNights: 5,
          numberOfGuests: 3,
          total: 570,
          status: BookingStatus.PENDING,
          createdAt: '2025-10-08',
          expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
        },
      ],
      meta: {
        page: 1,
        total: 1,
        pending: 1,
        confirmed: 0,
        completed: 0,
      },
    };
  }
}

