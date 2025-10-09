import { UseCase } from '@core/common/usecase/UseCase';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { BookingStatus } from '@core/common/enums/BookingEnums';

export type GetHostDashboardUseCasePayload = {
  hostId: string;
};

export type HostDashboardOverview = {
  summary: {
    totalEarnings: number;
    thisMonthEarnings: number;
    totalBookings: number;
    activeListings: number;
    averageRating: number;
    responseRate: number;
    acceptanceRate: number;
  };
  upcomingBookings: {
    count: number;
    nextCheckIn: Date | null;
  };
  pendingActions: {
    bookingRequests: number;
    unansweredMessages: number;
    reviewsToRespond: number;
  };
};

export class GetHostDashboardUseCase implements UseCase<GetHostDashboardUseCasePayload, HostDashboardOverview> {
  
  constructor(
    private readonly bookingRepository: BookingRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}
  
  async execute(payload: GetHostDashboardUseCasePayload): Promise<HostDashboardOverview> {
    const { hostId } = payload;
    
    // Get all host properties
    const properties = await this.propertyRepository.findByHostId(hostId);
    const activeListings = properties.filter(p => p.getStatus() === 'active').length;
    
    // Get all bookings
    const allBookings = await this.bookingRepository.findByHostId(hostId);
    const totalBookings = allBookings.length;
    
    // Calculate total earnings (all completed bookings)
    const completedBookings = allBookings.filter(b => b.getStatus() === BookingStatus.COMPLETED);
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.getTotalAmount(), 0);
    
    // Calculate this month earnings
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthBookings = completedBookings.filter(b => 
      b.getCreatedAt() >= firstDayOfMonth
    );
    const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => sum + b.getTotalAmount(), 0);
    
    // Upcoming bookings (confirmed, check-in date in future)
    const upcomingBookings = allBookings.filter(b => 
      b.getStatus() === BookingStatus.CONFIRMED &&
      b.getCheckInDate() > now
    );
    const nextBooking = upcomingBookings.sort((a, b) => 
      a.getCheckInDate().getTime() - b.getCheckInDate().getTime()
    )[0];
    
    // Pending booking requests
    const pendingBookings = allBookings.filter(b => b.getStatus() === BookingStatus.PENDING);
    
    // Calculate average rating (simplified - would need Review repository)
    const averageRating = 4.8; // TODO: Calculate from reviews
    
    // Calculate response/acceptance rate (simplified - would need message tracking)
    const responseRate = 95; // TODO: Calculate from messages
    const acceptanceRate = completedBookings.length > 0 
      ? (completedBookings.length / allBookings.length) * 100 
      : 0;
    
    return {
      summary: {
        totalEarnings,
        thisMonthEarnings,
        totalBookings,
        activeListings,
        averageRating,
        responseRate,
        acceptanceRate: Math.round(acceptanceRate),
      },
      upcomingBookings: {
        count: upcomingBookings.length,
        nextCheckIn: nextBooking ? nextBooking.getCheckInDate() : null,
      },
      pendingActions: {
        bookingRequests: pendingBookings.length,
        unansweredMessages: 0, // TODO: Implement message tracking
        reviewsToRespond: 0, // TODO: Implement review tracking
      },
    };
  }
}

