import { UseCase } from '@core/common/usecase/UseCase';
import { Property } from '@core/domain/property/entity/Property';
import { PropertyLocation } from '@core/domain/property/entity/PropertyLocation';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

export type CreatePropertyUseCasePayload = {
  hostId: string;
  title: string;
  description: string;
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  currency?: string;
  cleaningFee?: number;
  serviceFeePercentage?: number;
  minimumNights?: number;
  maximumNights?: number;
  instantBooking?: boolean;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
};

export class CreatePropertyUseCase implements UseCase<CreatePropertyUseCasePayload, Property> {
  
  constructor(private readonly propertyRepository: PropertyRepositoryPort) {}
  
  async execute(payload: CreatePropertyUseCasePayload): Promise<Property> {
    const propertyId = UuidGenerator.generate();
    
    // Create location
    const location = new PropertyLocation({
      id: UuidGenerator.generate(),
      propertyId,
      address: payload.location.address,
      city: payload.location.city,
      state: payload.location.state,
      country: payload.location.country,
      postalCode: payload.location.postalCode,
      latitude: payload.location.latitude,
      longitude: payload.location.longitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Create property
    const property = new Property({
      id: propertyId,
      hostId: payload.hostId,
      title: payload.title,
      description: payload.description,
      propertyType: payload.propertyType as any,
      maxGuests: payload.maxGuests,
      bedrooms: payload.bedrooms,
      beds: payload.beds,
      bathrooms: payload.bathrooms,
      pricePerNight: payload.pricePerNight,
      currency: payload.currency || 'USD',
      cleaningFee: payload.cleaningFee || 0,
      serviceFeePercentage: payload.serviceFeePercentage || 14,
      minimumNights: payload.minimumNights || 1,
      maximumNights: payload.maximumNights || 365,
      instantBooking: payload.instantBooking || false,
      status: 'draft' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Set location after construction
    (property as any).location = location;
    
    return await this.propertyRepository.save(property);
  }
}

