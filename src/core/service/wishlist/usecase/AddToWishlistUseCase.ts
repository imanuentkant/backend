import { UseCase } from '@core/common/usecase/UseCase';
import { WishlistItem } from '@core/domain/wishlist/entity/WishlistItem';
import { WishlistRepositoryPort } from '@core/domain/wishlist/port/WishlistRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface AddToWishlistUseCasePayload {
  userId: string;
  bookableType: 'property' | 'vehicle';
  bookableId: string;
}

/**
 * Use Case: Thêm item vào wishlist
 */
export class AddToWishlistUseCase implements UseCase<AddToWishlistUseCasePayload, WishlistItem> {
  constructor(private readonly wishlistRepository: WishlistRepositoryPort) {}

  public async execute(payload: AddToWishlistUseCasePayload): Promise<WishlistItem> {
    // Check if already in wishlist
    const exists = await this.wishlistRepository.exists(
      payload.userId,
      payload.bookableType,
      payload.bookableId,
    );

    if (exists) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Item already in wishlist',
      });
    }

    const item = new WishlistItem({
      userId: payload.userId,
      bookableType: payload.bookableType,
      bookableId: payload.bookableId,
    });

    return this.wishlistRepository.save(item);
  }
}
