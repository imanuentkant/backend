import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleType } from '@core/common/enums/VehicleEnums';

export class SearchVehicleDto {
  
  @ApiPropertyOptional({ description: 'Địa điểm' })
  @IsString()
  @IsOptional()
  location?: string;
  
  @ApiPropertyOptional({ enum: VehicleType, description: 'Loại xe' })
  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;
  
  @ApiPropertyOptional({ description: 'Ngày bắt đầu thuê (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;
  
  @ApiPropertyOptional({ description: 'Ngày trả xe (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
  
  @ApiPropertyOptional({ description: 'Giá tối thiểu mỗi ngày' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;
  
  @ApiPropertyOptional({ description: 'Giá tối đa mỗi ngày' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;
  
  @ApiPropertyOptional({ description: 'Số chỗ ngồi tối thiểu' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  seats?: number;
  
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

