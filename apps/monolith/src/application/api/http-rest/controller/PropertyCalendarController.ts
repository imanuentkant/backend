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
import { GetPropertyCalendarUseCase } from '@core/service/property/usecase/GetPropertyCalendarUseCase';
import { UpdateDatePricingUseCase } from '@core/service/property/usecase/UpdateDatePricingUseCase';
import { BulkUpdatePricingUseCase } from '@core/service/property/usecase/BulkUpdatePricingUseCase';
import { BlockDatesUseCase } from '@core/service/property/usecase/BlockDatesUseCase';
import { UnblockDatesUseCase } from '@core/service/property/usecase/UnblockDatesUseCase';
import { GetAvailabilityRulesUseCase } from '@core/service/property/usecase/GetAvailabilityRulesUseCase';
import { UpdateAvailabilityRulesUseCase } from '@core/service/property/usecase/UpdateAvailabilityRulesUseCase';
import { GetAvailabilitySummaryUseCase } from '@core/service/property/usecase/GetAvailabilitySummaryUseCase';
import { Request } from 'express';

/**
 * Property Calendar Controller - Calendar and pricing management
 */
@Controller('api/properties/:propertyId/calendar')
@ApiTags('Property Calendar')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class PropertyCalendarController {
  
  constructor(
    private readonly getPropertyCalendarUseCase: GetPropertyCalendarUseCase,
    private readonly updateDatePricingUseCase: UpdateDatePricingUseCase,
    private readonly bulkUpdatePricingUseCase: BulkUpdatePricingUseCase,
    private readonly blockDatesUseCase: BlockDatesUseCase,
    private readonly unblockDatesUseCase: UnblockDatesUseCase,
    private readonly getAvailabilityRulesUseCase: GetAvailabilityRulesUseCase,
    private readonly updateAvailabilityRulesUseCase: UpdateAvailabilityRulesUseCase,
    private readonly getAvailabilitySummaryUseCase: GetAvailabilitySummaryUseCase,
  ) {}
  
  /**
   * Get calendar for month
   */
  @Get()
  @ApiOperation({ summary: 'Lấy calendar theo tháng' })
  @ApiResponse({ status: 200, description: 'Calendar data' })
  async getCalendar(
    @Param('propertyId') propertyId: string,
    @Query() query: GetCalendarDto,
    @Req() request: Request,
  ) {
    const { month, year } = query;
    
    // Get real calendar data from database
    const days = await this.getPropertyCalendarUseCase.execute({
      propertyId,
      month,
      year,
    });
    
    // Calculate summary
    const daysInMonth = new Date(year, month, 0).getDate();
    const available = days.filter(d => d.status === 'available').length;
    const booked = days.filter(d => d.status === 'booked').length;
    const blocked = days.filter(d => d.status === 'blocked').length;
    const averagePrice = days.reduce((sum, d) => sum + d.pricePerNight, 0) / daysInMonth;
    const revenue = days.filter(d => d.status === 'booked')
      .reduce((sum, d) => sum + d.pricePerNight, 0);
    
    return {
      propertyId,
      month,
      year,
      days,
      summary: {
        totalDays: daysInMonth,
        available,
        booked,
        blocked,
        averagePrice: Math.round(averagePrice * 100) / 100,
        revenue: Math.round(revenue * 100) / 100,
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
    @Req() request: Request,
  ) {
    const calendar = await this.updateDatePricingUseCase.execute({
      propertyId,
      date: new Date(dto.date),
      pricePerNight: dto.pricePerNight,
    });
    
    return {
      propertyId,
      date: dto.date,
      pricePerNight: calendar.getPricePerNight(),
      updatedAt: calendar.getUpdatedAt(),
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
    @Req() request: Request,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    
    const updatedCount = await this.bulkUpdatePricingUseCase.execute({
      propertyId,
      startDate,
      endDate,
      pricePerNight: dto.pricePerNight,
    });
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      propertyId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      pricePerNight: dto.pricePerNight,
      daysUpdated: updatedCount || days,
      updatedAt: new Date(),
      message: `Prices updated for ${updatedCount || days} days`,
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
    @Req() request: Request,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    
    await this.blockDatesUseCase.execute({
      propertyId,
      startDate,
      endDate,
      reason: dto.reason,
    });
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
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
    @Req() request: Request,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    
    await this.unblockDatesUseCase.execute({
      propertyId,
      startDate,
      endDate,
    });
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
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
    const rules = await this.getAvailabilityRulesUseCase.execute({ propertyId });
    
    // Calculate computed values
    const earliestCheckIn = rules.getEarliestCheckInDate();
    const latestCheckIn = new Date();
    latestCheckIn.setMonth(latestCheckIn.getMonth() + rules.getBookingWindowMonths());
    
    return {
      propertyId,
      rules: {
        advanceNoticeDays: rules.getAdvanceNoticeDays(),
        preparationDays: rules.getPreparationDays(),
        bookingWindowMonths: rules.getBookingWindowMonths(),
        checkInDays: rules.getCheckInDays(),
        checkInTimeFrom: rules.getCheckInTimeFrom(),
        checkInTimeTo: rules.getCheckInTimeTo(),
        checkOutTime: rules.getCheckOutTime(),
      },
      computed: {
        earliestCheckIn: earliestCheckIn.toISOString().split('T')[0],
        latestCheckIn: latestCheckIn.toISOString().split('T')[0],
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
    @Req() request: Request,
  ) {
    const rules = await this.updateAvailabilityRulesUseCase.execute({
      propertyId,
      advanceNoticeDays: dto.advanceNoticeDays,
      preparationDays: dto.preparationDays,
      checkInDays: dto.checkInDays,
      checkInTimeFrom: dto.checkInTimeFrom,
      checkInTimeTo: dto.checkInTimeTo,
      checkOutTime: dto.checkOutTime,
    });
    
    return {
      propertyId,
      rules: {
        advanceNoticeDays: rules.getAdvanceNoticeDays(),
        preparationDays: rules.getPreparationDays(),
        bookingWindowMonths: rules.getBookingWindowMonths(),
        checkInDays: rules.getCheckInDays(),
        checkInTimeFrom: rules.getCheckInTimeFrom(),
        checkInTimeTo: rules.getCheckInTimeTo(),
        checkOutTime: rules.getCheckOutTime(),
      },
      updatedAt: rules.getUpdatedAt(),
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
    // Generate pricing overview for next 12 months
    const months = [];
    const currentDate = new Date();
    
    for (let m = 0; m < 12; m++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() + m);
      
      const monthData = await this.getPropertyCalendarUseCase.execute({
        propertyId,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
      
      const prices = monthData.map(d => d.pricePerNight);
      const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const bookedDays = monthData.filter(d => d.status === 'booked').length;
      const totalDays = monthData.length;
      const occupancyRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;
      
      const isHighSeason = [5, 6, 7, 11].includes(date.getMonth());
      
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        averagePrice: Math.round(avgPrice * 100) / 100,
        minPrice: Math.round(minPrice * 100) / 100,
        maxPrice: Math.round(maxPrice * 100) / 100,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        season: isHighSeason ? 'high' : 'normal',
      });
    }
    
    const allPrices = months.map(m => m.averagePrice).filter(p => p > 0);
    const basePricePerNight = allPrices.length > 0 
      ? Math.round((allPrices.reduce((a, b) => a + b, 0) / allPrices.length) * 100) / 100
      : 100;
    
    return {
      propertyId,
      basePricePerNight,
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
    const summary = await this.getAvailabilitySummaryUseCase.execute({ propertyId });
    
    return {
      propertyId,
      next30Days: summary.next30Days,
      next90Days: summary.next90Days,
      yearToDate: {
        totalBookings: 0, // TODO: Get from booking repository
        totalNights: 0,
        occupancyRate: 0,
        revenue: 0,
      },
      upcomingBookings: [], // TODO: Get from booking repository
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
    @Req() request: Request,
  ) {
    // TODO: Implement iCal sync
    // - Fetch iCal feed from URL
    // - Parse VEVENT entries
    // - Block dates in calendar based on external bookings
    
    return {
      propertyId,
      icalUrl: body.icalUrl,
      syncedAt: new Date(),
      datesImported: 0,
      message: 'iCal sync feature coming soon',
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