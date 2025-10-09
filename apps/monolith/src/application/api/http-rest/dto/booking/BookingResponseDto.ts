import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, CancellationPolicy } from '@core/common/enums/BookingEnums';
import { BookableItemType } from '@core/common/entity/BookableItem';

/**
 * Pricing breakdown response
 */
export class PricingBreakdownDto {
  @ApiProperty({ description: 'Giá mỗi đêm' })
  pricePerNight: number;
  
  @ApiProperty({ description: 'Số đêm' })
  nights: number;
  
  @ApiProperty({ description: 'Tổng giá trước phí' })
  subtotal: number;
  
  @ApiProperty({ description: 'Phí vệ sinh' })
  cleaningFee: number;
  
  @ApiProperty({ description: 'Phí dịch vụ' })
  serviceFee: number;
  
  @ApiProperty({ description: 'Tổng cộng' })
  total: number;
  
  @ApiProperty({ description: 'Đơn vị tiền tệ' })
  currency: string;
}

/**
 * Create booking response
 */
export class CreateBookingResponseDto {
  @ApiProperty({ description: 'Booking ID' })
  id: string;
  
  @ApiProperty({ enum: BookableItemType, description: 'Loại item được book' })
  bookableType: BookableItemType;
  
  @ApiProperty({ description: 'ID của item được book' })
  bookableId: string;
  
  @ApiProperty({ description: 'Property ID (backward compatibility)' })
  propertyId: string;
  
  @ApiProperty({ description: 'Guest ID' })
  guestId: string;
  
  @ApiProperty({ description: 'Ngày check-in' })
  checkInDate: Date;
  
  @ApiProperty({ description: 'Ngày check-out' })
  checkOutDate: Date;
  
  @ApiProperty({ description: 'Số khách' })
  numberOfGuests: number;
  
  @ApiProperty({ description: 'Tổng số đêm' })
  totalNights: number;
  
  @ApiProperty({ type: PricingBreakdownDto })
  pricing: PricingBreakdownDto;
  
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;
  
  @ApiProperty({ enum: CancellationPolicy })
  cancellationPolicy: CancellationPolicy;
  
  @ApiPropertyOptional({ description: 'Yêu cầu đặc biệt' })
  specialRequests?: string;
  
  @ApiProperty({ description: 'Ngày tạo' })
  createdAt: Date;
  
  @ApiProperty({ description: 'Message thông báo' })
  message: string;
}

/**
 * Booking list item
 */
export class BookingListItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty({ enum: BookableItemType })
  bookableType: BookableItemType;
  
  @ApiProperty()
  bookableId: string;
  
  @ApiProperty()
  propertyId: string;
  
  @ApiProperty()
  checkInDate: Date;
  
  @ApiProperty()
  checkOutDate: Date;
  
  @ApiProperty()
  totalNights: number;
  
  @ApiProperty()
  numberOfGuests: number;
  
  @ApiProperty()
  totalAmount: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;
  
  @ApiProperty({ enum: CancellationPolicy })
  cancellationPolicy: CancellationPolicy;
  
  @ApiPropertyOptional()
  specialRequests?: string;
  
  @ApiPropertyOptional()
  confirmedAt?: Date;
  
  @ApiPropertyOptional()
  cancelledAt?: Date;
  
  @ApiProperty()
  createdAt: Date;
}

/**
 * List bookings meta
 */
export class BookingListMetaDto {
  @ApiProperty()
  page: number;
  
  @ApiProperty()
  total: number;
  
  @ApiProperty()
  upcoming: number;
  
  @ApiProperty()
  past: number;
  
  @ApiPropertyOptional()
  pending?: number;
  
  @ApiProperty()
  cancelled: number;
  
  @ApiPropertyOptional()
  confirmed?: number;
  
  @ApiPropertyOptional()
  completed?: number;
}

/**
 * List bookings response
 */
export class ListBookingsResponseDto {
  @ApiProperty({ type: [BookingListItemDto] })
  data: BookingListItemDto[];
  
  @ApiProperty({ type: BookingListMetaDto })
  meta: BookingListMetaDto;
}

/**
 * Booking detail response
 */
export class BookingDetailResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty({ enum: BookableItemType })
  bookableType: BookableItemType;
  
  @ApiProperty()
  bookableId: string;
  
  @ApiProperty()
  propertyId: string;
  
  @ApiProperty()
  guestId: string;
  
  @ApiProperty()
  checkInDate: Date;
  
  @ApiProperty()
  checkOutDate: Date;
  
  @ApiProperty()
  numberOfGuests: number;
  
  @ApiProperty()
  totalNights: number;
  
  @ApiProperty({ type: PricingBreakdownDto })
  pricing: PricingBreakdownDto;
  
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;
  
  @ApiProperty({ enum: CancellationPolicy })
  cancellationPolicy: CancellationPolicy;
  
  @ApiPropertyOptional()
  specialRequests?: string;
  
  @ApiPropertyOptional()
  confirmedAt?: Date;
  
  @ApiPropertyOptional()
  cancelledAt?: Date;
  
  @ApiPropertyOptional()
  cancellationReason?: string;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;
  
  @ApiProperty()
  canCancel: boolean;
  
  @ApiProperty()
  canReview: boolean;
}

/**
 * Confirm booking response
 */
export class ConfirmBookingResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;
  
  @ApiPropertyOptional()
  confirmedAt?: Date;
  
  @ApiProperty()
  message: string;
}

/**
 * Cancel booking refund info
 */
export class RefundInfoDto {
  @ApiProperty()
  amount: number;
  
  @ApiProperty()
  percentage: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty()
  processedIn: string;
}

/**
 * Cancel booking response
 */
export class CancelBookingResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;
  
  @ApiPropertyOptional()
  reason?: string;
  
  @ApiPropertyOptional()
  cancelledAt?: Date;
  
  @ApiProperty({ type: RefundInfoDto })
  refund: RefundInfoDto;
  
  @ApiProperty()
  message: string;
}

