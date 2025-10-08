import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO để update giá cho 1 ngày cụ thể
 */
export class UpdateDatePriceDto {
  
  @ApiProperty({ description: 'Ngày (YYYY-MM-DD)' })
  @IsDateString()
  date: string;
  
  @ApiProperty({ description: 'Giá mỗi đêm', minimum: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pricePerNight: number;
}

/**
 * DTO để update bulk pricing
 */
export class BulkUpdatePricingDto {
  
  @ApiProperty({ description: 'Ngày bắt đầu (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;
  
  @ApiProperty({ description: 'Ngày kết thúc (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;
  
  @ApiProperty({ description: 'Giá mỗi đêm', minimum: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pricePerNight: number;
}

/**
 * DTO để block/unblock dates
 */
export class BlockDatesDto {
  
  @ApiProperty({ description: 'Ngày bắt đầu (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;
  
  @ApiProperty({ description: 'Ngày kết thúc (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;
  
  @ApiPropertyOptional({ description: 'Lý do block' })
  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * DTO để update availability rules
 */
export class UpdateAvailabilityRulesDto {
  
  @ApiPropertyOptional({ description: 'Số ngày notice tối thiểu', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  advanceNoticeDays?: number;
  
  @ApiPropertyOptional({ description: 'Số ngày chuẩn bị giữa các booking', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  preparationDays?: number;
  
  @ApiPropertyOptional({ description: 'Số tháng có thể book trước', minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  bookingWindowMonths?: number;
  
  @ApiPropertyOptional({ description: 'Các ngày cho phép check-in (0=CN, 6=T7)', type: [Number] })
  @IsArray()
  @IsOptional()
  checkInDays?: number[];
  
  @ApiPropertyOptional({ description: 'Giờ check-in bắt đầu (HH:mm)' })
  @IsString()
  @IsOptional()
  checkInTimeFrom?: string;
  
  @ApiPropertyOptional({ description: 'Giờ check-in kết thúc (HH:mm)' })
  @IsString()
  @IsOptional()
  checkInTimeTo?: string;
  
  @ApiPropertyOptional({ description: 'Giờ check-out (HH:mm)' })
  @IsString()
  @IsOptional()
  checkOutTime?: string;
}

/**
 * Query DTO để get calendar
 */
export class GetCalendarDto {
  
  @ApiProperty({ description: 'Tháng (1-12)' })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  month: number;
  
  @ApiProperty({ description: 'Năm (YYYY)' })
  @IsNumber()
  @Type(() => Number)
  year: number;
}

