import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, Min, Max, MinLength, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleType, TransmissionType, FuelType, VehicleCondition } from '@core/common/enums/VehicleEnums';

export class CreateVehicleDto {
  
  @ApiProperty({ description: 'Tiêu đề xe', minLength: 5 })
  @IsString()
  @MinLength(5)
  title: string;
  
  @ApiProperty({ description: 'Mô tả chi tiết', minLength: 20 })
  @IsString()
  @MinLength(20)
  description: string;
  
  @ApiProperty({ enum: VehicleType, description: 'Loại xe' })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
  
  @ApiProperty({ description: 'Hãng xe' })
  @IsString()
  brand: string;
  
  @ApiProperty({ description: 'Model xe' })
  @IsString()
  model: string;
  
  @ApiProperty({ description: 'Năm sản xuất', minimum: 1900 })
  @IsNumber()
  @Min(1900)
  @Type(() => Number)
  year: number;
  
  @ApiProperty({ description: 'Biển số xe' })
  @IsString()
  licensePlate: string;
  
  @ApiProperty({ description: 'Màu xe' })
  @IsString()
  color: string;
  
  @ApiProperty({ description: 'Số chỗ ngồi', minimum: 1, maximum: 50 })
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  seats: number;
  
  @ApiProperty({ enum: TransmissionType, description: 'Loại hộp số' })
  @IsEnum(TransmissionType)
  transmissionType: TransmissionType;
  
  @ApiProperty({ enum: FuelType, description: 'Loại nhiên liệu' })
  @IsEnum(FuelType)
  fuelType: FuelType;
  
  @ApiProperty({ enum: VehicleCondition, description: 'Tình trạng xe' })
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;
  
  @ApiProperty({ description: 'Số km đã đi', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  mileage: number;
  
  @ApiProperty({ description: 'Giá thuê mỗi ngày (USD)', minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pricePerDay: number;
  
  @ApiPropertyOptional({ description: 'Giá thuê mỗi giờ (USD)', minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pricePerHour?: number;
  
  @ApiPropertyOptional({ description: 'Đơn vị tiền tệ', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;
  
  @ApiPropertyOptional({ description: 'Tiền đặt cọc (USD)', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  securityDeposit?: number;
  
  @ApiPropertyOptional({ description: 'Phí bảo hiểm mỗi ngày (USD)', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  insuranceFee?: number;
  
  @ApiProperty({ description: 'Địa điểm xe' })
  @IsString()
  location: string;
  
  @ApiPropertyOptional({ description: 'Vĩ độ', minimum: -90, maximum: 90 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;
  
  @ApiPropertyOptional({ description: 'Kinh độ', minimum: -180, maximum: 180 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;
  
  @ApiPropertyOptional({ description: 'Tính năng xe', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}

