import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '@core/common/enums/PropertyEnums';

/**
 * Property location response
 */
export class PropertyLocationDto {
  @ApiProperty()
  address: string;
  
  @ApiProperty()
  city: string;
  
  @ApiProperty()
  state: string;
  
  @ApiProperty()
  country: string;
  
  @ApiProperty()
  postalCode: string;
  
  @ApiProperty()
  latitude: number;
  
  @ApiProperty()
  longitude: number;
}

/**
 * Create property response
 */
export class CreatePropertyResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  hostId: string;
  
  @ApiProperty()
  title: string;
  
  @ApiProperty()
  description: string;
  
  @ApiProperty({ enum: PropertyType })
  propertyType: PropertyType;
  
  @ApiProperty()
  maxGuests: number;
  
  @ApiProperty()
  bedrooms: number;
  
  @ApiProperty()
  beds: number;
  
  @ApiProperty()
  bathrooms: number;
  
  @ApiProperty()
  pricePerNight: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty()
  cleaningFee: number;
  
  @ApiProperty()
  minimumNights: number;
  
  @ApiProperty()
  maximumNights: number;
  
  @ApiProperty()
  instantBooking: boolean;
  
  @ApiProperty({ enum: PropertyStatus })
  status: PropertyStatus;
  
  @ApiPropertyOptional({ type: PropertyLocationDto })
  location?: PropertyLocationDto | null;
  
  @ApiProperty()
  createdAt: Date;
}

/**
 * Property list item
 */
export class PropertyListItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  title: string;
  
  @ApiProperty()
  description: string;
  
  @ApiProperty({ enum: PropertyType })
  propertyType: PropertyType;
  
  @ApiProperty()
  maxGuests: number;
  
  @ApiProperty()
  bedrooms: number;
  
  @ApiProperty()
  beds: number;
  
  @ApiProperty()
  bathrooms: number;
  
  @ApiProperty()
  pricePerNight: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty()
  cleaningFee: number;
  
  @ApiProperty({ enum: PropertyStatus })
  status: PropertyStatus;
  
  @ApiPropertyOptional()
  location?: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null;
  
  @ApiPropertyOptional()
  coverPhotoId?: string;
  
  @ApiProperty()
  instantBooking: boolean;
  
  @ApiPropertyOptional()
  rating?: number;
  
  @ApiPropertyOptional()
  reviewCount?: number;
}

/**
 * List properties meta
 */
export class PropertyListMetaDto {
  @ApiProperty()
  page: number;
  
  @ApiProperty()
  limit: number;
  
  @ApiProperty()
  totalItems: number;
  
  @ApiProperty()
  totalPages: number;
  
  @ApiProperty()
  hasNextPage: boolean;
  
  @ApiProperty()
  hasPreviousPage: boolean;
}

/**
 * List properties response
 */
export class ListPropertiesResponseDto {
  @ApiProperty({ type: [PropertyListItemDto] })
  data: PropertyListItemDto[];
  
  @ApiProperty({ type: PropertyListMetaDto })
  meta: PropertyListMetaDto;
}

/**
 * Property detail response
 */
export class PropertyDetailResponseDto extends CreatePropertyResponseDto {
  @ApiProperty()
  serviceFeePercentage: number;
  
  @ApiPropertyOptional({ type: [Object] })
  amenities?: Array<{
    id: string;
    name: string;
    icon: string;
    category: string;
  }>;
  
  @ApiPropertyOptional({ type: [Object] })
  photos?: Array<{
    id: string;
    url: string;
    isCover: boolean;
    order: number;
  }>;
  
  @ApiPropertyOptional()
  rating?: number;
  
  @ApiPropertyOptional()
  reviewCount?: number;
  
  @ApiProperty()
  updatedAt: Date;
}

