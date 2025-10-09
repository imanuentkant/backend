import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadPhotoDto {
  
  @ApiProperty({ description: 'Property ID' })
  @IsString()
  propertyId: string;
  
  @ApiPropertyOptional({ description: 'Caption cho photo' })
  @IsString()
  @IsOptional()
  caption?: string;
  
  @ApiPropertyOptional({ description: 'Set làm cover photo', default: false })
  @IsBoolean()
  @IsOptional()
  isCover?: boolean;
  
  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  orderIndex?: number;
}

export class ReorderPhotosDto {
  
  @ApiProperty({ description: 'Danh sách photo IDs theo thứ tự mới', type: [String] })
  photoIds: string[];
}

export class UpdatePhotoDto {
  
  @ApiPropertyOptional({ description: 'Caption mới' })
  @IsString()
  @IsOptional()
  caption?: string;
  
  @ApiPropertyOptional({ description: 'Set/unset cover photo' })
  @IsBoolean()
  @IsOptional()
  isCover?: boolean;
}

