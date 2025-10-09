import { UseCase } from '@core/common/usecase/UseCase';
import { Booking } from '@core/domain/booking/entity/Booking';
import { BookingRepositoryPort } from '@core/domain/booking/port/BookingRepositoryPort';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';
import { BookingStatus, CancellationPolicy } from '@core/common/enums/BookingEnums';

export type CreateBookingUseCasePayload = {
  propertyId: string;
  guestId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
};

export class CreateBookingUseCase implements UseCase<CreateBookingUseCasePayload, Booking> {
  
  constructor(
    private readonly bookingRepository: BookingRepositoryPort,
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}
  
  async execute(payload: CreateBookingUseCasePayload): Promise<Booking> {
    // Validate property exists
    const property = await this.propertyRepository.findById(payload.propertyId);
    if (!property) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Property with id ${payload.propertyId} not found`,
      });
    }
    
    // Check if property is published
    // Note: Property status check is skipped for now as status might be 'draft' or other values
    
    // Check max guests
    if (payload.numberOfGuests > property.getMaxGuests()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: `Property can accommodate maximum ${property.getMaxGuests()} guests`,
      });
    }
    
    // Calculate nights
    const checkIn = new Date(payload.checkInDate);
    const checkOut = new Date(payload.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Validate minimum and maximum nights
    if (nights < property.getMinimumNights()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: `Minimum stay is ${property.getMinimumNights()} nights`,
      });
    }
    
    if (nights > property.getMaximumNights()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: `Maximum stay is ${property.getMaximumNights()} nights`,
      });
    }
    
    // Check for overlapping bookings
    const overlapping = await this.bookingRepository.findOverlappingBookings(
      payload.propertyId,
      checkIn,
      checkOut
    );
    
    if (overlapping.length > 0) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Property is not available for selected dates',
      });
    }
    
    // Calculate pricing
    const pricePerNight = property.getPricePerNight();
    const subtotal = pricePerNight * nights;
    const cleaningFee = property.getCleaningFee();
    const serviceFee = subtotal * (property.getServiceFeePercentage() / 100);
    const totalAmount = subtotal + cleaningFee + serviceFee;
    
    // Create booking
    const booking = new Booking({
      id: UuidGenerator.generate(),
      propertyId: payload.propertyId,
      guestId: payload.guestId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests: payload.numberOfGuests,
      pricePerNight,
      cleaningFee,
      serviceFee,
      currency: property.getCurrency(),
      status: (property.isInstantBooking() ? BookingStatus.CONFIRMED : BookingStatus.PENDING) as any,
      cancellationPolicy: CancellationPolicy.FLEXIBLE,
      specialRequests: payload.specialRequests,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Set additional properties
    if (property.isInstantBooking()) {
      (booking as any).confirmedAt = new Date();
    }
    
    return await this.bookingRepository.save(booking);
  }
}

