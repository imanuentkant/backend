import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsBoolean, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType } from '@core/common/enums/PropertyEnums';

export class SearchPropertyDto {
  
  @ApiPropertyOptional({ description: 'Tìm kiếm theo location (city, country)' })
  @IsString()
  @IsOptional()
  location?: string;
  
  @ApiPropertyOptional({ description: 'Vĩ độ (để tìm nearby)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;
  
  @ApiPropertyOptional({ description: 'Kinh độ (để tìm nearby)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;
  
  @ApiPropertyOptional({ description: 'Bán kính tìm kiếm (km)', default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  radiusKm?: number;
  
  @ApiPropertyOptional({ description: 'Ngày check-in (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  checkIn?: string;
  
  @ApiPropertyOptional({ description: 'Ngày check-out (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  checkOut?: string;
  
  @ApiPropertyOptional({ description: 'Số khách', minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  guests?: number;
  
  @ApiPropertyOptional({ enum: PropertyType, description: 'Loại property' })
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;
  
  @ApiPropertyOptional({ description: 'Giá tối thiểu mỗi đêm' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;
  
  @ApiPropertyOptional({ description: 'Giá tối đa mỗi đêm' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;
  
  @ApiPropertyOptional({ description: 'Chỉ instant booking', default: false })
  @IsBoolean()
  @IsOptional()
  instantBooking?: boolean;
  
  @ApiPropertyOptional({ description: 'Số phòng ngủ tối thiểu', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minBedrooms?: number;
  
  @ApiPropertyOptional({ description: 'Sắp xếp theo', enum: ['price', 'rating', 'distance'] })
  @IsString()
  @IsOptional()
  sortBy?: 'price' | 'rating' | 'distance';
  
  @ApiPropertyOptional({ description: 'Thứ tự', enum: ['asc', 'desc'], default: 'asc' })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
  
  @ApiPropertyOptional({ description: 'Số trang', minimum: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;
  
  @ApiPropertyOptional({ description: 'Số items mỗi trang', minimum: 1, maximum: 50, default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number;
}

