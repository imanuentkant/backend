import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  
  @ApiProperty({ description: 'Booking ID' })
  @IsString()
  bookingId: string;
  
  @ApiProperty({ description: 'Overall rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingOverall: number;
  
  @ApiProperty({ description: 'Cleanliness rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingCleanliness: number;
  
  @ApiProperty({ description: 'Accuracy rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingAccuracy: number;
  
  @ApiProperty({ description: 'Check-in rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingCheckin: number;
  
  @ApiProperty({ description: 'Communication rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingCommunication: number;
  
  @ApiProperty({ description: 'Location rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingLocation: number;
  
  @ApiProperty({ description: 'Value rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  ratingValue: number;
  
  @ApiProperty({ description: 'Review comment', minLength: 10, maxLength: 1000 })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  comment: string;
}

