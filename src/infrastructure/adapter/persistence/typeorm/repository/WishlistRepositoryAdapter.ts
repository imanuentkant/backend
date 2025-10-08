import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistRepositoryPort } from '@core/domain/wishlist/port/WishlistRepositoryPort';
import { WishlistItem } from '@core/domain/wishlist/entity/WishlistItem';
import { TypeOrmWishlistItem } from '../entity/wishlist/TypeOrmWishlistItem';
import { WishlistMapper } from '../mapper/WishlistMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class WishlistRepositoryAdapter implements WishlistRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmWishlistItem)
    private readonly repository: Repository<TypeOrmWishlistItem>,
  ) {}

  public async save(item: WishlistItem): Promise<WishlistItem> {
    let id = item.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const itemWithId = new WishlistItem({
      id,
      userId: item.getUserId(),
      bookableType: item.getBookableType(),
      bookableId: item.getBookableId(),
      addedAt: item.getAddedAt(),
    });

    const ormEntity = WishlistMapper.toOrm(itemWithId);
    const saved = await this.repository.save(ormEntity);
    return WishlistMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<WishlistItem>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? WishlistMapper.toDomain(ormEntity) : null;
  }

  public async findByUserIdAndBookable(
    userId: string,
    bookableType: 'property' | 'vehicle',
    bookableId: string,
  ): Promise<Nullable<WishlistItem>> {
    const ormEntity = await this.repository.findOne({
      where: {
        user_id: userId,
        bookable_type: bookableType,
        bookable_id: bookableId,
      },
    });
    return ormEntity ? WishlistMapper.toDomain(ormEntity) : null;
  }

  public async findByUserId(userId: string): Promise<WishlistItem[]> {
    const ormEntities = await this.repository.find({
      where: { user_id: userId },
      order: { added_at: 'DESC' },
    });
    return ormEntities.map((entity) => WishlistMapper.toDomain(entity));
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async exists(
    userId: string,
    bookableType: 'property' | 'vehicle',
    bookableId: string,
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        user_id: userId,
        bookable_type: bookableType,
        bookable_id: bookableId,
      },
    });
    return count > 0;
  }
}
