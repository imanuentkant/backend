import { UseCase } from '@core/common/usecase/UseCase';
import { WishlistRepositoryPort } from '@core/domain/wishlist/port/WishlistRepositoryPort';
import { Nullable } from '@core/common/type/CommonTypes';
import { WishlistItem } from '@core/domain/wishlist/entity/WishlistItem';

export interface CheckWishlistUseCasePayload {
  userId: string;
  bookableType: 'property' | 'vehicle';
  bookableId: string;
}

export interface CheckWishlistUseCaseResult {
  inWishlist: boolean;
  item: Nullable<WishlistItem>;
}

/**
 * Use Case: Check xem item có trong wishlist không
 */
export class CheckWishlistUseCase
  implements UseCase<CheckWishlistUseCasePayload, CheckWishlistUseCaseResult>
{
  constructor(private readonly wishlistRepository: WishlistRepositoryPort) {}

  public async execute(
    payload: CheckWishlistUseCasePayload,
  ): Promise<CheckWishlistUseCaseResult> {
    const item = await this.wishlistRepository.findByUserIdAndBookable(
      payload.userId,
      payload.bookableType,
      payload.bookableId,
    );

    return {
      inWishlist: !!item,
      item,
    };
  }
}
