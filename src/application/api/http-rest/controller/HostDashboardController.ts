import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { v4 as uuid } from 'uuid';

/**
 * Host Dashboard Controller - Analytics and insights for hosts
 */
@Controller('api/host/dashboard')
@ApiTags('Host Dashboard')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class HostDashboardController {
  
  /**
   * Get host dashboard overview
   */
  @Get('overview')
  @ApiOperation({ summary: 'Lấy tổng quan dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard overview' })
  async getDashboardOverview(@Req() request: any) {
    const hostId = request.user.id;
    
    // Mock data
    return {
      summary: {
        totalEarnings: 12450.00,
        thisMonthEarnings: 3200.00,
        totalBookings: 48,
        activeListings: 3,
        averageRating: 4.8,
        responseRate: 95,
        acceptanceRate: 88,
      },
      upcomingBookings: {
        count: 5,
        nextCheckIn: '2025-10-15',
      },
      pendingActions: {
        bookingRequests: 2,
        unansweredMessages: 3,
        reviewsToRespond: 1,
      },
      performance: {
        viewsThisMonth: 1240,
        bookingRate: 12.5, // %
        comparedToSimilar: 'above average',
      },
    };
  }
  
  /**
   * Get earnings report
   */
  @Get('earnings')
  @ApiOperation({ summary: 'Báo cáo thu nhập' })
  @ApiResponse({ status: 200, description: 'Earnings report' })
  async getEarnings(@Query('period') period: string = 'month', @Req() request: any) {
    // Mock data
    return {
      period,
      current: {
        total: 3200.00,
        bookings: 8,
        averagePerBooking: 400.00,
      },
      previous: {
        total: 2800.00,
        bookings: 7,
        averagePerBooking: 400.00,
      },
      growth: {
        percentage: 14.3,
        trend: 'up',
      },
      byProperty: [
        {
          propertyId: uuid(),
          title: 'Cozy Apartment',
          earnings: 1600.00,
          bookings: 4,
          occupancyRate: 75,
        },
        {
          propertyId: uuid(),
          title: 'Beach House',
          earnings: 1200.00,
          bookings: 2,
          occupancyRate: 50,
        },
      ],
      chart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: [800, 600, 900, 900],
      },
    };
  }
  
  /**
   * Get occupancy report
   */
  @Get('occupancy')
  @ApiOperation({ summary: 'Báo cáo tỷ lệ lấp đầy' })
  @ApiResponse({ status: 200, description: 'Occupancy report' })
  async getOccupancy(@Req() request: any) {
    return {
      overall: {
        rate: 72.5, // %
        bookedNights: 65,
        availableNights: 90,
      },
      byProperty: [
        {
          propertyId: uuid(),
          title: 'Cozy Apartment',
          occupancyRate: 75,
          bookedNights: 45,
          availableNights: 60,
        },
        {
          propertyId: uuid(),
          title: 'Beach House',
          occupancyRate: 66.7,
          bookedNights: 20,
          availableNights: 30,
        },
      ],
      projection: {
        nextMonth: 78, // %
        next3Months: 70,
      },
    };
  }
  
  /**
   * Get performance metrics
   */
  @Get('performance')
  @ApiOperation({ summary: 'Metrics hiệu suất' })
  @ApiResponse({ status: 200, description: 'Performance metrics' })
  async getPerformance(@Req() request: any) {
    return {
      metrics: {
        views: {
          thisMonth: 1240,
          lastMonth: 980,
          growth: 26.5, // %
        },
        bookingRate: {
          current: 12.5, // %
          average: 10.2, // market average
          rank: 'top 20%',
        },
        responseRate: {
          current: 95, // %
          target: 90,
          status: 'excellent',
        },
        responseTime: {
          average: '2 hours',
          target: '24 hours',
          status: 'excellent',
        },
      },
      rankings: {
        inCity: 15, // out of 250
        similarProperties: 3, // out of 45
        superHostEligible: true,
      },
      recommendations: [
        'Add more photos to increase views',
        'Consider instant booking for more bookings',
        'Your response time is excellent - keep it up!',
      ],
    };
  }
  
  /**
   * Get revenue projection
   */
  @Get('projection')
  @ApiOperation({ summary: 'Dự báo doanh thu' })
  @ApiResponse({ status: 200, description: 'Revenue projection' })
  async getProjection(@Req() request: any) {
    return {
      nextMonth: {
        estimated: 3500.00,
        confidence: 85, // %
        basedOn: 'historical data and market trends',
      },
      next3Months: {
        estimated: 10200.00,
        confidence: 75,
      },
      yearToDate: {
        actual: 28500.00,
        target: 36000.00,
        progress: 79.2, // %
      },
      factors: [
        { factor: 'Seasonal demand', impact: '+15%' },
        { factor: 'Your pricing', impact: 'optimal' },
        { factor: 'Market competition', impact: 'moderate' },
      ],
    };
  }
}

