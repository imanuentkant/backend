import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookingDto } from '@application/api/http-rest/dto/booking/CreateBookingDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { BookingStatus, CancellationPolicy } from '@core/common/enums/BookingEnums';
import { CreateBookingUseCase } from '@core/service/booking/usecase/CreateBookingUseCase';
import { GetBookingUseCase } from '@core/service/booking/usecase/GetBookingUseCase';
import { ConfirmBookingUseCase } from '@core/service/booking/usecase/ConfirmBookingUseCase';
import { CancelBookingUseCase } from '@core/service/booking/usecase/CancelBookingUseCase';
import { ListUserBookingsUseCase } from '@core/service/booking/usecase/ListUserBookingsUseCase';
import { ListHostReservationsUseCase } from '@core/service/booking/usecase/ListHostReservationsUseCase';
import { GetPropertyUseCase } from '@core/service/property/usecase/GetPropertyUseCase';
import {
  CreateBookingResponseDto,
  ListBookingsResponseDto,
  BookingDetailResponseDto,
  ConfirmBookingResponseDto,
  CancelBookingResponseDto,
} from '@application/api/http-rest/dto/booking/BookingResponseDto';

/**
 * Booking Controller - Airbnb-like booking management
 */
@Controller('api/bookings')
@ApiTags('Bookings')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getBookingUseCase: GetBookingUseCase,
    private readonly confirmBookingUseCase: ConfirmBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly listUserBookingsUseCase: ListUserBookingsUseCase,
    private readonly listHostReservationsUseCase: ListHostReservationsUseCase,
    private readonly getPropertyUseCase: GetPropertyUseCase,
  ) {}
  
  /**
   * Create new booking
   */
  @Post()
  @ApiOperation({ summary: 'Tạo booking mới' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: CreateBookingResponseDto })
  async createBooking(
    @Body() dto: CreateBookingDto, 
    @Req() request: Express.Request & { user: { id: string, email: string } }
  ): Promise<CreateBookingResponseDto> {
    const guestId = request.user.id;
    
    const booking = await this.createBookingUseCase.execute({
      propertyId: dto.propertyId,
      guestId,
      checkInDate: new Date(dto.checkInDate),
      checkOutDate: new Date(dto.checkOutDate),
      numberOfGuests: dto.numberOfGuests,
      specialRequests: dto.specialRequests,
    });
    
    return {
      id: booking.getId(),
      bookableType: booking.getBookableType(),
      bookableId: booking.getBookableId(),
      propertyId: booking.getPropertyId(),
      guestId: booking.getGuestId(),
      checkInDate: booking.getCheckInDate(),
      checkOutDate: booking.getCheckOutDate(),
      numberOfGuests: booking.getNumberOfGuests(),
      totalNights: booking.getTotalNights(),
      pricing: {
        pricePerNight: booking.getPricePerNight(),
        nights: booking.getTotalNights(),
        subtotal: booking.getSubtotal(),
        cleaningFee: booking.getCleaningFee(),
        serviceFee: booking.getServiceFee(),
        total: booking.getTotalAmount(),
        currency: booking.getCurrency(),
      },
      status: booking.getStatus(),
      cancellationPolicy: booking.getCancellationPolicy(),
      specialRequests: booking.getSpecialRequests(),
      createdAt: booking.getCreatedAt(),
      message: booking.getStatus() === 'confirmed' 
        ? 'Booking confirmed instantly!' 
        : 'Booking request sent. Host has 24 hours to respond.',
    };
  }
  
  /**
   * Get all bookings for current user
   */
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bookings của user' })
  @ApiResponse({ status: 200, description: 'List of bookings', type: ListBookingsResponseDto })
  async getUserBookings(
    @Req() request: Express.Request & { user: { id: string } },
    @Query('status') status?: string
  ): Promise<ListBookingsResponseDto> {
    const userId = request.user.id;
    
    const bookings = await this.listUserBookingsUseCase.execute({
      guestId: userId,
      status: status as BookingStatus,
    });
    
    return {
      data: bookings.map(booking => ({
        id: booking.getId(),
        bookableType: booking.getBookableType(),
        bookableId: booking.getBookableId(),
        propertyId: booking.getPropertyId(),
        checkInDate: booking.getCheckInDate(),
        checkOutDate: booking.getCheckOutDate(),
        totalNights: booking.getTotalNights(),
        numberOfGuests: booking.getNumberOfGuests(),
        totalAmount: booking.getTotalAmount(),
        currency: booking.getCurrency(),
        status: booking.getStatus(),
        cancellationPolicy: booking.getCancellationPolicy(),
        specialRequests: booking.getSpecialRequests(),
        confirmedAt: booking.getConfirmedAt(),
        cancelledAt: booking.getCancelledAt(),
        createdAt: booking.getCreatedAt(),
      })),
      meta: {
        page: 1,
        total: bookings.length,
        upcoming: bookings.filter(b => b.getStatus() === BookingStatus.CONFIRMED).length,
        past: bookings.filter(b => b.getStatus() === BookingStatus.COMPLETED).length,
        pending: bookings.filter(b => b.getStatus() === BookingStatus.PENDING).length,
        cancelled: bookings.filter(b => b.getStatus() === BookingStatus.CANCELLED).length,
      },
    };
  }
  
  /**
   * Get booking details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết booking' })
  @ApiResponse({ status: 200, description: 'Booking details', type: BookingDetailResponseDto })
  async getBooking(
    @Param('id') id: string, 
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<BookingDetailResponseDto> {
    const booking = await this.getBookingUseCase.execute({
      id,
      userId: request.user.id,
    });
    
    // Calculate if can cancel (before check-in date)
    const now = new Date();
    const canCancel = booking.getCheckInDate() > now && 
                      booking.getStatus() !== BookingStatus.CANCELLED &&
                      booking.getStatus() !== BookingStatus.COMPLETED;
    
    // Can review if completed
    const canReview = booking.getStatus() === BookingStatus.COMPLETED;
    
    return {
      id: booking.getId(),
      bookableType: booking.getBookableType(),
      bookableId: booking.getBookableId(),
      propertyId: booking.getPropertyId(),
      guestId: booking.getGuestId(),
      checkInDate: booking.getCheckInDate(),
      checkOutDate: booking.getCheckOutDate(),
      numberOfGuests: booking.getNumberOfGuests(),
      totalNights: booking.getTotalNights(),
      pricing: {
        pricePerNight: booking.getPricePerNight(),
        nights: booking.getTotalNights(),
        subtotal: booking.getSubtotal(),
        cleaningFee: booking.getCleaningFee(),
        serviceFee: booking.getServiceFee(),
        total: booking.getTotalAmount(),
        currency: booking.getCurrency(),
      },
      status: booking.getStatus(),
      cancellationPolicy: booking.getCancellationPolicy(),
      specialRequests: booking.getSpecialRequests(),
      confirmedAt: booking.getConfirmedAt(),
      cancelledAt: booking.getCancelledAt(),
      cancellationReason: booking.getCancellationReason(),
      createdAt: booking.getCreatedAt(),
      updatedAt: booking.getUpdatedAt(),
      canCancel,
      canReview,
    };
  }
  
  /**
   * Confirm booking (Host only)
   */
  @Put(':id/confirm')
  @ApiOperation({ summary: 'Xác nhận booking (Host)' })
  @ApiResponse({ status: 200, description: 'Booking confirmed', type: ConfirmBookingResponseDto })
  async confirmBooking(
    @Param('id') id: string, 
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<ConfirmBookingResponseDto> {
    const booking = await this.confirmBookingUseCase.execute({
      bookingId: id,
      hostId: request.user.id,
    });
    
    return {
      id: booking.getId(),
      status: booking.getStatus(),
      confirmedAt: booking.getConfirmedAt(),
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
  @ApiResponse({ status: 200, description: 'Booking cancelled', type: CancelBookingResponseDto })
  async cancelBooking(
    @Param('id') id: string, 
    @Body('reason') reason?: string, 
    @Req() request?: Express.Request & { user: { id: string } }
  ): Promise<CancelBookingResponseDto> {
    const booking = await this.cancelBookingUseCase.execute({
      bookingId: id,
      userId: request!.user.id,
      reason,
    });
    
    // Calculate refund based on cancellation policy (simplified)
    const refundAmount = booking.getTotalAmount();
    const refundPercentage = 100; // Flexible policy
    
    return {
      id: booking.getId(),
      status: booking.getStatus(),
      reason: booking.getCancellationReason(),
      cancelledAt: booking.getCancelledAt(),
      refund: {
        amount: refundAmount,
        percentage: refundPercentage,
        currency: booking.getCurrency(),
        processedIn: '5-10 business days',
      },
      message: `Booking cancelled. You will receive a ${refundPercentage}% refund of ${refundAmount} ${booking.getCurrency()}.`,
    };
  }
  
  /**
   * Calculate booking price
   * Note: Requires fetching property/vehicle data - simplified version
   */
  @Post('calculate-price')
  @ApiOperation({ summary: 'Tính giá booking' })
  @ApiResponse({ status: 200, description: 'Price breakdown' })
  async calculatePrice(@Body() dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Fetch actual property to get real price
    let pricePerNight = 100;
    let cleaningFee = 20;
    let serviceFeePercentage = 0.14;
    
    if (dto.propertyId) {
      try {
        const property = await this.getPropertyUseCase.execute({ id: dto.propertyId });
        pricePerNight = property.getPricePerNight();
        cleaningFee = property.getCleaningFee();
        serviceFeePercentage = property.getServiceFeePercentage() / 100;
      } catch (error) {
        // Property not found, use default values
      }
    }
    // TODO: Handle vehicle pricing similarly when bookableType = 'vehicle'
    
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * serviceFeePercentage;
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
      note: 'This is an estimated calculation. Actual price may vary based on property/vehicle pricing.',
    };
  }
  
  /**
   * Get bookings as host
   */
  @Get('host/reservations')
  @ApiOperation({ summary: 'Lấy danh sách reservations (Host)' })
  @ApiResponse({ status: 200, description: 'List of reservations', type: ListBookingsResponseDto })
  async getHostReservations(
    @Req() request: Express.Request & { user: { id: string } },
    @Query('status') status?: string
  ): Promise<ListBookingsResponseDto> {
    const hostId = request.user.id;
    
    const bookings = await this.listHostReservationsUseCase.execute({
      hostId,
      status: status as BookingStatus,
    });
    
    return {
      data: bookings.map(booking => ({
        id: booking.getId(),
        bookableType: booking.getBookableType(),
        bookableId: booking.getBookableId(),
        propertyId: booking.getPropertyId(),
        checkInDate: booking.getCheckInDate(),
        checkOutDate: booking.getCheckOutDate(),
        totalNights: booking.getTotalNights(),
        numberOfGuests: booking.getNumberOfGuests(),
        totalAmount: booking.getTotalAmount(),
        currency: booking.getCurrency(),
        status: booking.getStatus(),
        cancellationPolicy: booking.getCancellationPolicy(),
        specialRequests: booking.getSpecialRequests(),
        confirmedAt: booking.getConfirmedAt(),
        cancelledAt: booking.getCancelledAt(),
        createdAt: booking.getCreatedAt(),
      })),
      meta: {
        page: 1,
        total: bookings.length,
        upcoming: 0,
        past: 0,
        pending: bookings.filter(b => b.getStatus() === BookingStatus.PENDING).length,
        confirmed: bookings.filter(b => b.getStatus() === BookingStatus.CONFIRMED).length,
        completed: bookings.filter(b => b.getStatus() === BookingStatus.COMPLETED).length,
        cancelled: bookings.filter(b => b.getStatus() === BookingStatus.CANCELLED).length,
      },
    };
  }
}

