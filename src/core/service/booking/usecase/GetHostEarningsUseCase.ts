import { UseCase } from '@core/common/usecase/UseCase';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { BookingStatus } from '@core/common/enums/BookingEnums';

export type GetHostEarningsUseCasePayload = {
  hostId: string;
  period?: 'week' | 'month' | 'year';
};

export type HostEarningsReport = {
  period: string;
  current: {
    total: number;
    bookings: number;
    averagePerBooking: number;
  };
  previous: {
    total: number;
    bookings: number;
    averagePerBooking: number;
  };
  growth: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  byProperty: Array<{
    propertyId: string;
    title: string;
    earnings: number;
    bookings: number;
  }>;
};

export class GetHostEarningsUseCase implements UseCase<GetHostEarningsUseCasePayload, HostEarningsReport> {
  
  constructor(
    private readonly bookingRepository: BookingRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}
  
  async execute(payload: GetHostEarningsUseCasePayload): Promise<HostEarningsReport> {
    const { hostId, period = 'month' } = payload;
    
    const now = new Date();
    let currentStart: Date;
    let previousStart: Date;
    let previousEnd: Date;
    
    // Calculate date ranges based on period
    if (period === 'week') {
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - 7);
      previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7);
      previousEnd = currentStart;
    } else if (period === 'year') {
      currentStart = new Date(now.getFullYear(), 0, 1);
      previousStart = new Date(now.getFullYear() - 1, 0, 1);
      previousEnd = new Date(now.getFullYear() - 1, 11, 31);
    } else { // month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    }
    
    // Get all bookings
    const allBookings = await this.bookingRepository.findByHostId(hostId);
    const completedBookings = allBookings.filter(b => b.getStatus() === BookingStatus.COMPLETED);
    
    // Current period bookings
    const currentBookings = completedBookings.filter(b => 
      b.getCreatedAt() >= currentStart && b.getCreatedAt() <= now
    );
    const currentTotal = currentBookings.reduce((sum, b) => sum + b.getTotalAmount(), 0);
    const currentAverage = currentBookings.length > 0 ? currentTotal / currentBookings.length : 0;
    
    // Previous period bookings
    const previousBookings = completedBookings.filter(b => 
      b.getCreatedAt() >= previousStart && b.getCreatedAt() <= previousEnd
    );
    const previousTotal = previousBookings.reduce((sum, b) => sum + b.getTotalAmount(), 0);
    const previousAverage = previousBookings.length > 0 ? previousTotal / previousBookings.length : 0;
    
    // Calculate growth
    const growthPercentage = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;
    const trend = growthPercentage > 5 ? 'up' : growthPercentage < -5 ? 'down' : 'stable';
    
    // Get properties
    const properties = await this.propertyRepository.findByHostId(hostId);
    
    // Calculate earnings by property
    const byProperty = properties.map(property => {
      const propertyBookings = currentBookings.filter(b => 
        b.getPropertyId() === property.getId()
      );
      const earnings = propertyBookings.reduce((sum, b) => sum + b.getTotalAmount(), 0);
      
      return {
        propertyId: property.getId(),
        title: property.getTitle(),
        earnings,
        bookings: propertyBookings.length,
      };
    }).filter(p => p.bookings > 0);
    
    return {
      period,
      current: {
        total: currentTotal,
        bookings: currentBookings.length,
        averagePerBooking: currentAverage,
      },
      previous: {
        total: previousTotal,
        bookings: previousBookings.length,
        averagePerBooking: previousAverage,
      },
      growth: {
        percentage: Math.round(growthPercentage * 10) / 10,
        trend,
      },
      byProperty,
    };
  }
}

