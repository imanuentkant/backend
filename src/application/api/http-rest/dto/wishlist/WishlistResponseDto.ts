import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bookableId: string;

  @ApiProperty()
  bookableType: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  addedAt: Date;

  @ApiProperty()
  message: string;
}

export class RemoveFromWishlistResponseDto {
  @ApiProperty()
  bookableId: string;

  @ApiProperty()
  removed: boolean;

  @ApiProperty()
  message: string;
}

export class WishlistItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bookableType: string;

  @ApiProperty()
  bookableId: string;

  @ApiProperty()
  bookable: any; // Property or Vehicle details

  @ApiProperty()
  addedAt: string;
}

export class GetWishlistResponseDto {
  @ApiProperty({ type: [WishlistItemDto] })
  data: WishlistItemDto[];

  @ApiProperty()
  meta: {
    total: number;
  };
}

export class CheckWishlistResponseDto {
  @ApiProperty()
  bookableId: string;

  @ApiProperty()
  inWishlist: boolean;

  @ApiProperty()
  addedAt?: string;
}
