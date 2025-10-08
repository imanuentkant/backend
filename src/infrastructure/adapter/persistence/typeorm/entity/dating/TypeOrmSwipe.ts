import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';
import { SwipeAction } from '@core/domain/dating/entity/Swipe';

@Entity('swipes')
@Index(['from_customer_id', 'to_profile_id'], { unique: true })
export class TypeOrmSwipe {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  from_customer_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  to_profile_id: string;

  @Column({
    type: 'enum',
    enum: SwipeAction,
  })
  action: SwipeAction;

  @Column('boolean', { default: false })
  is_super_like: boolean;

  @CreateDateColumn()
  created_at: Date;
}
