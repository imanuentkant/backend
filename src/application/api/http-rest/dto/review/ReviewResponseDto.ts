import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Rating breakdown
 */
export class RatingBreakdownDto {
  @ApiProperty()
  overall: number;
  
  @ApiProperty()
  cleanliness: number;
  
  @ApiProperty()
  accuracy: number;
  
  @ApiProperty()
  checkin: number;
  
  @ApiProperty()
  communication: number;
  
  @ApiProperty()
  location: number;
  
  @ApiProperty()
  value: number;
}

/**
 * Create review response
 */
export class CreateReviewResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  bookingId: string;
  
  @ApiProperty()
  propertyId: string;
  
  @ApiProperty()
  reviewerId: string;
  
  @ApiProperty({ type: RatingBreakdownDto })
  ratings: RatingBreakdownDto;
  
  @ApiProperty()
  comment: string;
  
  @ApiProperty()
  isPublished: boolean;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  message: string;
}

/**
 * Review list item
 */
export class ReviewListItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  propertyId: string;
  
  @ApiProperty()
  bookingId: string;
  
  @ApiProperty()
  reviewerId: string;
  
  @ApiProperty({ type: RatingBreakdownDto })
  ratings: RatingBreakdownDto;
  
  @ApiProperty()
  comment: string;
  
  @ApiPropertyOptional()
  hostResponse?: string;
  
  @ApiProperty()
  isPublished: boolean;
  
  @ApiProperty()
  createdAt: Date;
}

/**
 * List reviews meta
 */
export class ReviewListMetaDto {
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
 * List reviews response
 */
export class ListReviewsResponseDto {
  @ApiProperty({ type: [ReviewListItemDto] })
  data: ReviewListItemDto[];
  
  @ApiProperty({ type: ReviewListMetaDto })
  meta: ReviewListMetaDto;
}

