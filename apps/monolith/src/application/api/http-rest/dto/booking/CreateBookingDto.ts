import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  
  @ApiProperty({ description: 'Property ID' })
  @IsString()
  propertyId: string;
  
  @ApiProperty({ description: 'Ngày check-in (YYYY-MM-DD)' })
  @IsDateString()
  checkInDate: string;
  
  @ApiProperty({ description: 'Ngày check-out (YYYY-MM-DD)' })
  @IsDateString()
  checkOutDate: string;
  
  @ApiProperty({ description: 'Số khách', minimum: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  numberOfGuests: number;
  
  @ApiPropertyOptional({ description: 'Yêu cầu đặc biệt' })
  @IsString()
  @IsOptional()
  specialRequests?: string;
}

