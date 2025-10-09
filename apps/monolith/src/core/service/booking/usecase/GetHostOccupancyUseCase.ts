import { UseCase } from '@core/common/usecase/UseCase';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { BookingStatus } from '@core/common/enums/BookingEnums';

export type GetHostOccupancyUseCasePayload = {
  hostId: string;
};

export type HostOccupancyReport = {
  overall: {
    rate: number;
    bookedNights: number;
    totalNights: number;
  };
  byProperty: Array<{
    propertyId: string;
    title: string;
    occupancyRate: number;
    bookedNights: number;
  }>;
};

export class GetHostOccupancyUseCase implements UseCase<GetHostOccupancyUseCasePayload, HostOccupancyReport> {
  
  constructor(
    private readonly bookingRepository: BookingRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}
  
  async execute(payload: GetHostOccupancyUseCasePayload): Promise<HostOccupancyReport> {
    const { hostId } = payload;
    
    // Get properties
    const properties = await this.propertyRepository.findByHostId(hostId);
    const activeProperties = properties.filter(p => p.getStatus() === 'active');
    
    // Calculate total nights available in current month (30 days * number of properties)
    const daysInMonth = 30;
    const totalNights = activeProperties.length * daysInMonth;
    
    // Get all confirmed/completed bookings for this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const allBookings = await this.bookingRepository.findByHostId(hostId);
    const relevantBookings = allBookings.filter(b => 
      (b.getStatus() === BookingStatus.CONFIRMED || b.getStatus() === BookingStatus.COMPLETED) &&
      b.getCheckInDate() <= lastDayOfMonth &&
      b.getCheckOutDate() >= firstDayOfMonth
    );
    
    // Calculate total booked nights
    const totalBookedNights = relevantBookings.reduce((sum, b) => {
      // Calculate overlap with current month
      const bookingStart = b.getCheckInDate() > firstDayOfMonth ? b.getCheckInDate() : firstDayOfMonth;
      const bookingEnd = b.getCheckOutDate() < lastDayOfMonth ? b.getCheckOutDate() : lastDayOfMonth;
      const nights = Math.ceil((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24));
      return sum + Math.max(0, nights);
    }, 0);
    
    const overallRate = totalNights > 0 ? (totalBookedNights / totalNights) * 100 : 0;
    
    // Calculate by property
    const byProperty = activeProperties.map(property => {
      const propertyBookings = relevantBookings.filter(b => 
        b.getPropertyId() === property.getId()
      );
      
      const bookedNights = propertyBookings.reduce((sum, b) => {
        const bookingStart = b.getCheckInDate() > firstDayOfMonth ? b.getCheckInDate() : firstDayOfMonth;
        const bookingEnd = b.getCheckOutDate() < lastDayOfMonth ? b.getCheckOutDate() : lastDayOfMonth;
        const nights = Math.ceil((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24));
        return sum + Math.max(0, nights);
      }, 0);
      
      const occupancyRate = daysInMonth > 0 ? (bookedNights / daysInMonth) * 100 : 0;
      
      return {
        propertyId: property.getId(),
        title: property.getTitle(),
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        bookedNights,
      };
    });
    
    return {
      overall: {
        rate: Math.round(overallRate * 10) / 10,
        bookedNights: totalBookedNights,
        totalNights,
      },
      byProperty,
    };
  }
}

