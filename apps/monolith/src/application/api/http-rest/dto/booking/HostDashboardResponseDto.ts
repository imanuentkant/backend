import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Dashboard summary
 */
export class DashboardSummaryDto {
  @ApiProperty({ description: 'Tổng thu nhập' })
  totalEarnings: number;
  
  @ApiProperty({ description: 'Thu nhập tháng này' })
  thisMonthEarnings: number;
  
  @ApiProperty({ description: 'Tổng số bookings' })
  totalBookings: number;
  
  @ApiProperty({ description: 'Số listings đang active' })
  activeListings: number;
  
  @ApiProperty({ description: 'Rating trung bình' })
  averageRating: number;
  
  @ApiProperty({ description: 'Tỷ lệ phản hồi (%)' })
  responseRate: number;
  
  @ApiProperty({ description: 'Tỷ lệ chấp nhận (%)' })
  acceptanceRate: number;
}

/**
 * Upcoming bookings info
 */
export class UpcomingBookingsDto {
  @ApiProperty({ description: 'Số lượng bookings sắp tới' })
  count: number;
  
  @ApiPropertyOptional({ description: 'Ngày check-in tiếp theo' })
  nextCheckIn: Date | null;
}

/**
 * Pending actions
 */
export class PendingActionsDto {
  @ApiProperty({ description: 'Số booking requests chờ xử lý' })
  bookingRequests: number;
  
  @ApiProperty({ description: 'Số tin nhắn chưa trả lời' })
  unansweredMessages: number;
  
  @ApiProperty({ description: 'Số review cần phản hồi' })
  reviewsToRespond: number;
}

/**
 * Host dashboard overview response
 */
export class HostDashboardOverviewResponseDto {
  @ApiProperty({ type: DashboardSummaryDto })
  summary: DashboardSummaryDto;
  
  @ApiProperty({ type: UpcomingBookingsDto })
  upcomingBookings: UpcomingBookingsDto;
  
  @ApiProperty({ type: PendingActionsDto })
  pendingActions: PendingActionsDto;
}

/**
 * Earnings period data
 */
export class EarningsPeriodDto {
  @ApiProperty({ description: 'Tổng thu nhập' })
  total: number;
  
  @ApiProperty({ description: 'Số bookings' })
  bookings: number;
  
  @ApiProperty({ description: 'Trung bình mỗi booking' })
  averagePerBooking: number;
}

/**
 * Growth info
 */
export class GrowthDto {
  @ApiProperty({ description: 'Phần trăm tăng trưởng' })
  percentage: number;
  
  @ApiProperty({ description: 'Xu hướng', enum: ['up', 'down', 'stable'] })
  trend: 'up' | 'down' | 'stable';
}

/**
 * Earnings by property
 */
export class PropertyEarningsDto {
  @ApiProperty({ description: 'Property ID' })
  propertyId: string;
  
  @ApiProperty({ description: 'Tên property' })
  title: string;
  
  @ApiProperty({ description: 'Thu nhập' })
  earnings: number;
  
  @ApiProperty({ description: 'Số bookings' })
  bookings: number;
}

/**
 * Host earnings report response
 */
export class HostEarningsReportResponseDto {
  @ApiProperty({ description: 'Khoảng thời gian' })
  period: string;
  
  @ApiProperty({ type: EarningsPeriodDto })
  current: EarningsPeriodDto;
  
  @ApiProperty({ type: EarningsPeriodDto })
  previous: EarningsPeriodDto;
  
  @ApiProperty({ type: GrowthDto })
  growth: GrowthDto;
  
  @ApiProperty({ type: [PropertyEarningsDto] })
  byProperty: PropertyEarningsDto[];
}

/**
 * Overall occupancy
 */
export class OverallOccupancyDto {
  @ApiProperty({ description: 'Tỷ lệ lấp đầy (%)' })
  rate: number;
  
  @ApiProperty({ description: 'Số đêm đã book' })
  bookedNights: number;
  
  @ApiProperty({ description: 'Tổng số đêm' })
  totalNights: number;
}

/**
 * Property occupancy
 */
export class PropertyOccupancyDto {
  @ApiProperty()
  propertyId: string;
  
  @ApiProperty()
  title: string;
  
  @ApiProperty({ description: 'Tỷ lệ lấp đầy (%)' })
  occupancyRate: number;
  
  @ApiProperty({ description: 'Số đêm đã book' })
  bookedNights: number;
}

/**
 * Host occupancy report response
 */
export class HostOccupancyReportResponseDto {
  @ApiProperty({ type: OverallOccupancyDto })
  overall: OverallOccupancyDto;
  
  @ApiProperty({ type: [PropertyOccupancyDto] })
  byProperty: PropertyOccupancyDto[];
}

/**
 * Metric info
 */
export class MetricDto {
  @ApiProperty()
  current: number;
  
  @ApiProperty()
  target: number;
  
  @ApiProperty()
  status: string;
}

/**
 * Performance metrics response
 */
export class PerformanceMetricsResponseDto {
  @ApiProperty({ type: Object })
  metrics: {
    responseRate: MetricDto;
    acceptanceRate: MetricDto;
    averageRating: MetricDto;
  };
  
  @ApiProperty({ type: PendingActionsDto })
  pendingActions: PendingActionsDto;
  
  @ApiProperty({ type: [String] })
  recommendations: string[];
}

/**
 * Projection period
 */
export class ProjectionPeriodDto {
  @ApiProperty({ description: 'Doanh thu dự kiến' })
  estimated: number;
  
  @ApiProperty({ description: 'Độ tin cậy (%)' })
  confidence: number;
  
  @ApiPropertyOptional()
  basedOn?: string;
}

/**
 * Year to date data
 */
export class YearToDateDto {
  @ApiProperty({ description: 'Doanh thu thực tế' })
  actual: number;
  
  @ApiProperty({ description: 'Trung bình mỗi tháng' })
  monthlyAverage: number;
  
  @ApiProperty({ description: 'Tổng số bookings' })
  totalBookings: number;
}

/**
 * Revenue projection response
 */
export class RevenueProjectionResponseDto {
  @ApiProperty({ type: ProjectionPeriodDto })
  nextMonth: ProjectionPeriodDto;
  
  @ApiProperty({ type: ProjectionPeriodDto })
  next3Months: ProjectionPeriodDto;
  
  @ApiProperty({ type: YearToDateDto })
  yearToDate: YearToDateDto;
  
  @ApiPropertyOptional()
  note?: string;
}

