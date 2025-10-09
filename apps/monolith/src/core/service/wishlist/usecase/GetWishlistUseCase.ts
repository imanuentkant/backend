import { UseCase } from '@core/common/usecase/UseCase';
import { WishlistItem } from '@core/domain/wishlist/entity/WishlistItem';
import { WishlistRepositoryPort } from '@core/domain/wishlist/port/WishlistRepositoryPort';

export interface GetWishlistUseCasePayload {
  userId: string;
}

/**
 * Use Case: Lấy toàn bộ wishlist của user
 */
export class GetWishlistUseCase implements UseCase<GetWishlistUseCasePayload, WishlistItem[]> {
  constructor(private readonly wishlistRepository: WishlistRepositoryPort) {}

  public async execute(payload: GetWishlistUseCasePayload): Promise<WishlistItem[]> {
    return this.wishlistRepository.findByUserId(payload.userId);
  }
}
