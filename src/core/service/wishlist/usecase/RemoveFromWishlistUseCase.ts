import { UseCase } from '@core/common/usecase/UseCase';
import { WishlistRepositoryPort } from '@core/domain/wishlist/port/WishlistRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface RemoveFromWishlistUseCasePayload {
  userId: string;
  bookableType: 'property' | 'vehicle';
  bookableId: string;
}

/**
 * Use Case: Xóa item khỏi wishlist
 */
export class RemoveFromWishlistUseCase implements UseCase<RemoveFromWishlistUseCasePayload, void> {
  constructor(private readonly wishlistRepository: WishlistRepositoryPort) {}

  public async execute(payload: RemoveFromWishlistUseCasePayload): Promise<void> {
    const item = await this.wishlistRepository.findByUserIdAndBookable(
      payload.userId,
      payload.bookableType,
      payload.bookableId,
    );

    if (!item) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Item not found in wishlist',
      });
    }

    await this.wishlistRepository.delete(item.getId());
  }
}
