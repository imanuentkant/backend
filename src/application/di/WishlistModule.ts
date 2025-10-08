import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmWishlistItem } from '@infrastructure/adapter/persistence/typeorm/entity/wishlist/TypeOrmWishlistItem';
import { WishlistRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/WishlistRepositoryAdapter';
import { AddToWishlistUseCase } from '@core/service/wishlist/usecase/AddToWishlistUseCase';
import { RemoveFromWishlistUseCase } from '@core/service/wishlist/usecase/RemoveFromWishlistUseCase';
import { GetWishlistUseCase } from '@core/service/wishlist/usecase/GetWishlistUseCase';
import { CheckWishlistUseCase } from '@core/service/wishlist/usecase/CheckWishlistUseCase';
import { WishlistController } from '@application/api/http-rest/controller/WishlistController';
import { PropertyModule } from './PropertyModule';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmWishlistItem]), PropertyModule],
  controllers: [WishlistController],
  providers: [
    // Repository
    {
      provide: 'WishlistRepositoryPort',
      useClass: WishlistRepositoryAdapter,
    },

    // Use Cases
    {
      provide: AddToWishlistUseCase,
      useFactory: (wishlistRepository: WishlistRepositoryAdapter) => {
        return new AddToWishlistUseCase(wishlistRepository);
      },
      inject: ['WishlistRepositoryPort'],
    },
    {
      provide: RemoveFromWishlistUseCase,
      useFactory: (wishlistRepository: WishlistRepositoryAdapter) => {
        return new RemoveFromWishlistUseCase(wishlistRepository);
      },
      inject: ['WishlistRepositoryPort'],
    },
    {
      provide: GetWishlistUseCase,
      useFactory: (wishlistRepository: WishlistRepositoryAdapter) => {
        return new GetWishlistUseCase(wishlistRepository);
      },
      inject: ['WishlistRepositoryPort'],
    },
    {
      provide: CheckWishlistUseCase,
      useFactory: (wishlistRepository: WishlistRepositoryAdapter) => {
        return new CheckWishlistUseCase(wishlistRepository);
      },
      inject: ['WishlistRepositoryPort'],
    },
  ],
  exports: [AddToWishlistUseCase, RemoveFromWishlistUseCase, GetWishlistUseCase, CheckWishlistUseCase],
})
export class WishlistModule {}
