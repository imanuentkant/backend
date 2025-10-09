import { Entity, Column, CreateDateColumn, PrimaryColumn, Index } from 'typeorm';

@Entity('wishlist_items')
@Index(['user_id', 'bookable_type', 'bookable_id'], { unique: true })
export class TypeOrmWishlistItem {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  user_id: string;

  @Column('varchar', { length: 20 })
  bookable_type: 'property' | 'vehicle';

  @Column('varchar', { length: 36 })
  bookable_id: string;

  @CreateDateColumn()
  added_at: Date;
}
