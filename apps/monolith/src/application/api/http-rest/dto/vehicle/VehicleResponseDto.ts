import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType, VehicleStatus, TransmissionType, FuelType, VehicleCondition } from '@core/common/enums/VehicleEnums';
import { PricingDetails } from '@core/common/entity/BookableItem';

/**
 * Vehicle pricing info
 */
export class VehiclePricingDto {
  @ApiProperty()
  pricePerDay: number;
  
  @ApiPropertyOptional()
  pricePerHour?: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty()
  securityDeposit: number;
  
  @ApiProperty()
  insuranceFee: number;
}

/**
 * Create vehicle response
 */
export class CreateVehicleResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  ownerId: string;
  
  @ApiProperty()
  title: string;
  
  @ApiProperty()
  description: string;
  
  @ApiProperty({ enum: VehicleType })
  vehicleType: VehicleType;
  
  @ApiProperty()
  brand: string;
  
  @ApiProperty()
  model: string;
  
  @ApiProperty()
  year: number;
  
  @ApiProperty()
  licensePlate: string;
  
  @ApiProperty()
  color: string;
  
  @ApiProperty()
  seats: number;
  
  @ApiProperty({ enum: TransmissionType })
  transmissionType: TransmissionType;
  
  @ApiProperty({ enum: FuelType })
  fuelType: FuelType;
  
  @ApiProperty({ enum: VehicleCondition })
  condition: VehicleCondition;
  
  @ApiProperty()
  mileage: number;
  
  @ApiProperty({ type: VehiclePricingDto })
  pricing: VehiclePricingDto;
  
  @ApiProperty()
  location: string;
  
  @ApiPropertyOptional()
  latitude?: number;
  
  @ApiPropertyOptional()
  longitude?: number;
  
  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;
  
  @ApiProperty()
  instantBooking: boolean;
  
  @ApiProperty({ type: [String] })
  features: string[];
  
  @ApiPropertyOptional()
  coverPhotoId?: string;
  
  @ApiProperty()
  createdAt: Date;
}

/**
 * Vehicle list item
 */
export class VehicleListItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  title: string;
  
  @ApiProperty()
  description: string;
  
  @ApiProperty({ enum: VehicleType })
  vehicleType: VehicleType;
  
  @ApiProperty()
  brand: string;
  
  @ApiProperty()
  model: string;
  
  @ApiProperty()
  year: number;
  
  @ApiProperty()
  color: string;
  
  @ApiProperty()
  seats: number;
  
  @ApiProperty({ enum: TransmissionType })
  transmissionType: TransmissionType;
  
  @ApiProperty({ enum: FuelType })
  fuelType: FuelType;
  
  @ApiProperty({ enum: VehicleCondition })
  condition: VehicleCondition;
  
  @ApiProperty()
  mileage: number;
  
  @ApiProperty()
  pricePerDay: number;
  
  @ApiPropertyOptional()
  pricePerHour?: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty()
  location: string;
  
  @ApiPropertyOptional()
  latitude?: number;
  
  @ApiPropertyOptional()
  longitude?: number;
  
  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;
  
  @ApiProperty()
  instantBooking: boolean;
  
  @ApiProperty({ type: [String] })
  features: string[];
  
  @ApiPropertyOptional()
  coverPhotoId?: string;
}

/**
 * List vehicles response
 */
export class ListVehiclesResponseDto {
  @ApiProperty({ type: [VehicleListItemDto] })
  data: VehicleListItemDto[];
  
  @ApiProperty({ type: Object })
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Vehicle detail response
 */
export class VehicleDetailResponseDto extends CreateVehicleResponseDto {
  @ApiPropertyOptional({ type: Object })
  samplePricing?: {
    days: number;
    breakdown: PricingDetails;
  };
  
  @ApiProperty()
  updatedAt: Date;
}

