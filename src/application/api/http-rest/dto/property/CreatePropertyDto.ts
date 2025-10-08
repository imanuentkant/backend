import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, Min, MinLength } from 'class-validator';
import { PropertyType } from '@core/common/enums/PropertyEnums';

export class CreatePropertyDto {
  
  @ApiProperty({ description: 'Tiêu đề property', minLength: 10 })
  @IsString()
  @MinLength(10)
  title: string;
  
  @ApiProperty({ description: 'Mô tả chi tiết', minLength: 50 })
  @IsString()
  @MinLength(50)
  description: string;
  
  @ApiProperty({ enum: PropertyType, description: 'Loại property' })
  @IsEnum(PropertyType)
  propertyType: PropertyType;
  
  @ApiProperty({ description: 'Số khách tối đa', minimum: 1 })
  @IsNumber()
  @Min(1)
  maxGuests: number;
  
  @ApiProperty({ description: 'Số phòng ngủ', minimum: 0 })
  @IsNumber()
  @Min(0)
  bedrooms: number;
  
  @ApiProperty({ description: 'Số giường', minimum: 0 })
  @IsNumber()
  @Min(0)
  beds: number;
  
  @ApiProperty({ description: 'Số phòng tắm', minimum: 0 })
  @IsNumber()
  @Min(0)
  bathrooms: number;
  
  @ApiProperty({ description: 'Giá mỗi đêm (USD)', minimum: 1 })
  @IsNumber()
  @Min(1)
  pricePerNight: number;
  
  @ApiPropertyOptional({ description: 'Phí vệ sinh', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  cleaningFee?: number;
  
  @ApiPropertyOptional({ description: 'Số đêm tối thiểu', minimum: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  minimumNights?: number;
  
  @ApiPropertyOptional({ description: 'Số đêm tối đa', minimum: 1, default: 365 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  maximumNights?: number;
  
  @ApiPropertyOptional({ description: 'Cho phép đặt ngay', default: false })
  @IsBoolean()
  @IsOptional()
  instantBooking?: boolean;
  
  // Location
  @ApiProperty({ description: 'Địa chỉ' })
  @IsString()
  address: string;
  
  @ApiProperty({ description: 'Thành phố' })
  @IsString()
  city: string;
  
  @ApiProperty({ description: 'Tỉnh/Thành' })
  @IsString()
  state: string;
  
  @ApiProperty({ description: 'Quốc gia' })
  @IsString()
  country: string;
  
  @ApiProperty({ description: 'Mã bưu điện' })
  @IsString()
  postalCode: string;
  
  @ApiProperty({ description: 'Vĩ độ', minimum: -90, maximum: 90 })
  @IsNumber()
  latitude: number;
  
  @ApiProperty({ description: 'Kinh độ', minimum: -180, maximum: 180 })
  @IsNumber()
  longitude: number;
  
  // Amenities
  @ApiPropertyOptional({ description: 'Danh sách amenity IDs', type: [String] })
  @IsOptional()
  amenityIds?: string[];
}

