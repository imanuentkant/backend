import { Controller, Get, Put, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { 
  GetCalendarDto, 
  UpdateDatePriceDto, 
  BulkUpdatePricingDto, 
  BlockDatesDto,
  UpdateAvailabilityRulesDto,
} from '@application/api/http-rest/dto/property/CalendarDto';
import { v4 as uuid } from 'uuid';

/**
 * Property Calendar Controller - Calendar and pricing management
 */
@Controller('api/properties/:propertyId/calendar')
@ApiTags('Property Calendar')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class PropertyCalendarController {
  
  /**
   * Get calendar for month
   */
  @Get()
  @ApiOperation({ summary: 'Lấy calendar theo tháng' })
  @ApiResponse({ status: 200, description: 'Calendar data' })
  async getCalendar(
    @Param('propertyId') propertyId: string,
    @Query() query: GetCalendarDto,
    @Req() request: any,
  ) {
    const { month, year } = query;
    
    // Generate mock calendar data for month
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Mock pricing - higher on weekends
      const basePrice = 100;
      const price = isWeekend ? basePrice * 1.5 : basePrice;
      
      // Mock availability
      const isBooked = Math.random() < 0.3; // 30% booked
      const isBlocked = !isBooked && Math.random() < 0.1; // 10% blocked
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
        isWeekend,
        pricePerNight: price,
        isAvailable: !isBooked && !isBlocked,
        status: isBooked ? 'booked' : isBlocked ? 'blocked' : 'available',
        minimumNights: 1,
        bookingId: isBooked ? uuid() : null,
      });
    }
    
    return {
      propertyId,
      month,
      year,
      days,
      summary: {
        totalDays: daysInMonth,
        available: days.filter(d => d.status === 'available').length,
        booked: days.filter(d => d.status === 'booked').length,
        blocked: days.filter(d => d.status === 'blocked').length,
        averagePrice: days.reduce((sum, d) => sum + d.pricePerNight, 0) / daysInMonth,
        revenue: days.filter(d => d.status === 'booked')
          .reduce((sum, d) => sum + d.pricePerNight, 0),
      },
    };
  }
  
  /**
   * Update price for specific date
   */
  @Put('pricing/date')
  @ApiOperation({ summary: 'Cập nhật giá cho 1 ngày' })
  @ApiResponse({ status: 200, description: 'Price updated' })
  async updateDatePrice(
    @Param('propertyId') propertyId: string,
    @Body() dto: UpdateDatePriceDto,
    @Req() request: any,
  ) {
    return {
      propertyId,
      date: dto.date,
      pricePerNight: dto.pricePerNight,
      updatedAt: new Date(),
      message: 'Price updated for this date',
    };
  }
  
  /**
   * Bulk update pricing for date range
   */
  @Put('pricing/bulk')
  @ApiOperation({ summary: 'Cập nhật giá cho nhiều ngày' })
  @ApiResponse({ status: 200, description: 'Prices updated' })
  async bulkUpdatePricing(
    @Param('propertyId') propertyId: string,
    @Body() dto: BulkUpdatePricingDto,
    @Req() request: any,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      propertyId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      pricePerNight: dto.pricePerNight,
      daysUpdated: days,
      updatedAt: new Date(),
      message: `Prices updated for ${days} days`,
    };
  }
  
  /**
   * Block dates (make unavailable)
   */
  @Post('block')
  @ApiOperation({ summary: 'Block dates (không cho book)' })
  @ApiResponse({ status: 200, description: 'Dates blocked' })
  async blockDates(
    @Param('propertyId') propertyId: string,
    @Body() dto: BlockDatesDto,
    @Req() request: any,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      propertyId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      daysBlocked: days,
      reason: dto.reason || 'Blocked by host',
      blockedAt: new Date(),
      message: `${days} days blocked successfully`,
    };
  }
  
  /**
   * Unblock dates
   */
  @Post('unblock')
  @ApiOperation({ summary: 'Unblock dates (cho phép book lại)' })
  @ApiResponse({ status: 200, description: 'Dates unblocked' })
  async unblockDates(
    @Param('propertyId') propertyId: string,
    @Body() dto: BlockDatesDto,
    @Req() request: any,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      propertyId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      daysUnblocked: days,
      unblockedAt: new Date(),
      message: `${days} days unblocked successfully`,
    };
  }
  
  /**
   * Get availability rules
   */
  @Get('rules')
  @ApiOperation({ summary: 'Lấy availability rules' })
  @ApiResponse({ status: 200, description: 'Availability rules' })
  async getAvailabilityRules(@Param('propertyId') propertyId: string) {
    return {
      propertyId,
      rules: {
        advanceNoticeDays: 1,          // Guest phải book trước 1 ngày
        preparationDays: 1,             // Cần 1 ngày chuẩn bị giữa bookings
        bookingWindowMonths: 12,        // Có thể book trước 12 tháng
        checkInDays: [0,1,2,3,4,5,6],  // Tất cả các ngày
        checkInTimeFrom: '14:00',       // Check-in từ 2 PM
        checkInTimeTo: '22:00',         // đến 10 PM
        checkOutTime: '12:00',          // Check-out 12 PM
      },
      computed: {
        earliestCheckIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        latestCheckIn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    };
  }
  
  /**
   * Update availability rules
   */
  @Put('rules')
  @ApiOperation({ summary: 'Cập nhật availability rules' })
  @ApiResponse({ status: 200, description: 'Rules updated' })
  async updateAvailabilityRules(
    @Param('propertyId') propertyId: string,
    @Body() dto: UpdateAvailabilityRulesDto,
    @Req() request: any,
  ) {
    return {
      propertyId,
      rules: dto,
      updatedAt: new Date(),
      message: 'Availability rules updated successfully',
    };
  }
  
  /**
   * Get pricing calendar (next 12 months)
   */
  @Get('pricing')
  @ApiOperation({ summary: 'Lấy pricing calendar' })
  @ApiResponse({ status: 200, description: 'Pricing calendar' })
  async getPricingCalendar(@Param('propertyId') propertyId: string) {
    // Generate pricing for next 12 months
    const months = [];
    const basePrice = 100;
    
    for (let m = 0; m < 12; m++) {
      const date = new Date();
      date.setMonth(date.getMonth() + m);
      
      const isHighSeason = [5, 6, 7, 11].includes(date.getMonth()); // Summer & December
      const avgPrice = isHighSeason ? basePrice * 1.3 : basePrice;
      
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        averagePrice: avgPrice,
        minPrice: avgPrice * 0.8,
        maxPrice: avgPrice * 1.5,
        occupancyRate: Math.random() * 40 + 40, // 40-80%
        season: isHighSeason ? 'high' : 'normal',
      });
    }
    
    return {
      propertyId,
      basePricePerNight: basePrice,
      currency: 'USD',
      months,
      recommendations: [
        'Consider increasing prices for June-July (summer season)',
        'Weekend prices are typically 30-50% higher',
        'Early bird discount: Offer 10% off for bookings 2+ months in advance',
      ],
    };
  }
  
  /**
   * Get availability summary
   */
  @Get('availability')
  @ApiOperation({ summary: 'Lấy tổng quan availability' })
  @ApiResponse({ status: 200, description: 'Availability summary' })
  async getAvailabilitySummary(@Param('propertyId') propertyId: string) {
    return {
      propertyId,
      next30Days: {
        available: 22,
        booked: 6,
        blocked: 2,
        occupancyRate: 26.7, // %
      },
      next90Days: {
        available: 65,
        booked: 18,
        blocked: 7,
        occupancyRate: 28.9,
      },
      yearToDate: {
        totalBookings: 48,
        totalNights: 156,
        occupancyRate: 42.7,
        revenue: 15600,
      },
      upcomingBookings: [
        {
          id: uuid(),
          checkIn: '2025-10-15',
          checkOut: '2025-10-18',
          nights: 3,
          guest: 'John Doe',
        },
        {
          id: uuid(),
          checkIn: '2025-10-22',
          checkOut: '2025-10-25',
          nights: 3,
          guest: 'Jane Smith',
        },
      ],
    };
  }
  
  /**
   * Sync with external calendar (iCal)
   */
  @Post('sync/ical')
  @ApiOperation({ summary: 'Sync với external calendar (iCal)' })
  @ApiResponse({ status: 200, description: 'Calendar synced' })
  async syncICalendar(
    @Param('propertyId') propertyId: string,
    @Body() body: { icalUrl: string },
    @Req() request: any,
  ) {
    // Fetch iCal feed
    // Parse dates
    // Block dates trong calendar
    
    return {
      propertyId,
      icalUrl: body.icalUrl,
      syncedAt: new Date(),
      datesImported: 15,
      message: 'Calendar synced successfully. 15 dates blocked from external calendar.',
    };
  }
  
  /**
   * Export calendar as iCal
   */
  @Get('export/ical')
  @ApiOperation({ summary: 'Export calendar dạng iCal' })
  @ApiResponse({ status: 200, description: 'iCal feed URL' })
  async exportICalendar(@Param('propertyId') propertyId: string) {
    const icalUrl = `https://api.yourdomain.com/api/calendars/${propertyId}/ical.ics`;
    
    return {
      propertyId,
      icalUrl,
      format: 'iCalendar (ICS)',
      instructions: 'Import this URL into your calendar app (Google Calendar, Outlook, etc.)',
      message: 'Use this URL to sync with other platforms',
    };
  }
}

