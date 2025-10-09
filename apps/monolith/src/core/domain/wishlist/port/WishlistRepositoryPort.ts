import { WishlistItem } from '../entity/WishlistItem';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * Repository Port cho WishlistItem Entity
 */
export interface WishlistRepositoryPort {
  save(item: WishlistItem): Promise<WishlistItem>;
  
  findById(id: string): Promise<Nullable<WishlistItem>>;
  
  findByUserIdAndBookable(
    userId: string,
    bookableType: 'property' | 'vehicle',
    bookableId: string,
  ): Promise<Nullable<WishlistItem>>;
  
  findByUserId(userId: string): Promise<WishlistItem[]>;
  
  delete(id: string): Promise<void>;
  
  exists(userId: string, bookableType: 'property' | 'vehicle', bookableId: string): Promise<boolean>;
}
