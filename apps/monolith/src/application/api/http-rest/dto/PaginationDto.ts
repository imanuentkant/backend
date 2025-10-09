import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Base DTO cho pagination
 * Sử dụng cho tất cả các endpoints có pagination
 */
export class PaginationDto {
  @ApiPropertyOptional({ 
    description: 'Số trang (bắt đầu từ 1)',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Số items mỗi trang',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Calculate offset for database query
   */
  getOffset(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }

  /**
   * Get limit for database query
   */
  getLimit(): number {
    return this.limit || 10;
  }
}

/**
 * Response wrapper cho paginated data
 */
export class PaginatedResponseDto<T> {
  @ApiPropertyOptional({ description: 'Dữ liệu' })
  data: T[];

  @ApiPropertyOptional({ description: 'Metadata về pagination' })
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  constructor(data: T[], totalItems: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      hasNextPage: page * limit < totalItems,
      hasPreviousPage: page > 1,
    };
  }
}

