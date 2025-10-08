import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { GetHostDashboardUseCase } from '@core/service/booking/usecase/GetHostDashboardUseCase';
import { GetHostEarningsUseCase } from '@core/service/booking/usecase/GetHostEarningsUseCase';
import { GetHostOccupancyUseCase } from '@core/service/booking/usecase/GetHostOccupancyUseCase';
import { GetEarningsQueryDto, PeriodType } from '@application/api/http-rest/dto/booking/GetEarningsQueryDto';
import { 
  HostDashboardOverviewResponseDto,
  HostEarningsReportResponseDto,
  HostOccupancyReportResponseDto,
  PerformanceMetricsResponseDto,
  RevenueProjectionResponseDto,
} from '@application/api/http-rest/dto/booking/HostDashboardResponseDto';

/**
 * Host Dashboard Controller - Analytics and insights for hosts
 */
@Controller('api/host/dashboard')
@ApiTags('Host Dashboard')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class HostDashboardController {

  constructor(
    private readonly getHostDashboardUseCase: GetHostDashboardUseCase,
    private readonly getHostEarningsUseCase: GetHostEarningsUseCase,
    private readonly getHostOccupancyUseCase: GetHostOccupancyUseCase,
  ) { }

  /**
   * Get host dashboard overview
   */
  @Get('overview')
  @ApiOperation({ summary: 'Lấy tổng quan dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard overview', type: HostDashboardOverviewResponseDto })
  async getDashboardOverview(@Req() request: Express.Request & { user: { id: string } }): Promise<HostDashboardOverviewResponseDto> {
    const hostId = request.user.id;

    const dashboard = await this.getHostDashboardUseCase.execute({ hostId });

    return dashboard;
  }

  /**
   * Get earnings report
   */
  @Get('earnings')
  @ApiOperation({ summary: 'Báo cáo thu nhập' })
  @ApiResponse({ status: 200, description: 'Earnings report', type: HostEarningsReportResponseDto })
  async getEarnings(
    @Query() query: GetEarningsQueryDto, 
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<HostEarningsReportResponseDto> {
    const hostId = request.user.id;

    const earnings = await this.getHostEarningsUseCase.execute({
      hostId,
      period: query.period || PeriodType.MONTH,
    });

    return earnings;
  }

  /**
   * Get occupancy report
   */
  @Get('occupancy')
  @ApiOperation({ summary: 'Báo cáo tỷ lệ lấp đầy' })
  @ApiResponse({ status: 200, description: 'Occupancy report', type: HostOccupancyReportResponseDto })
  async getOccupancy(@Req() request: Express.Request & { user: { id: string } }): Promise<HostOccupancyReportResponseDto> {
    const hostId = request.user.id;

    const occupancy = await this.getHostOccupancyUseCase.execute({ hostId });

    return occupancy;
  }

  /**
   * Get performance metrics
   * Note: Some metrics require message/view tracking - simplified for now
   */
  @Get('performance')
  @ApiOperation({ summary: 'Metrics hiệu suất' })
  @ApiResponse({ status: 200, description: 'Performance metrics', type: PerformanceMetricsResponseDto })
  async getPerformance(@Req() request: Express.Request & { user: { id: string } }): Promise<PerformanceMetricsResponseDto> {
    const hostId = request.user.id;

    // Get basic data from dashboard
    const dashboard = await this.getHostDashboardUseCase.execute({ hostId });

    return {
      metrics: {
        responseRate: {
          current: dashboard.summary.responseRate,
          target: 90,
          status: dashboard.summary.responseRate >= 90 ? 'excellent' : 'good',
        },
        acceptanceRate: {
          current: dashboard.summary.acceptanceRate,
          target: 80,
          status: dashboard.summary.acceptanceRate >= 80 ? 'excellent' : 'good',
        },
        averageRating: {
          current: dashboard.summary.averageRating,
          target: 4.5,
          status: dashboard.summary.averageRating >= 4.5 ? 'excellent' : 'good',
        },
      },
      pendingActions: dashboard.pendingActions,
      recommendations: [
        dashboard.summary.averageRating < 4.5 ? 'Focus on improving guest satisfaction' : 'Keep up the great work!',
        dashboard.summary.acceptanceRate < 80 ? 'Consider accepting more booking requests' : 'Your acceptance rate is excellent',
        dashboard.pendingActions.bookingRequests > 0 ? `You have ${dashboard.pendingActions.bookingRequests} pending booking requests` : null,
      ].filter(Boolean) as string[],
    };
  }

  /**
   * Get revenue projection
   * Note: Simplified projection based on historical data
   */
  @Get('projection')
  @ApiOperation({ summary: 'Dự báo doanh thu' })
  @ApiResponse({ status: 200, description: 'Revenue projection', type: RevenueProjectionResponseDto })
  async getProjection(@Req() request: Express.Request & { user: { id: string } }): Promise<RevenueProjectionResponseDto> {
    const hostId = request.user.id;

    // Get historical earnings
    const monthEarnings = await this.getHostEarningsUseCase.execute({ hostId, period: 'month' });
    const yearEarnings = await this.getHostEarningsUseCase.execute({ hostId, period: 'year' });

    // Simple projection: average growth rate
    const monthlyAverage = monthEarnings.current.total;
    const projectedNextMonth = monthlyAverage * (1 + (monthEarnings.growth.percentage / 100));
    const projected3Months = projectedNextMonth * 3;

    return {
      nextMonth: {
        estimated: Math.round(projectedNextMonth * 100) / 100,
        confidence: 80,
        basedOn: 'historical data and growth trends',
      },
      next3Months: {
        estimated: Math.round(projected3Months * 100) / 100,
        confidence: 70,
      },
      yearToDate: {
        actual: yearEarnings.current.total,
        monthlyAverage: Math.round(monthlyAverage * 100) / 100,
        totalBookings: yearEarnings.current.bookings,
      },
      note: 'Projections are estimates based on historical data and may vary.',
    };
  }
}

